import { expect } from "chai";
import { ethers } from "hardhat";
import { GuardToken } from "../typechain-types";

describe("GuardToken", function () {
  let guardToken: GuardToken;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;
  let addr4: any;
  let treasury: any;

  beforeEach(async function () {
    [owner, treasury, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const GuardTokenFactory = await ethers.getContractFactory("GuardToken");
    guardToken = await GuardTokenFactory.deploy(owner.address, treasury.address);
    await guardToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await guardToken.owner()).to.equal(owner.address);
    });

    it("Should set the correct treasury", async function () {
      expect(await guardToken.treasury()).to.equal(treasury.address);
    });

    it("Should mint treasury allocation (10%)", async function () {
      const treasuryBalance = await guardToken.balanceOf(treasury.address);
      const expectedTreasury = (await guardToken.MAX_SUPPLY()) / 10n;
      expect(treasuryBalance).to.equal(expectedTreasury);
    });

    it("Should have correct constants", async function () {
      expect(await guardToken.MAX_SUPPLY()).to.equal(ethers.parseEther("1000000000")); // 1 billion
      expect(await guardToken.TREASURY_PERCENTAGE()).to.equal(10);
      expect(await guardToken.AIRDROP_AMOUNT()).to.equal(ethers.parseEther("100"));
    });
  });

  describe("claimAirdrop", function () {
    it("Should allow user to claim airdrop", async function () {
      await expect(
        guardToken.connect(addr1).claimAirdrop()
      )
        .to.emit(guardToken, "AirdropClaimed")
        .withArgs(addr1.address, await guardToken.AIRDROP_AMOUNT(), anyValue);

      expect(await guardToken.balanceOf(addr1.address)).to.equal(await guardToken.AIRDROP_AMOUNT());
      expect(await guardToken.hasClaimedAirdrop(addr1.address)).to.be.true;
    });

    it("Should not allow double claiming", async function () {
      await guardToken.connect(addr1).claimAirdrop();
      
      await expect(
        guardToken.connect(addr1).claimAirdrop()
      ).to.be.revertedWithCustomError(guardToken, "AirdropAlreadyClaimed");
    });

    it("Should increment totalAirdropClaims", async function () {
      const initialClaims = await guardToken.totalAirdropClaims();
      await guardToken.connect(addr1).claimAirdrop();
      expect(await guardToken.totalAirdropClaims()).to.equal(initialClaims + 1n);
    });
  });

  describe("mintReward", function () {
    it("Should mint reward tokens", async function () {
      const amount = ethers.parseEther("1000");
      const reason = "Test Reward";

      await expect(
        guardToken.mintReward(addr1.address, amount, reason)
      )
        .to.emit(guardToken, "RewardsMinted")
        .withArgs(addr1.address, amount, reason, anyValue);

      expect(await guardToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should revert with zero address", async function () {
      await expect(
        guardToken.mintReward(ethers.ZeroAddress, ethers.parseEther("100"), "reason")
      ).to.be.revertedWithCustomError(guardToken, "ZeroAddress");
    });

    it("Should revert with zero amount", async function () {
      await expect(
        guardToken.mintReward(addr1.address, 0, "reason")
      ).to.be.revertedWithCustomError(guardToken, "ZeroAmount");
    });

    it("Should revert if exceeds max supply", async function () {
      const maxSupply = await guardToken.MAX_SUPPLY();
      const currentSupply = await guardToken.totalSupply();
      const excessiveAmount = maxSupply - currentSupply + 1n;

      await expect(
        guardToken.mintReward(addr1.address, excessiveAmount, "reason")
      ).to.be.revertedWithCustomError(guardToken, "MaxSupplyExceeded");
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        guardToken.connect(addr1).mintReward(addr1.address, ethers.parseEther("100"), "reason")
      ).to.be.revertedWithCustomError(guardToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("batchMintRewards", function () {
    it("Should batch mint rewards successfully", async function () {
      const recipients = [addr1.address, addr2.address, addr3.address, addr4.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200"),
        ethers.parseEther("300"),
        ethers.parseEther("400"),
      ];
      const reason = "Batch Test";

      await expect(
        guardToken.batchMintRewards(recipients, amounts, reason)
      )
        .to.emit(guardToken, "RewardsMinted")
        .withArgs(addr1.address, amounts[0], reason, anyValue);

      expect(await guardToken.balanceOf(addr1.address)).to.equal(amounts[0]);
      expect(await guardToken.balanceOf(addr2.address)).to.equal(amounts[1]);
      expect(await guardToken.balanceOf(addr3.address)).to.equal(amounts[2]);
      expect(await guardToken.balanceOf(addr4.address)).to.equal(amounts[3]);
    });

    it("Should revert if arrays length mismatch", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [ethers.parseEther("100")];

      await expect(
        guardToken.batchMintRewards(recipients, amounts, "reason")
      ).to.be.revertedWithCustomError(guardToken, "ArraysLengthMismatch");
    });

    it("Should revert if batch size exceeds MAX_BATCH_SIZE", async function () {
      const recipients: string[] = [];
      const amounts: bigint[] = [];
      
      // Create 101 recipients (exceeds MAX_BATCH_SIZE of 100)
      for (let i = 0; i < 101; i++) {
        recipients.push(ethers.getAddress(`0x${i.toString(16).padStart(40, "0")}`));
        amounts.push(ethers.parseEther("1"));
      }

      await expect(
        guardToken.batchMintRewards(recipients, amounts, "reason")
      ).to.be.revertedWithCustomError(guardToken, "BatchSizeTooLarge");
    });

    it("Should revert with zero address in recipients", async function () {
      const recipients = [addr1.address, ethers.ZeroAddress];
      const amounts = [ethers.parseEther("100"), ethers.parseEther("200")];

      await expect(
        guardToken.batchMintRewards(recipients, amounts, "reason")
      ).to.be.revertedWithCustomError(guardToken, "ZeroAddress");
    });
  });

  describe("updateTreasury", function () {
    it("Should update treasury address", async function () {
      await expect(
        guardToken.updateTreasury(addr1.address)
      )
        .to.emit(guardToken, "TreasuryUpdated")
        .withArgs(treasury.address, addr1.address);

      expect(await guardToken.treasury()).to.equal(addr1.address);
    });

    it("Should revert with zero address", async function () {
      await expect(
        guardToken.updateTreasury(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(guardToken, "InvalidTreasuryAddress");
    });
  });

  describe("Query Functions", function () {
    it("Should get remaining supply", async function () {
      const remaining = await guardToken.getRemainingSupply();
      const maxSupply = await guardToken.MAX_SUPPLY();
      const currentSupply = await guardToken.totalSupply();
      
      expect(remaining).to.equal(maxSupply - currentSupply);
    });

    it("Should check if user claimed airdrop", async function () {
      expect(await guardToken.hasUserClaimedAirdrop(addr1.address)).to.be.false;
      await guardToken.connect(addr1).claimAirdrop();
      expect(await guardToken.hasUserClaimedAirdrop(addr1.address)).to.be.true;
    });
  });
});

const anyValue = () => true;

