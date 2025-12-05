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
    
    /// @notice Maximum number of active audits per contract
    uint256 public constant MAX_AUDITS_PER_CONTRACT = 100;
    
    /// @notice Maximum total audits per contract (prevents unbounded array growth and DoS)
    /// @dev When this limit is reached, oldest audit is removed (not just deactivated)
    uint256 public constant MAX_TOTAL_AUDITS_PER_CONTRACT = 150;
    
    /// @notice Maximum active audits that can be retrieved in a single call (DoS protection)
    /// @dev Prevents gas limit issues when retrieving all active audits
    uint256 public constant MAX_ACTIVE_AUDITS_PER_CALL = 50;

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
    
    /// @notice Mapping from contract address to the owner who registered the audit
    /// @dev This allows the contract owner to mint their certification badge
    mapping(address => address) public contractOwner;
    
    /// @notice Mapping from contract address to the next write index (for circular buffer)
    /// @dev When array is full, this tracks where to overwrite (circular buffer pattern)
    mapping(address => uint256) private nextWriteIndex;
    
    /// @notice Mapping from contract address to total audits ever recorded (for this address)
    /// @dev Used to determine if we should use circular overwrite or append
    mapping(address => uint256) private totalAuditsForContract;
    
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
    error AuditAlreadyDeactivated();
    error TooManyActiveAudits(uint256 activeCount, uint256 maxAllowed);

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
        recordAuditInternal(_contractAddress, _riskScore, _reportHash, _auditor);
    }
    
    /**
     * @notice Record a new audit for a contract (backward compatible overload)
     * @param _contractAddress Address of the contract being audited
     * @param _riskScore Risk score from 0-100 (lower is better)
     * @param _reportHash IPFS hash of the full audit report
     * @dev Calls recordAuditInternal with msg.sender as auditor for backward compatibility
     */
    function recordAudit(
        address _contractAddress,
        uint256 _riskScore,
        string memory _reportHash
    ) external onlyOwner {
        recordAuditInternal(_contractAddress, _riskScore, _reportHash, address(0));
    }

    /**
     * @notice Internal function to record audit (used by both overloads)
     * @dev Implements DoS protection by limiting total array size and removing oldest audits
     * @dev Optimized to use single-pass iteration for gas efficiency
     */
    function recordAuditInternal(
        address _contractAddress,
        uint256 _riskScore,
        string memory _reportHash,
        address _auditor
    ) internal {
        if (_contractAddress == address(0)) revert ZeroAddress();
        if (_riskScore > MAX_RISK_SCORE) revert InvalidRiskScore(_riskScore);
        
        Audit[] storage audits = contractAudits[_contractAddress];
        uint256 currentLength = audits.length;
        uint256 auditIndex;
        
        // OPTIMIZED: Single-pass iteration to count active audits and find oldest active
        {
            uint256 activeCount = 0;
            uint256 oldestActiveIndex = type(uint256).max;
            
            for (uint256 i = 0; i < currentLength; i++) {
                if (audits[i].isActive) {
                    activeCount++;
                    if (oldestActiveIndex == type(uint256).max) {
                        oldestActiveIndex = i;
                    }
                }
            }
            
            // Manage active audit limit: deactivate oldest active if limit reached
            if (activeCount >= MAX_AUDITS_PER_CONTRACT && oldestActiveIndex != type(uint256).max) {
                audits[oldestActiveIndex].isActive = false;
                emit AuditDeactivated(_contractAddress, oldestActiveIndex);
            }
        }
        
        // CRITICAL FIX: O(1) circular buffer pattern instead of O(N) array shifting
        // This prevents DoS by keeping gas costs constant regardless of array size
        address auditorAddress = _auditor == address(0) ? msg.sender : _auditor;
        
        if (currentLength < MAX_TOTAL_AUDITS_PER_CONTRACT) {
            // Array not full yet: append new audit (O(1))
            auditIndex = currentLength;
            audits.push(Audit({
                contractAddress: _contractAddress,
                riskScore: _riskScore,
                timestamp: block.timestamp,
                reportHash: _reportHash,
                isActive: true,
                auditor: auditorAddress
            }));
        } else {
            // Array is full: overwrite using circular buffer (O(1))
            auditIndex = nextWriteIndex[_contractAddress];
            audits[auditIndex] = Audit({
                contractAddress: _contractAddress,
                riskScore: _riskScore,
                timestamp: block.timestamp,
                reportHash: _reportHash,
                isActive: true,
                auditor: auditorAddress
            });
            // Update circular buffer index for next write
            nextWriteIndex[_contractAddress] = (auditIndex + 1) % MAX_TOTAL_AUDITS_PER_CONTRACT;
        }
        
        totalAuditsForContract[_contractAddress]++;
        totalAudits++;
        
        // Store the contract owner (the one who registered the audit)
        // This allows them to mint their certification badge later
        if (contractOwner[_contractAddress] == address(0)) {
            contractOwner[_contractAddress] = auditorAddress;
        }
        
        // Auto-certify if low risk and not already certified
        // Auto-revoke if risk score is above threshold (prevents stale certification)
        if (_riskScore < CERTIFICATION_THRESHOLD) {
            if (!isCertified[_contractAddress]) {
                isCertified[_contractAddress] = true;
                emit CertificationGranted(_contractAddress, _riskScore);
            }
        } else {
            if (isCertified[_contractAddress]) {
                isCertified[_contractAddress] = false;
                emit CertificationRevoked(_contractAddress);
            }
        }
        
        emit AuditRecorded(
            _contractAddress,
            _riskScore,
            block.timestamp,
            _reportHash,
            auditorAddress,
            auditIndex
        );
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
     * @dev ⚠️ WARNING: This function may REVERT due to gas limits if the array is large!
     * @dev The array can contain up to MAX_TOTAL_AUDITS_PER_CONTRACT (150) audits.
     * @dev Each Audit struct contains multiple fields, making this potentially very gas-expensive.
     * @dev RECOMMENDED: Use getAuditsPaginated() instead for gas-efficient paginated access.
     * @dev This function is kept for backward compatibility but paginated version is strongly recommended.
     * @dev Note: No explicit limit here as MAX_TOTAL_AUDITS_PER_CONTRACT already limits array size,
     *      but gas costs can still be high. Use pagination for better UX.
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
        uint256 totalAuditCount = allAudits.length;
        
        if (_startIndex >= totalAuditCount) {
            return new Audit[](0);
        }
        
        uint256 endIndex = _startIndex + _count;
        if (endIndex > totalAuditCount) {
            endIndex = totalAuditCount;
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
            revert AuditAlreadyDeactivated();
        }
        
        audits[_auditIndex].isActive = false;
        emit AuditDeactivated(_contractAddress, _auditIndex);
    }
    
    /**
     * @notice Get only active audit records for a contract
     * @param _contractAddress Address of the contract to query
     * @return Array of active audit records
     * @dev ⚠️ WARNING: This function has a hard limit to prevent DoS attacks!
     * @dev Maximum MAX_ACTIVE_AUDITS_PER_CALL (50) active audits can be retrieved per call.
     * @dev If more active audits exist, use getActiveAuditsPaginated() for paginated access.
     * @dev This function is kept for backward compatibility but paginated version is recommended.
     */
    function getActiveAudits(address _contractAddress)
        external
        view
        returns (Audit[] memory)
    {
        Audit[] memory allAudits = contractAudits[_contractAddress];
        uint256 activeCount = 0;
        
        // Count active audits first
        for (uint256 i = 0; i < allAudits.length; i++) {
            if (allAudits[i].isActive) {
                activeCount++;
            }
        }
        
        // CRITICAL: DoS protection - limit number of audits returned
        if (activeCount > MAX_ACTIVE_AUDITS_PER_CALL) {
            revert TooManyActiveAudits(activeCount, MAX_ACTIVE_AUDITS_PER_CALL);
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
     * @dev OPTIMIZED: Single-pass iteration for gas efficiency
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
        
        // OPTIMIZED: Single pass to count total active and find start position
        uint256 totalActive = 0;
        uint256 startPosition = type(uint256).max; // "Not found" marker
        uint256 currentActiveIndex = 0;
        
        // First, count total active audits and find start position in single pass
        for (uint256 i = 0; i < allAudits.length; i++) {
            if (allAudits[i].isActive) {
                totalActive++;
                // Find the starting position for pagination
                if (currentActiveIndex == _startIndex && startPosition == type(uint256).max) {
                    startPosition = i;
                }
                if (startPosition == type(uint256).max) {
                    currentActiveIndex++;
                }
            }
        }
        
        // Validate start index
        if (_startIndex >= totalActive || startPosition == type(uint256).max) {
            return new Audit[](0);
        }
        
        // Calculate result length
        uint256 resultLength = _count;
        if (_startIndex + _count > totalActive) {
            resultLength = totalActive - _startIndex;
        }
        
        // Collect results in single pass from start position
        Audit[] memory result = new Audit[](resultLength);
        uint256 collected = 0;
        
        for (uint256 i = startPosition; i < allAudits.length && collected < resultLength; i++) {
            if (allAudits[i].isActive) {
                result[collected] = allAudits[i];
                collected++;
            }
        }
        
        return result;
    }
}

