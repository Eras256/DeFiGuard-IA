// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AuditRegistry
 * @notice Registry for storing and managing smart contract audit records
 * @dev This contract maintains a history of audits for each contract address
 * and manages certification status based on risk scores
 */
contract AuditRegistry is Ownable {
    /// @notice Maximum valid risk score (0-100 scale)
    uint256 public constant MAX_RISK_SCORE = 100;
    
    /// @notice Risk score threshold for automatic certification
    uint256 public constant CERTIFICATION_THRESHOLD = 40;
    
    /// @notice Maximum number of active audits per contract (prevents unbounded array growth)
    uint256 public constant MAX_AUDITS_PER_CONTRACT = 100;

    /**
     * @notice Audit record structure
     * @param contractAddress The address of the audited contract
     * @param riskScore Risk score from 0-100 (lower is better)
     * @param timestamp Block timestamp when audit was recorded
     * @param reportHash IPFS hash of the full audit report
     * @param isActive Whether this audit record is currently active
     * @param auditor Address of the entity that performed the audit
     */
    struct Audit {
        address contractAddress;
        uint256 riskScore;
        uint256 timestamp;
        string reportHash;
        bool isActive;
        address auditor;
    }

    /// @notice Mapping from contract address to array of audit records
    mapping(address => Audit[]) public contractAudits;
    
    /// @notice Mapping from contract address to certification status
    mapping(address => bool) public isCertified;
    
    /// @notice Total number of audits recorded across all contracts
    uint256 public totalAudits;

    /// @notice Emitted when a new audit is recorded
    event AuditRecorded(
        address indexed contractAddress,
        uint256 indexed riskScore,
        uint256 timestamp,
        string reportHash,
        address indexed auditor,
        uint256 auditIndex
    );
    
    /// @notice Emitted when certification is granted to a contract
    event CertificationGranted(
        address indexed contractAddress,
        uint256 riskScore
    );
    
    /// @notice Emitted when certification is revoked from a contract
    event CertificationRevoked(address indexed contractAddress);
    
    /// @notice Emitted when an audit is deactivated
    event AuditDeactivated(
        address indexed contractAddress,
        uint256 indexed auditIndex
    );

    /// @notice Custom errors for gas optimization
    error InvalidRiskScore(uint256 riskScore);
    error NoAuditsFound(address contractAddress);
    error ZeroAddress();
    error AlreadyCertified(address contractAddress);
    error NotCertified(address contractAddress);

    /**
     * @notice Constructor sets the contract owner
     * @param initialOwner Address that will own the contract
     */
    constructor(address initialOwner) Ownable(initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
    }

    /**
     * @notice Record a new audit for a contract
     * @param _contractAddress Address of the contract being audited
     * @param _riskScore Risk score from 0-100 (lower is better)
     * @param _reportHash IPFS hash of the full audit report
     * @param _auditor Address of the entity performing the audit (defaults to msg.sender if zero)
     * @dev Automatically grants certification if risk score is below threshold
     * @dev Automatically deactivates oldest audits if MAX_AUDITS_PER_CONTRACT is reached
     */
    function recordAudit(
        address _contractAddress,
        uint256 _riskScore,
        string memory _reportHash,
        address _auditor
    ) external onlyOwner {
        if (_contractAddress == address(0)) revert ZeroAddress();
        if (_riskScore > MAX_RISK_SCORE) revert InvalidRiskScore(_riskScore);
        
        uint256 currentTimestamp = block.timestamp;
        
        // Use provided auditor address or default to msg.sender
        address auditorAddress = _auditor == address(0) ? msg.sender : _auditor;
        
        Audit memory newAudit = Audit({
            contractAddress: _contractAddress,
            riskScore: _riskScore,
            timestamp: currentTimestamp,
            reportHash: _reportHash,
            isActive: true,
            auditor: auditorAddress
        });
        
        Audit[] storage audits = contractAudits[_contractAddress];
        
        // Manage array size: deactivate oldest active audits if limit reached
        // Count active audits first
        uint256 activeCount = 0;
        for (uint256 i = 0; i < audits.length; i++) {
            if (audits[i].isActive) {
                activeCount++;
            }
        }
        
        // If we've reached the limit, deactivate the oldest active audit
        if (activeCount >= MAX_AUDITS_PER_CONTRACT) {
            // Find the oldest active audit (first active one encountered)
            for (uint256 i = 0; i < audits.length; i++) {
                if (audits[i].isActive) {
                    audits[i].isActive = false;
                    emit AuditDeactivated(_contractAddress, i);
                    break;
                }
            }
        }
        
        uint256 auditIndex = audits.length;
        audits.push(newAudit);
        totalAudits++;
        
        // Auto-certify if low risk and not already certified
        // Auto-revoke if risk score is above threshold (prevents stale certification)
        if (_riskScore < CERTIFICATION_THRESHOLD) {
            if (!isCertified[_contractAddress]) {
                isCertified[_contractAddress] = true;
                emit CertificationGranted(_contractAddress, _riskScore);
            }
        } else {
            // Revoke certification if new audit shows high risk
            if (isCertified[_contractAddress]) {
                isCertified[_contractAddress] = false;
                emit CertificationRevoked(_contractAddress);
            }
        }
        
        emit AuditRecorded(
            _contractAddress,
            _riskScore,
            currentTimestamp,
            _reportHash,
            auditorAddress,
            auditIndex
        );
    }
    
    /**
     * @notice Record a new audit for a contract (backward compatible overload)
     * @param _contractAddress Address of the contract being audited
     * @param _riskScore Risk score from 0-100 (lower is better)
     * @param _reportHash IPFS hash of the full audit report
     * @dev Calls recordAudit with msg.sender as auditor for backward compatibility
     */
    function recordAudit(
        address _contractAddress,
        uint256 _riskScore,
        string memory _reportHash
    ) external onlyOwner {
        recordAudit(_contractAddress, _riskScore, _reportHash, address(0));
    }

    /**
     * @notice Get the latest audit record for a contract
     * @param _contractAddress Address of the contract to query
     * @return Latest audit record
     */
    function getLatestAudit(address _contractAddress) 
        external 
        view 
        returns (Audit memory) 
    {
        Audit[] memory audits = contractAudits[_contractAddress];
        if (audits.length == 0) revert NoAuditsFound(_contractAddress);
        return audits[audits.length - 1];
    }

    /**
     * @notice Get all audit records for a contract
     * @param _contractAddress Address of the contract to query
     * @return Array of all audit records
     * @dev WARNING: This function may revert if the array is too large (DoS risk).
     * Consider using getAuditsPaginated for contracts with many audits.
     */
    function getAllAudits(address _contractAddress)
        external
        view
        returns (Audit[] memory)
    {
        return contractAudits[_contractAddress];
    }

    /**
     * @notice Get audit records for a contract with pagination
     * @param _contractAddress Address of the contract to query
     * @param _startIndex Starting index (0-based)
     * @param _count Number of records to retrieve
     * @return Array of audit records
     * @dev Use this function instead of getAllAudits for contracts with many audits to avoid DoS
     */
    function getAuditsPaginated(
        address _contractAddress,
        uint256 _startIndex,
        uint256 _count
    )
        external
        view
        returns (Audit[] memory)
    {
        Audit[] memory allAudits = contractAudits[_contractAddress];
        uint256 totalAudits = allAudits.length;
        
        if (_startIndex >= totalAudits) {
            return new Audit[](0);
        }
        
        uint256 endIndex = _startIndex + _count;
        if (endIndex > totalAudits) {
            endIndex = totalAudits;
        }
        
        uint256 resultLength = endIndex - _startIndex;
        Audit[] memory result = new Audit[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = allAudits[_startIndex + i];
        }
        
        return result;
    }

    /**
     * @notice Get the number of audits for a contract
     * @param _contractAddress Address of the contract to query
     * @return Number of audit records
     */
    function getAuditCount(address _contractAddress) 
        external 
        view 
        returns (uint256) 
    {
        return contractAudits[_contractAddress].length;
    }

    /**
     * @notice Manually grant certification to a contract
     * @param _contractAddress Address of the contract to certify
     */
    function grantCertification(address _contractAddress) external onlyOwner {
        if (_contractAddress == address(0)) revert ZeroAddress();
        if (isCertified[_contractAddress]) revert AlreadyCertified(_contractAddress);
        
        isCertified[_contractAddress] = true;
        
        // Get latest risk score if available
        uint256 riskScore = 0;
        Audit[] memory audits = contractAudits[_contractAddress];
        if (audits.length > 0) {
            riskScore = audits[audits.length - 1].riskScore;
        }
        
        emit CertificationGranted(_contractAddress, riskScore);
    }

    /**
     * @notice Revoke certification from a contract
     * @param _contractAddress Address of the contract to decertify
     */
    function revokeCertification(address _contractAddress) external onlyOwner {
        if (_contractAddress == address(0)) revert ZeroAddress();
        if (!isCertified[_contractAddress]) revert NotCertified(_contractAddress);
        
        isCertified[_contractAddress] = false;
        emit CertificationRevoked(_contractAddress);
    }

    /**
     * @notice Check if a contract is certified
     * @param _contractAddress Address of the contract to check
     * @return True if certified, false otherwise
     */
    function checkCertification(address _contractAddress)
        external
        view
        returns (bool)
    {
        return isCertified[_contractAddress];
    }
    
    /**
     * @notice Deactivate a specific audit record
     * @param _contractAddress Address of the contract
     * @param _auditIndex Index of the audit to deactivate
     * @dev Only owner can deactivate audits. Useful for managing array size or removing invalid audits.
     */
    function deactivateAudit(
        address _contractAddress,
        uint256 _auditIndex
    ) external onlyOwner {
        if (_contractAddress == address(0)) revert ZeroAddress();
        
        Audit[] storage audits = contractAudits[_contractAddress];
        if (_auditIndex >= audits.length) revert NoAuditsFound(_contractAddress);
        
        if (!audits[_auditIndex].isActive) {
            revert("Audit already deactivated");
        }
        
        audits[_auditIndex].isActive = false;
        emit AuditDeactivated(_contractAddress, _auditIndex);
    }
    
    /**
     * @notice Get only active audit records for a contract
     * @param _contractAddress Address of the contract to query
     * @return Array of active audit records
     * @dev This function filters out deactivated audits, preventing DoS from large arrays
     */
    function getActiveAudits(address _contractAddress)
        external
        view
        returns (Audit[] memory)
    {
        Audit[] memory allAudits = contractAudits[_contractAddress];
        uint256 activeCount = 0;
        
        // Count active audits
        for (uint256 i = 0; i < allAudits.length; i++) {
            if (allAudits[i].isActive) {
                activeCount++;
            }
        }
        
        // Build array of active audits
        Audit[] memory activeAudits = new Audit[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allAudits.length; i++) {
            if (allAudits[i].isActive) {
                activeAudits[currentIndex] = allAudits[i];
                currentIndex++;
            }
        }
        
        return activeAudits;
    }
    
    /**
     * @notice Get active audit records with pagination
     * @param _contractAddress Address of the contract to query
     * @param _startIndex Starting index (0-based) in the active audits array
     * @param _count Number of active records to retrieve
     * @return Array of active audit records
     * @dev More gas-efficient than getActiveAudits for contracts with many audits
     */
    function getActiveAuditsPaginated(
        address _contractAddress,
        uint256 _startIndex,
        uint256 _count
    )
        external
        view
        returns (Audit[] memory)
    {
        Audit[] memory allAudits = contractAudits[_contractAddress];
        
        // First pass: count active audits up to startIndex
        uint256 activeCount = 0;
        uint256 startActiveIndex = 0;
        bool foundStart = false;
        
        for (uint256 i = 0; i < allAudits.length; i++) {
            if (allAudits[i].isActive) {
                if (activeCount == _startIndex && !foundStart) {
                    startActiveIndex = i;
                    foundStart = true;
                }
                if (!foundStart) {
                    activeCount++;
                }
            }
        }
        
        if (!foundStart) {
            return new Audit[](0);
        }
        
        // Second pass: collect active audits
        uint256 collected = 0;
        uint256 resultLength = _count;
        uint256 totalActive = 0;
        
        // Count total active audits
        for (uint256 i = 0; i < allAudits.length; i++) {
            if (allAudits[i].isActive) {
                totalActive++;
            }
        }
        
        if (_startIndex >= totalActive) {
            return new Audit[](0);
        }
        
        if (_startIndex + _count > totalActive) {
            resultLength = totalActive - _startIndex;
        }
        
        Audit[] memory result = new Audit[](resultLength);
        
        for (uint256 i = startActiveIndex; i < allAudits.length && collected < resultLength; i++) {
            if (allAudits[i].isActive) {
                result[collected] = allAudits[i];
                collected++;
            }
        }
        
        return result;
    }
}

