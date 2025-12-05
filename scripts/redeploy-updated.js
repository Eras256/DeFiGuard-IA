const { ethers } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  console.log("🚀 Redeploying updated contracts (AuditRegistry & GuardNFT)...\n");
  console.log("🔍 Checking environment...");
  console.log("DEPLOYER_PRIVATE_KEY exists:", !!process.env.DEPLOYER_PRIVATE_KEY);

  // Get provider
  const provider = ethers.provider;
  
  // Get deployer account
  let deployer;
  if (process.env.DEPLOYER_PRIVATE_KEY) {
    try {
      let privateKey = process.env.DEPLOYER_PRIVATE_KEY.trim();
      if (!privateKey.startsWith("0x")) {
        privateKey = "0x" + privateKey;
      }
      deployer = new ethers.Wallet(privateKey, provider);
      console.log("📝 Using deployer from DEPLOYER_PRIVATE_KEY");
    } catch (error) {
      console.error("❌ ERROR creating wallet:", error.message);
      process.exit(1);
    }
  } else {
    const signers = await ethers.getSigners();
    if (signers.length === 0) {
      console.error("❌ ERROR: No signers available. Please configure DEPLOYER_PRIVATE_KEY in .env.local");
      process.exit(1);
    }
    deployer = signers[0];
    console.log("📝 Using default Hardhat signer");
  }
  
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ ERROR: Account has no balance. Please fund your account with testnet ETH.");
    console.log("💧 Get testnet ETH from: https://www.alchemy.com/faucets/base-sepolia");
    process.exit(1);
  }

  // Deploy AuditRegistry (UPDATED: now includes contractOwner mapping)
  console.log("📋 Deploying AuditRegistry (UPDATED with contractOwner mapping)...");
  const AuditRegistry = await ethers.getContractFactory("AuditRegistry");
  const auditRegistry = await AuditRegistry.deploy(deployer.address);
  await auditRegistry.waitForDeployment();
  const auditRegistryAddress = await auditRegistry.getAddress();
  console.log("✅ AuditRegistry deployed to:", auditRegistryAddress);

  // Deploy GuardNFT (UPDATED: now allows contract owners to mint directly)
  console.log("\n🎨 Deploying GuardNFT (UPDATED with owner-based minting)...");
  const GuardNFT = await ethers.getContractFactory("GuardNFT");
  const guardNFT = await GuardNFT.deploy(deployer.address, auditRegistryAddress);
  await guardNFT.waitForDeployment();
  const guardNFTAddress = await guardNFT.getAddress();
  console.log("✅ GuardNFT deployed to:", guardNFTAddress);
  console.log("   Linked to AuditRegistry:", auditRegistryAddress);

  // Summary
  const network = await ethers.provider.getNetwork();
  console.log("\n" + "=".repeat(60));
  console.log("📊 REDEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\nUpdated Contract Addresses:");
  console.log("  AuditRegistry:", auditRegistryAddress);
  console.log("  GuardNFT:", guardNFTAddress);
  console.log("\n⚠️  NOTE: GuardToken was NOT redeployed (no changes)");
  console.log("   If you need GuardToken, use the existing address or deploy separately");
  console.log("\n" + "=".repeat(60));

  console.log("\n💾 Update these addresses in your .env.local:");
  console.log(`NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS=${auditRegistryAddress}`);
  console.log(`NEXT_PUBLIC_GUARD_NFT_ADDRESS=${guardNFTAddress}`);
  
  console.log("\n🔍 Verification commands:");
  console.log(`npx hardhat verify --network baseSepolia --constructor-args scripts/verify-args-audit.js ${auditRegistryAddress}`);
  console.log(`npx hardhat verify --network baseSepolia --constructor-args scripts/verify-args-nft.js ${guardNFTAddress}`);
  
  console.log("\n✅ Redeployment complete!");
  console.log("📝 Next steps:");
  console.log("   1. Update .env.local with new addresses");
  console.log("   2. Verify contracts on Basescan");
  console.log("   3. Test minting badges from user wallets");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

