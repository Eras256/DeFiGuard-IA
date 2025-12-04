// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AuditRegistry is Ownable {
    struct Audit {
        address contractAddress;
        uint256 riskScore;
        uint256 timestamp;
        string reportHash; // IPFS hash of full report
        bool isActive;
    }

    mapping(address => Audit[]) public contractAudits;
    mapping(address => bool) public isCertified;
    
    event AuditRecorded(
        address indexed contractAddress,
        uint256 riskScore,
        uint256 timestamp,
        string reportHash
    );
    
    event CertificationGranted(address indexed contractAddress);
    event CertificationRevoked(address indexed contractAddress);

    constructor() Ownable(msg.sender) {}

    function recordAudit(
        address _contractAddress,
        uint256 _riskScore,
        string memory _reportHash
    ) external onlyOwner {
        require(_riskScore <= 100, "Invalid risk score");
        
        Audit memory newAudit = Audit({
            contractAddress: _contractAddress,
            riskScore: _riskScore,
            timestamp: block.timestamp,
            reportHash: _reportHash,
            isActive: true
        });
        
        contractAudits[_contractAddress].push(newAudit);
        
        // Auto-certify if low risk
        if (_riskScore < 40) {
            isCertified[_contractAddress] = true;
            emit CertificationGranted(_contractAddress);
        }
        
        emit AuditRecorded(_contractAddress, _riskScore, block.timestamp, _reportHash);
    }

    function getLatestAudit(address _contractAddress) 
        external 
        view 
        returns (Audit memory) 
    {
        Audit[] memory audits = contractAudits[_contractAddress];
        require(audits.length > 0, "No audits found");
        return audits[audits.length - 1];
    }

    function getAuditCount(address _contractAddress) 
        external 
        view 
        returns (uint256) 
    {
        return contractAudits[_contractAddress].length;
    }

    function grantCertification(address _contractAddress) external onlyOwner {
        isCertified[_contractAddress] = true;
        emit CertificationGranted(_contractAddress);
    }

    function revokeCertification(address _contractAddress) external onlyOwner {
        isCertified[_contractAddress] = false;
        emit CertificationRevoked(_contractAddress);
    }
}

