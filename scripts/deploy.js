const { ethers } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  console.log("🚀 Starting deployment...\n");
  console.log("🔍 Checking environment...");
  console.log("DEPLOYER_PRIVATE_KEY exists:", !!process.env.DEPLOYER_PRIVATE_KEY);
  console.log("DEPLOYER_PRIVATE_KEY length:", process.env.DEPLOYER_PRIVATE_KEY?.length || 0);

  // Get provider
  const provider = ethers.provider;
  
  // Get deployer account
  let deployer;
  if (process.env.DEPLOYER_PRIVATE_KEY) {
    try {
      // Ensure private key has 0x prefix
      let privateKey = process.env.DEPLOYER_PRIVATE_KEY.trim();
      if (!privateKey.startsWith("0x")) {
        privateKey = "0x" + privateKey;
      }
      deployer = new ethers.Wallet(privateKey, provider);
      console.log("📝 Using deployer from DEPLOYER_PRIVATE_KEY");
    } catch (error) {
      console.error("❌ ERROR creating wallet from DEPLOYER_PRIVATE_KEY:", error.message);
      process.exit(1);
    }
  } else {
    // Use default signer from Hardhat
    try {
      const signers = await ethers.getSigners();
      if (signers.length === 0) {
        console.error("❌ ERROR: No signers available. Please configure DEPLOYER_PRIVATE_KEY in .env.local");
        process.exit(1);
      }
      deployer = signers[0];
      console.log("📝 Using default Hardhat signer");
    } catch (error) {
      console.error("❌ ERROR getting signers:", error.message);
      console.error("Please ensure DEPLOYER_PRIVATE_KEY is set in .env.local");
      process.exit(1);
    }
  }
  
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ ERROR: Account has no balance. Please fund your account with testnet ETH.");
    console.log("💧 Get testnet ETH from: https://www.alchemy.com/faucets/base-sepolia");
    process.exit(1);
  }

  // Deploy AuditRegistry
  console.log("📋 Deploying AuditRegistry...");
  const AuditRegistry = await ethers.getContractFactory("AuditRegistry");
  const auditRegistry = await AuditRegistry.deploy(deployer.address);
  await auditRegistry.waitForDeployment();
  const auditRegistryAddress = await auditRegistry.getAddress();
  console.log("✅ AuditRegistry deployed to:", auditRegistryAddress);

  // Deploy GuardNFT (requires AuditRegistry address in constructor)
  console.log("\n🎨 Deploying GuardNFT...");
  const GuardNFT = await ethers.getContractFactory("GuardNFT");
  const guardNFT = await GuardNFT.deploy(deployer.address, auditRegistryAddress);
  await guardNFT.waitForDeployment();
  const guardNFTAddress = await guardNFT.getAddress();
  console.log("✅ GuardNFT deployed to:", guardNFTAddress);
  console.log("   Linked to AuditRegistry:", auditRegistryAddress);

  // Deploy GuardToken
  console.log("\n🪙 Deploying GuardToken...");
  const GuardToken = await ethers.getContractFactory("GuardToken");
  // Deploy with deployer as owner and treasury
  const guardToken = await GuardToken.deploy(deployer.address, deployer.address);
  await guardToken.waitForDeployment();
  const guardTokenAddress = await guardToken.getAddress();
  console.log("✅ GuardToken deployed to:", guardTokenAddress);

  // Summary
  const network = await ethers.provider.getNetwork();
  console.log("\n" + "=".repeat(60));
  console.log("📊 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("\nContract Addresses:");
  console.log("  AuditRegistry:", auditRegistryAddress);
  console.log("  GuardNFT:", guardNFTAddress);
  console.log("  GuardToken:", guardTokenAddress);
  console.log("\n" + "=".repeat(60));

  console.log("\n💾 Save these addresses to your .env.local:");
  console.log(`NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS=${auditRegistryAddress}`);
  console.log(`NEXT_PUBLIC_GUARD_NFT_ADDRESS=${guardNFTAddress}`);
  console.log(`NEXT_PUBLIC_GUARD_TOKEN_ADDRESS=${guardTokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

