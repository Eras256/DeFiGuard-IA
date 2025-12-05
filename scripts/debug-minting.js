const { ethers } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const AUDIT_REGISTRY_ADDRESS = "0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF";
const GUARD_NFT_ADDRESS = "0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52";
const TEST_CONTRACT = "0x1111111111111111111111111111111111111111";

async function main() {
  let deployer;
  if (process.env.DEPLOYER_PRIVATE_KEY) {
    let privateKey = process.env.DEPLOYER_PRIVATE_KEY.trim();
    if (!privateKey.startsWith("0x")) {
      privateKey = "0x" + privateKey;
    }
    deployer = new ethers.Wallet(privateKey, ethers.provider);
  } else {
    const signers = await ethers.getSigners();
    deployer = signers[0];
  }

  console.log("🔍 Debugging minting issue...\n");
  console.log("Deployer:", deployer.address);
  console.log("Test Contract:", TEST_CONTRACT);
  console.log();

  const AuditRegistry = await ethers.getContractAt("AuditRegistry", AUDIT_REGISTRY_ADDRESS);
  const GuardNFT = await ethers.getContractAt("GuardNFT", GUARD_NFT_ADDRESS);

  // Check contractOwner
  try {
    const contractOwner = await AuditRegistry.contractOwner(TEST_CONTRACT);
    console.log("✅ contractOwner:", contractOwner);
    console.log("   Matches deployer:", contractOwner.toLowerCase() === deployer.address.toLowerCase());
  } catch (error) {
    console.error("❌ Error getting contractOwner:", error.message);
  }

  // Check certification
  try {
    const isCertified = await AuditRegistry.isCertified(TEST_CONTRACT);
    console.log("✅ isCertified:", isCertified);
  } catch (error) {
    console.error("❌ Error checking certification:", error.message);
  }

  // Check existing badge
  try {
    const existingBadge = await GuardNFT.contractToBadge(TEST_CONTRACT);
    console.log("✅ Existing badge:", existingBadge.toString());
  } catch (error) {
    console.error("❌ Error checking badge:", error.message);
  }

  // Try to mint
  console.log("\n🎨 Attempting to mint badge...");
  try {
    const metadataURI = `https://defiguard.ai/badges/${TEST_CONTRACT.toLowerCase()}`;
    const tx = await GuardNFT.mintBadge(
      deployer.address,
      TEST_CONTRACT,
      15,
      metadataURI
    );
    console.log("✅ Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Badge minted successfully!");
  } catch (error) {
    console.error("❌ Error minting:", error.message);
    if (error.reason) {
      console.error("   Reason:", error.reason);
    }
    if (error.data) {
      console.error("   Data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

