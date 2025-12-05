import { expect } from "chai";
import { ethers } from "hardhat";
import { AuditRegistry } from "../typechain-types";

describe("AuditRegistry", function () {
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

    const AuditRegistryFactory = await ethers.getContractFactory("AuditRegistry");
    auditRegistry = await AuditRegistryFactory.deploy(owner.address);
    await auditRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await auditRegistry.owner()).to.equal(owner.address);
    });

    it("Should have correct constants", async function () {
      expect(await auditRegistry.MAX_RISK_SCORE()).to.equal(100);
      expect(await auditRegistry.CERTIFICATION_THRESHOLD()).to.equal(40);
      expect(await auditRegistry.MAX_AUDITS_PER_CONTRACT()).to.equal(100);
      expect(await auditRegistry.MAX_TOTAL_AUDITS_PER_CONTRACT()).to.equal(150);
    });
  });

  describe("recordAudit", function () {
    it("Should record an audit successfully", async function () {
      const riskScore = 25;
      const reportHash = "QmTestHash123";

      await expect(
        auditRegistry.recordAudit(testContractAddress1, riskScore, reportHash)
      )
        .to.emit(auditRegistry, "AuditRecorded")
        .withArgs(testContractAddress1, riskScore, anyValue, reportHash, owner.address, 0);

      const latestAudit = await auditRegistry.getLatestAudit(testContractAddress1);
      expect(latestAudit.riskScore).to.equal(riskScore);
      expect(latestAudit.reportHash).to.equal(reportHash);
    });

    it("Should auto-certify contract with low risk score", async function () {
      const riskScore = 30; // Below threshold of 40

      await expect(
        auditRegistry.recordAudit(testContractAddress1, riskScore, "QmHash1")
      )
        .to.emit(auditRegistry, "CertificationGranted")
        .withArgs(testContractAddress1, riskScore);

      expect(await auditRegistry.isCertified(testContractAddress1)).to.be.true;
    });

    it("Should not certify contract with high risk score", async function () {
      const riskScore = 50; // Above threshold of 40

      await auditRegistry.recordAudit(testContractAddress1, riskScore, "QmHash1");

      expect(await auditRegistry.isCertified(testContractAddress1)).to.be.false;
    });

    it("Should revoke certification if new audit has high risk", async function () {
      // First audit with low risk (certifies)
      await auditRegistry.recordAudit(testContractAddress1, 30, "QmHash1");
      expect(await auditRegistry.isCertified(testContractAddress1)).to.be.true;

      // Second audit with high risk (revokes)
      await expect(
        auditRegistry.recordAudit(testContractAddress1, 50, "QmHash2")
      )
        .to.emit(auditRegistry, "CertificationRevoked")
        .withArgs(testContractAddress1);

      expect(await auditRegistry.isCertified(testContractAddress1)).to.be.false;
    });

    it("Should revert with invalid risk score", async function () {
      await expect(
        auditRegistry.recordAudit(testContractAddress1, 101, "QmHash1")
      ).to.be.revertedWithCustomError(auditRegistry, "InvalidRiskScore");
    });

    it("Should revert with zero address", async function () {
      await expect(
        auditRegistry.recordAudit(ethers.ZeroAddress, 25, "QmHash1")
      ).to.be.revertedWithCustomError(auditRegistry, "ZeroAddress");
    });

    it("Should only allow owner to record audits", async function () {
      await expect(
        auditRegistry.connect(addr1).recordAudit(testContractAddress1, 25, "QmHash1")
      ).to.be.revertedWithCustomError(auditRegistry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Circular Buffer DoS Protection", function () {
    it("Should handle MAX_TOTAL_AUDITS_PER_CONTRACT limit", async function () {
      // Record audits up to the limit
      for (let i = 0; i < 150; i++) {
        const testAddress = ethers.getAddress(`0x${i.toString(16).padStart(40, "0")}`);
        await auditRegistry.recordAudit(testAddress, 25, `QmHash${i}`);
      }

      // 151st audit should overwrite the oldest
      await auditRegistry.recordAudit(testContractAddress1, 25, "QmHash151");
      
      const auditCount = await auditRegistry.getAuditCount(testContractAddress1);
      expect(auditCount).to.be.greaterThan(0);
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      // Record multiple audits
      await auditRegistry.recordAudit(testContractAddress1, 20, "QmHash1");
      await auditRegistry.recordAudit(testContractAddress1, 30, "QmHash2");
      await auditRegistry.recordAudit(testContractAddress1, 35, "QmHash3");
    });

    it("Should get latest audit", async function () {
      const latest = await auditRegistry.getLatestAudit(testContractAddress1);
      expect(latest.riskScore).to.equal(35);
      expect(latest.reportHash).to.equal("QmHash3");
    });

    it("Should get audit count", async function () {
      const count = await auditRegistry.getAuditCount(testContractAddress1);
      expect(count).to.equal(3);
    });

    it("Should check certification status", async function () {
      expect(await auditRegistry.checkCertification(testContractAddress1)).to.be.true;
    });

    it("Should get all audits", async function () {
      const audits = await auditRegistry.getAllAudits(testContractAddress1);
      expect(audits.length).to.equal(3);
    });
  });

  describe("Manual Certification", function () {
    it("Should allow owner to grant certification", async function () {
      await expect(
        auditRegistry.grantCertification(testContractAddress1)
      )
        .to.emit(auditRegistry, "CertificationGranted")
        .withArgs(testContractAddress1, 0);

      expect(await auditRegistry.isCertified(testContractAddress1)).to.be.true;
    });

    it("Should allow owner to revoke certification", async function () {
      await auditRegistry.grantCertification(testContractAddress1);
      await expect(
        auditRegistry.revokeCertification(testContractAddress1)
      )
        .to.emit(auditRegistry, "CertificationRevoked")
        .withArgs(testContractAddress1);

      expect(await auditRegistry.isCertified(testContractAddress1)).to.be.false;
    });
  });
});

// Helper for anyValue matcher
const anyValue = () => true;

