const { ethers } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const AUDIT_REGISTRY_ADDRESS = "0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF";
const GUARD_NFT_ADDRESS = "0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52";
const TEST_CONTRACT = "0x0000000000000000000000000000019AED1f7f7E";

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

  console.log("🔍 Testing single mint...\n");
  console.log("Deployer:", deployer.address);
  console.log("Test Contract:", TEST_CONTRACT);
  console.log();

  const AuditRegistryFactory = await ethers.getContractFactory("AuditRegistry");
  const GuardNFTFactory = await ethers.getContractFactory("GuardNFT");
  
  const AuditRegistry = AuditRegistryFactory.attach(AUDIT_REGISTRY_ADDRESS).connect(deployer);
  const GuardNFT = GuardNFTFactory.attach(GUARD_NFT_ADDRESS).connect(deployer);

  // Check prerequisites
  const contractOwner = await AuditRegistry.contractOwner(TEST_CONTRACT);
  const isCertified = await AuditRegistry.isCertified(TEST_CONTRACT);
  const existingBadge = await GuardNFT.contractToBadge(TEST_CONTRACT);

  console.log("Prerequisites:");
  console.log("  Contract Owner:", contractOwner);
  console.log("  Deployer:", deployer.address);
  console.log("  Owner Match:", contractOwner.toLowerCase() === deployer.address.toLowerCase());
  console.log("  Is Certified:", isCertified);
  console.log("  Existing Badge:", existingBadge.toString());
  console.log();

  if (existingBadge > 0n) {
    console.log("⚠️  Badge already exists, skipping...");
    return;
  }

  // Try to mint with detailed error handling
  console.log("🎨 Attempting to mint badge...");
  const metadataURI = `https://defiguard.ai/badges/${TEST_CONTRACT.toLowerCase()}`;
  
  try {
    // Use estimateGas to see if it would fail
    const gasEstimate = await GuardNFT.mintBadge.estimateGas(
      deployer.address,
      TEST_CONTRACT,
      25,
      metadataURI
    );
    console.log("✅ Gas estimate:", gasEstimate.toString());
    
    const tx = await GuardNFT.mintBadge(
      deployer.address,
      TEST_CONTRACT,
      25,
      metadataURI
    );
    console.log("✅ Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Badge minted successfully!");
    console.log("   Block:", receipt.blockNumber);
    console.log("   Gas Used:", receipt.gasUsed.toString());
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.reason) {
      console.error("   Reason:", error.reason);
    }
    if (error.data) {
      console.error("   Data:", error.data);
    }
    
    // Try to decode error
    if (error.data && error.data.length > 2) {
      const errorData = error.data.slice(2);
      const selector = errorData.substring(0, 8);
      console.error("   Error Selector:", selector);
      
      // Known error selectors from GuardNFT
      const errorSelectors = {
        "a5f8e772": "NotContractOwner",
        "c3b55635": "NotCertified", 
        "e4b0080b": "BadgeAlreadyExists",
        "e6c4247b": "RiskScoreTooHigh",
        "1f2a2005": "ZeroAddress",
      };
      
      if (errorSelectors[selector]) {
        console.error(`   Decoded: ${errorSelectors[selector]}`);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

