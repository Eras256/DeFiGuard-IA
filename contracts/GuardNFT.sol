// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GuardNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    mapping(uint256 => address) public badgeContract;
    mapping(uint256 => uint256) public badgeRiskScore;
    mapping(address => uint256) public contractToBadge;

    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed contractAddress,
        uint256 riskScore
    );

    constructor() ERC721("DeFiGuard Security Badge", "GUARD") Ownable(msg.sender) {}

    function mintBadge(
        address to,
        address auditedContract,
        uint256 riskScore,
        string memory uri
    ) external onlyOwner returns (uint256) {
        require(contractToBadge[auditedContract] == 0, "Badge already exists");
        require(riskScore < 40, "Contract too risky for certification");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        badgeContract[tokenId] = auditedContract;
        badgeRiskScore[tokenId] = riskScore;
        contractToBadge[auditedContract] = tokenId;
        
        emit BadgeMinted(tokenId, auditedContract, riskScore);
        
        return tokenId;
    }

    function getBadgeInfo(uint256 tokenId) 
        external 
        view 
        returns (address, uint256) 
    {
        require(ownerOf(tokenId) != address(0), "Badge does not exist");
        return (badgeContract[tokenId], badgeRiskScore[tokenId]);
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

