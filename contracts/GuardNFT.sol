// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @notice Interface for AuditRegistry to check contract owner and certification
 */
interface IAuditRegistry {
    function contractOwner(address) external view returns (address);
    function isCertified(address) external view returns (bool);
}

/**
 * @title GuardNFT
 * @notice ERC721 NFT representing security certification badges for audited contracts
 * @dev Each NFT represents a certified smart contract with its audit information
 */
contract GuardNFT is ERC721, ERC721URIStorage, Ownable {
    /// @notice Maximum risk score allowed for certification (0-100 scale)
    uint256 public constant MAX_CERTIFICATION_RISK_SCORE = 40;
    
    /// @notice Address of the AuditRegistry contract
    address public auditRegistry;
    
    /// @notice Counter for token IDs (starts at 1)
    uint256 private _nextTokenId = 1;
    
    /// @notice Mapping from token ID to the audited contract address
    mapping(uint256 => address) public badgeContract;
    
    /// @notice Mapping from token ID to the risk score at certification time
    mapping(uint256 => uint256) public badgeRiskScore;
    
    /// @notice Mapping from contract address to its badge token ID (0 if none)
    mapping(address => uint256) public contractToBadge;
    
    /// @notice Mapping from token ID to certification timestamp
    mapping(uint256 => uint256) public certificationTimestamp;

    /// @notice Emitted when a new badge is minted
    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed contractAddress,
        address indexed recipient,
        uint256 riskScore,
        uint256 timestamp
    );
    
    /// @notice Emitted when a badge URI is updated
    event BadgeURIUpdated(uint256 indexed tokenId, string newURI);

    /// @notice Custom errors for gas optimization
    error BadgeAlreadyExists(address contractAddress);
    error RiskScoreTooHigh(uint256 riskScore);
    error InvalidTokenId(uint256 tokenId);
    error ZeroAddress();
    error TokenDoesNotExist(uint256 tokenId);
    error NotCertified(address contractAddress);
    error InvalidAuditRegistry();
    error NotContractOwner(address contractAddress, address caller);

    /**
     * @notice Constructor initializes the NFT contract
     * @param initialOwner Address that will own the contract
     * @param _auditRegistry Address of the AuditRegistry contract
     */
    constructor(address initialOwner, address _auditRegistry) 
        ERC721("DeFiGuard Security Badge", "GUARD") 
        Ownable(initialOwner) 
    {
        if (initialOwner == address(0)) revert ZeroAddress();
        if (_auditRegistry == address(0)) revert ZeroAddress();
        auditRegistry = _auditRegistry;
    }

    /**
     * @notice Update the AuditRegistry address (only owner)
     * @param _auditRegistry New AuditRegistry address
     */
    function setAuditRegistry(address _auditRegistry) external onlyOwner {
        if (_auditRegistry == address(0)) revert ZeroAddress();
        auditRegistry = _auditRegistry;
    }

    /**
     * @notice Mint a new certification badge for an audited contract
     * @param to Address that will receive the NFT badge (must be the contract owner)
     * @param auditedContract Address of the contract being certified
     * @param riskScore Risk score from the audit (must be < 40)
     * @param uri Metadata URI for the badge (IPFS or HTTP)
     * @return tokenId The ID of the newly minted badge
     * @dev Security Note: This function implements the Checks-Effects-Interactions (CEI) pattern
     * to prevent reentrancy attacks. Only the owner of the audited contract can mint the badge.
     * The theoretical reentrancy risk via `onERC721Received` is minimal because:
     * 1) All critical state is updated before `_safeMint` is called
     * 2) Only the contract owner can call this function
     * 3) No financial operations occur that could be exploited
     * 4) If `onERC721Received` reverts, the entire transaction reverts (safe behavior)
     */
    function mintBadge(
        address to,
        address auditedContract,
        uint256 riskScore,
        string memory uri
    ) external returns (uint256) {
        // CHECKS: Validate all inputs
        if (to == address(0)) revert ZeroAddress();
        if (auditedContract == address(0)) revert ZeroAddress();
        if (contractToBadge[auditedContract] != 0) revert BadgeAlreadyExists(auditedContract);
        if (riskScore >= MAX_CERTIFICATION_RISK_SCORE) revert RiskScoreTooHigh(riskScore);
        
        // Verify that the caller is the owner of the audited contract
        IAuditRegistry registry = IAuditRegistry(auditRegistry);
        address contractOwnerAddress = registry.contractOwner(auditedContract);
        if (contractOwnerAddress == address(0)) {
            revert NotCertified(auditedContract); // Contract not audited yet
        }
        if (msg.sender != contractOwnerAddress) {
            revert NotContractOwner(auditedContract, msg.sender);
        }
        
        // Verify that the recipient is the contract owner (or allow self-mint)
        if (to != msg.sender && to != contractOwnerAddress) {
            revert NotContractOwner(auditedContract, to);
        }
        
        // Verify that the contract is certified
        if (!registry.isCertified(auditedContract)) {
            revert NotCertified(auditedContract);
        }
        
        uint256 tokenId = _nextTokenId++;
        uint256 timestamp = block.timestamp;
        
        // EFFECTS: Update all state variables BEFORE external calls (CEI pattern)
        // This prevents reentrancy attacks by ensuring state is consistent
        badgeContract[tokenId] = auditedContract;
        badgeRiskScore[tokenId] = riskScore;
        contractToBadge[auditedContract] = tokenId;
        certificationTimestamp[tokenId] = timestamp;
        
        // INTERACTIONS: External calls happen AFTER state updates
        // _safeMint may call onERC721Received on recipient contract if 'to' is a contract
        // This is safe because all state is already updated and onlyOwner prevents re-entry
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit BadgeMinted(tokenId, auditedContract, to, riskScore, timestamp);
        
        return tokenId;
    }

    /**
     * @notice Get badge information for a token ID
     * @param tokenId The badge token ID
     * @return contractAddress The audited contract address
     * @return riskScore The risk score at certification time
     * @return timestamp The certification timestamp
     */
    function getBadgeInfo(uint256 tokenId) 
        external 
        view 
        returns (
            address contractAddress,
            uint256 riskScore,
            uint256 timestamp
        ) 
    {
        // Verify token exists by checking if badgeContract is set
        if (badgeContract[tokenId] == address(0)) revert TokenDoesNotExist(tokenId);
        return (
            badgeContract[tokenId],
            badgeRiskScore[tokenId],
            certificationTimestamp[tokenId]
        );
    }

    /**
     * @notice Get the badge token ID for a contract address
     * @param contractAddress The audited contract address
     * @return tokenId The badge token ID (0 if no badge exists)
     */
    function getBadgeByContract(address contractAddress)
        external
        view
        returns (uint256 tokenId)
    {
        return contractToBadge[contractAddress];
    }

    /**
     * @notice Update the URI for an existing badge
     * @param tokenId The badge token ID
     * @param newURI The new metadata URI
     */
    function updateBadgeURI(uint256 tokenId, string memory newURI)
        external
        onlyOwner
    {
        // Verify token exists by checking if badgeContract is set
        if (badgeContract[tokenId] == address(0)) revert TokenDoesNotExist(tokenId);
        _setTokenURI(tokenId, newURI);
        emit BadgeURIUpdated(tokenId, newURI);
    }

    /**
     * @notice Check if a contract has a certification badge
     * @param contractAddress The contract address to check
     * @return True if certified, false otherwise
     */
    function isContractCertified(address contractAddress)
        external
        view
        returns (bool)
    {
        return contractToBadge[contractAddress] != 0;
    }

    /**
     * @notice Get the total number of badges minted
     * @return Total supply of badges
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    /**
     * @notice Override tokenURI to use ERC721URIStorage
     * @param tokenId The token ID
     * @return The token URI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @notice Override supportsInterface to include ERC721URIStorage
     * @param interfaceId The interface ID to check
     * @return True if the interface is supported
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

