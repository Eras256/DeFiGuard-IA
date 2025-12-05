import { expect } from "chai";
import { ethers } from "hardhat";
import { GuardNFT } from "../typechain-types";
import { AuditRegistry } from "../typechain-types";

describe("GuardNFT", function () {
  let guardNFT: GuardNFT;
  let auditRegistry: AuditRegistry;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const testContractAddress1 = "0x1111111111111111111111111111111111111111";
  const testContractAddress2 = "0x2222222222222222222222222222222222222222";
  const testContractAddress3 = "0x3333333333333333333333333333333333333333";
  const testContractAddress4 = "0x4444444444444444444444444444444444444444";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy AuditRegistry first
    const AuditRegistryFactory = await ethers.getContractFactory("AuditRegistry");
    auditRegistry = await AuditRegistryFactory.deploy(owner.address);
    await auditRegistry.waitForDeployment();

    // Deploy GuardNFT
    const GuardNFTFactory = await ethers.getContractFactory("GuardNFT");
    guardNFT = await GuardNFTFactory.deploy(owner.address, await auditRegistry.getAddress());
    await guardNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await guardNFT.owner()).to.equal(owner.address);
    });

    it("Should set the correct AuditRegistry address", async function () {
      expect(await guardNFT.auditRegistry()).to.equal(await auditRegistry.getAddress());
    });

    it("Should have correct constants", async function () {
      expect(await guardNFT.MAX_CERTIFICATION_RISK_SCORE()).to.equal(40);
    });

    it("Should have correct name and symbol", async function () {
      expect(await guardNFT.name()).to.equal("DeFiGuard Security Badge");
      expect(await guardNFT.symbol()).to.equal("GUARD");
    });
  });

  describe("mintBadge", function () {
    beforeEach(async function () {
      // Certify contracts in AuditRegistry first
      await auditRegistry.recordAudit(testContractAddress1, 25, "QmHash1");
      await auditRegistry.recordAudit(testContractAddress2, 30, "QmHash2");
      await auditRegistry.recordAudit(testContractAddress3, 35, "QmHash3");
      await auditRegistry.recordAudit(testContractAddress4, 20, "QmHash4");
    });

    it("Should mint badge successfully", async function () {
      const riskScore = 25;
      const uri = "https://defiguard.ai/badges/test1";

      await expect(
        guardNFT.mintBadge(addr1.address, testContractAddress1, riskScore, uri)
      )
        .to.emit(guardNFT, "BadgeMinted")
        .withArgs(1, testContractAddress1, addr1.address, riskScore, anyValue);

      expect(await guardNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await guardNFT.badgeContract(1)).to.equal(testContractAddress1);
      expect(await guardNFT.badgeRiskScore(1)).to.equal(riskScore);
    });

    it("Should revert with zero address for recipient", async function () {
      await expect(
        guardNFT.mintBadge(ethers.ZeroAddress, testContractAddress1, 25, "uri")
      ).to.be.revertedWithCustomError(guardNFT, "ZeroAddress");
    });

    it("Should revert with zero address for contract", async function () {
      await expect(
        guardNFT.mintBadge(addr1.address, ethers.ZeroAddress, 25, "uri")
      ).to.be.revertedWithCustomError(guardNFT, "ZeroAddress");
    });

    it("Should revert with risk score too high", async function () {
      await expect(
        guardNFT.mintBadge(addr1.address, testContractAddress1, 40, "uri")
      ).to.be.revertedWithCustomError(guardNFT, "RiskScoreTooHigh");
    });

    it("Should revert if badge already exists for contract", async function () {
      await guardNFT.mintBadge(addr1.address, testContractAddress1, 25, "uri1");
      
      await expect(
        guardNFT.mintBadge(addr2.address, testContractAddress1, 30, "uri2")
      ).to.be.revertedWithCustomError(guardNFT, "BadgeAlreadyExists");
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        guardNFT.connect(addr1).mintBadge(addr1.address, testContractAddress1, 25, "uri")
      ).to.be.revertedWithCustomError(guardNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      await auditRegistry.recordAudit(testContractAddress1, 25, "QmHash1");
      await guardNFT.mintBadge(addr1.address, testContractAddress1, 25, "uri1");
    });

    it("Should get badge info", async function () {
      const badgeInfo = await guardNFT.getBadgeInfo(1);
      expect(badgeInfo.contractAddress).to.equal(testContractAddress1);
      expect(badgeInfo.riskScore).to.equal(25);
    });

    it("Should get badge by contract address", async function () {
      const tokenId = await guardNFT.getBadgeByContract(testContractAddress1);
      expect(tokenId).to.equal(1);
    });

    it("Should check if contract is certified", async function () {
      expect(await guardNFT.isContractCertified(testContractAddress1)).to.be.true;
      expect(await guardNFT.isContractCertified(testContractAddress2)).to.be.false;
    });

    it("Should get total supply", async function () {
      expect(await guardNFT.totalSupply()).to.equal(1);
    });
  });

  describe("updateBadgeURI", function () {
    beforeEach(async function () {
      await auditRegistry.recordAudit(testContractAddress1, 25, "QmHash1");
      await guardNFT.mintBadge(addr1.address, testContractAddress1, 25, "uri1");
    });

    it("Should update badge URI", async function () {
      const newURI = "https://defiguard.ai/badges/updated";
      await expect(
        guardNFT.updateBadgeURI(1, newURI)
      )
        .to.emit(guardNFT, "BadgeURIUpdated")
        .withArgs(1, newURI);

      expect(await guardNFT.tokenURI(1)).to.equal(newURI);
    });

    it("Should only allow owner to update URI", async function () {
      await expect(
        guardNFT.connect(addr1).updateBadgeURI(1, "newURI")
      ).to.be.revertedWithCustomError(guardNFT, "OwnableUnauthorizedAccount");
    });
  });
});

const anyValue = () => true;

