const { ethers } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

// Updated contract addresses
const AUDIT_REGISTRY_ADDRESS = "0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF";
const GUARD_NFT_ADDRESS = "0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52";

async function main() {
  console.log("🧪 Testing Updated Contracts (AuditRegistry & GuardNFT)\n");
  console.log("=".repeat(60));

  // Get deployer account
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

  console.log("📝 Using account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ ERROR: Account has no balance. Please fund your account.");
    process.exit(1);
  }

  // Get contracts - IMPORTANT: connect with deployer to ensure proper permissions
  const AuditRegistryFactory = await ethers.getContractFactory("AuditRegistry");
  const GuardNFTFactory = await ethers.getContractFactory("GuardNFT");
  
  const AuditRegistry = AuditRegistryFactory.attach(AUDIT_REGISTRY_ADDRESS).connect(deployer);
  const GuardNFT = GuardNFTFactory.attach(GUARD_NFT_ADDRESS).connect(deployer);

  console.log("📋 AuditRegistry:", AUDIT_REGISTRY_ADDRESS);
  console.log("🎨 GuardNFT:", GUARD_NFT_ADDRESS);
  console.log("\n" + "=".repeat(60) + "\n");

  // Generate unique test contract addresses using timestamp
  // Using valid Ethereum address format (checksum)
  const timestamp = Date.now();
  const generateTestAddress = (index) => {
    // Generate a unique address by combining timestamp and index
    // Ensure it's a valid checksummed address
    const uniqueId = (BigInt(timestamp) + BigInt(index * 1000)).toString(16).padStart(40, "0");
    const address = "0x" + uniqueId;
    return ethers.getAddress(address); // This will checksum the address
  };

  // Test data: 4 contracts with different risk scores (using unique addresses)
  const testContracts = [
    { address: generateTestAddress(1), riskScore: 15, name: "Contract 1 (Gold)" },
    { address: generateTestAddress(2), riskScore: 25, name: "Contract 2 (Bronze)" },
    { address: generateTestAddress(3), riskScore: 30, name: "Contract 3 (Bronze)" },
    { address: generateTestAddress(4), riskScore: 35, name: "Contract 4 (Bronze)" },
  ];

  const auditTxHashes = [];
  const badgeTxHashes = [];

  // Step 1: Record 4 audits
  console.log("📋 Step 1: Recording 4 audits...\n");
  for (let i = 0; i < testContracts.length; i++) {
    const testContract = testContracts[i];
    const reportHash = `QmTestAudit${i + 1}${Date.now()}`;
    
    try {
      console.log(`  ${i + 1}. Recording audit for ${testContract.name}...`);
      console.log(`     Contract: ${testContract.address}`);
      console.log(`     Risk Score: ${testContract.riskScore}`);
      
      const tx = await AuditRegistry.recordAudit(
        testContract.address,
        testContract.riskScore,
        reportHash
      );
      
      console.log(`     ⏳ Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`     ✅ Audit recorded! Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`     📍 Block: ${receipt.blockNumber}`);
      console.log(`     🔗 View: https://sepolia.basescan.org/tx/${tx.hash}\n`);
      
      auditTxHashes.push({
        contract: testContract.address,
        name: testContract.name,
        riskScore: testContract.riskScore,
        txHash: tx.hash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber,
      });

      // Wait a bit between transactions to ensure blockchain state is updated
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`     ❌ Error recording audit: ${error.message}\n`);
    }
  }

  // Step 2: Verify contracts are certified
  console.log("\n" + "=".repeat(60));
  console.log("🔍 Step 2: Verifying certifications...\n");
  
  for (let i = 0; i < testContracts.length; i++) {
    const testContract = testContracts[i];
    try {
      const isCertified = await AuditRegistry.isCertified(testContract.address);
      const contractOwner = await AuditRegistry.contractOwner(testContract.address);
      
      console.log(`  ${i + 1}. ${testContract.name}:`);
      console.log(`     Certified: ${isCertified ? "✅ Yes" : "❌ No"}`);
      console.log(`     Owner: ${contractOwner}`);
      console.log(`     Owner matches deployer: ${contractOwner.toLowerCase() === deployer.address.toLowerCase() ? "✅ Yes" : "❌ No"}\n`);
    } catch (error) {
      console.error(`     ❌ Error checking certification: ${error.message}\n`);
    }
  }

  // Step 3: Mint 4 badges (one for each certified contract)
  console.log("=".repeat(60));
  console.log("🎨 Step 3: Minting 4 certification badges...\n");
  
  for (let i = 0; i < testContracts.length; i++) {
    const testContract = testContracts[i];
    const metadataURI = `https://defiguard.ai/badges/${testContract.address.toLowerCase()}`;
    
    try {
      // Verify prerequisites before minting
      const contractOwner = await AuditRegistry.contractOwner(testContract.address);
      const isCertified = await AuditRegistry.isCertified(testContract.address);
      const existingBadge = await GuardNFT.contractToBadge(testContract.address);
      
      // Check if already has badge
      if (existingBadge > 0n) {
        console.log(`  ${i + 1}. ${testContract.name} already has badge #${existingBadge}`);
        console.log(`     ⏭️  Skipping...\n`);
        continue;
      }
      
      if (contractOwner.toLowerCase() !== deployer.address.toLowerCase()) {
        console.error(`  ${i + 1}. ${testContract.name}`);
        console.error(`     ❌ Owner mismatch: Expected ${deployer.address}, got ${contractOwner}\n`);
        continue;
      }
      
      if (!isCertified) {
        console.error(`  ${i + 1}. ${testContract.name}`);
        console.error(`     ❌ Contract not certified\n`);
        continue;
      }

      console.log(`  ${i + 1}. Minting badge for ${testContract.name}...`);
      console.log(`     Contract: ${testContract.address}`);
      console.log(`     Risk Score: ${testContract.riskScore}`);
      console.log(`     Recipient: ${deployer.address}`);
      
      const tx = await GuardNFT.mintBadge(
        deployer.address, // to
        testContract.address, // auditedContract
        testContract.riskScore, // riskScore
        metadataURI // uri
      );
      
      console.log(`     ⏳ Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      
      // Get token ID from event
      let tokenId = "N/A";
      try {
        const badgeMintedEvent = receipt.logs.find(log => {
          try {
            const parsed = GuardNFT.interface.parseLog(log);
            return parsed && parsed.name === "BadgeMinted";
          } catch {
            return false;
          }
        });
        
        if (badgeMintedEvent) {
          const parsed = GuardNFT.interface.parseLog(badgeMintedEvent);
          tokenId = parsed.args.tokenId.toString();
        } else {
          // Fallback: query the contract directly
          const badgeId = await GuardNFT.contractToBadge(testContract.address);
          tokenId = badgeId.toString();
        }
      } catch (e) {
        console.log(`     ⚠️  Could not extract token ID from event`);
      }
      
      console.log(`     ✅ Badge minted! Token ID: #${tokenId}`);
      console.log(`     Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`     📍 Block: ${receipt.blockNumber}`);
      console.log(`     🔗 View: https://sepolia.basescan.org/tx/${tx.hash}\n`);
      
      badgeTxHashes.push({
        contract: testContract.address,
        name: testContract.name,
        riskScore: testContract.riskScore,
        tokenId: tokenId,
        txHash: tx.hash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber,
      });

      // Wait a bit between transactions to ensure blockchain state is updated
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`     ❌ Error minting badge: ${error.message}`);
      
      // Detailed error information
      if (error.reason) {
        console.error(`     Reason: ${error.reason}`);
      }
      if (error.data) {
        console.error(`     Data: ${error.data}`);
      }
      
      // Debug info
      try {
        const contractOwner = await AuditRegistry.contractOwner(testContract.address);
        const isCertified = await AuditRegistry.isCertified(testContract.address);
        const existingBadge = await GuardNFT.contractToBadge(testContract.address);
        console.error(`     Debug Info:`);
        console.error(`       Contract Owner: ${contractOwner}`);
        console.error(`       Deployer: ${deployer.address}`);
        console.error(`       Owner Match: ${contractOwner.toLowerCase() === deployer.address.toLowerCase()}`);
        console.error(`       Is Certified: ${isCertified}`);
        console.error(`       Existing Badge: ${existingBadge.toString()}`);
      } catch (debugError) {
        console.error(`     Could not get debug info: ${debugError.message}`);
      }
      
      console.log();
    }
  }

  // Summary
  console.log("=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  
  console.log("\n✅ AuditRegistry Transactions:");
  auditTxHashes.forEach((audit, i) => {
    console.log(`  ${i + 1}. ${audit.name}`);
    console.log(`     Contract: ${audit.contract}`);
    console.log(`     Risk Score: ${audit.riskScore}`);
    console.log(`     TX Hash: ${audit.txHash}`);
    console.log(`     Gas Used: ${audit.gasUsed}`);
    console.log(`     Block: ${audit.blockNumber}`);
    console.log(`     🔗 https://sepolia.basescan.org/tx/${audit.txHash}`);
    console.log();
  });

  console.log("\n✅ GuardNFT Transactions:");
  badgeTxHashes.forEach((badge, i) => {
    console.log(`  ${i + 1}. ${badge.name}`);
    console.log(`     Contract: ${badge.contract}`);
    console.log(`     Risk Score: ${badge.riskScore}`);
    console.log(`     Token ID: #${badge.tokenId}`);
    console.log(`     TX Hash: ${badge.txHash}`);
    console.log(`     Gas Used: ${badge.gasUsed}`);
    console.log(`     Block: ${badge.blockNumber}`);
    console.log(`     🔗 https://sepolia.basescan.org/tx/${badge.txHash}`);
    console.log();
  });

  console.log("=".repeat(60));
  console.log(`✅ Total Transactions: ${auditTxHashes.length + badgeTxHashes.length}`);
  console.log(`   - AuditRegistry: ${auditTxHashes.length} transactions`);
  console.log(`   - GuardNFT: ${badgeTxHashes.length} transactions`);
  console.log("=".repeat(60));
  
  console.log("\n📋 View all transactions:");
  console.log(`   Deployer: https://sepolia.basescan.org/address/${deployer.address}#txns`);
  console.log(`   AuditRegistry: https://sepolia.basescan.org/address/${AUDIT_REGISTRY_ADDRESS}#txns`);
  console.log(`   GuardNFT: https://sepolia.basescan.org/address/${GUARD_NFT_ADDRESS}#txns`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

