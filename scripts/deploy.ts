import { ethers } from "hardhat";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("🚀 Starting deployment...\n");

  // Get network from command line or default to baseSepolia
  const network = process.argv[2] || "baseSepolia";
  console.log(`🌐 Network: ${network}\n`);

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

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
  console.log("\n" + "=".repeat(60));
  console.log("📊 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", await ethers.provider.getNetwork().then(n => n.name));
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("\nContract Addresses:");
  console.log("  AuditRegistry:", auditRegistryAddress);
  console.log("  GuardNFT:", guardNFTAddress);
  console.log("  GuardToken:", guardTokenAddress);
  console.log("\n" + "=".repeat(60));

  // Save addresses to a file (optional)
  const addresses = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    contracts: {
      AuditRegistry: auditRegistryAddress,
      GuardNFT: guardNFTAddress,
      GuardToken: guardTokenAddress,
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

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

