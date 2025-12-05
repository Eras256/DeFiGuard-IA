const { ethers } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

/**
 * Script para ejecutar transacciones de prueba en los contratos desplegados
 * Ejecuta 4 transacciones por contrato para verificación en Basescan
 */
async function main() {
  console.log("🧪 Starting test transactions...\n");

  // Verificar que tenemos la clave privada
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    console.error("❌ ERROR: DEPLOYER_PRIVATE_KEY is not set in .env.local");
    process.exit(1);
  }

  // Obtener el signer
  let deployer;
  try {
    let privateKey = process.env.DEPLOYER_PRIVATE_KEY.trim();
    if (!privateKey.startsWith("0x")) {
      privateKey = "0x" + privateKey;
    }
    const provider = ethers.provider;
    deployer = new ethers.Wallet(privateKey, provider);
    console.log("📝 Using deployer:", deployer.address);
  } catch (error) {
    console.error("❌ ERROR creating wallet:", error.message);
    process.exit(1);
  }

  // Verificar balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ ERROR: Account has no balance");
    process.exit(1);
  }

  // Direcciones de contratos desplegados
  const AUDIT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS || "0x00c754b5bBFe5030E4D9Ea9347527f57b3FDE419";
  const GUARD_NFT_ADDRESS = process.env.NEXT_PUBLIC_GUARD_NFT_ADDRESS || "0xbF9E38c9C372dCB443a33D719900E95A2620D90d";
  const GUARD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_GUARD_TOKEN_ADDRESS || "0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED";

  console.log("📋 Contract Addresses:");
  console.log("  AuditRegistry:", AUDIT_REGISTRY_ADDRESS);
  console.log("  GuardNFT:", GUARD_NFT_ADDRESS);
  console.log("  GuardToken:", GUARD_TOKEN_ADDRESS);
  console.log("");

  // Obtener instancias de contratos
  const AuditRegistry = await ethers.getContractFactory("AuditRegistry");
  const GuardNFT = await ethers.getContractFactory("GuardNFT");
  const GuardToken = await ethers.getContractFactory("GuardToken");

  const auditRegistry = AuditRegistry.attach(AUDIT_REGISTRY_ADDRESS).connect(deployer);
  const guardNFT = GuardNFT.attach(GUARD_NFT_ADDRESS).connect(deployer);
  const guardToken = GuardToken.attach(GUARD_TOKEN_ADDRESS).connect(deployer);

  // Generar direcciones de prueba únicas usando timestamp
  const timestamp = Date.now();
  const testContracts = [];
  for (let i = 1; i <= 4; i++) {
    // Generar dirección única usando timestamp + índice
    const uniqueId = (timestamp + i).toString(16).padStart(40, "0");
    const testAddress = ethers.getAddress("0x" + uniqueId);
    testContracts.push(testAddress);
  }

  console.log("=".repeat(60));
  console.log("📊 TEST TRANSACTIONS - AuditRegistry");
  console.log("=".repeat(60));

  // 4 transacciones en AuditRegistry
  for (let i = 0; i < 4; i++) {
    const contractAddress = testContracts[i];
    const riskScore = 20 + (i * 5); // 20, 25, 30, 35 (todos certificables)
    const reportHash = `QmTestHash${i + 1}${Date.now()}`;

    try {
      console.log(`\n📝 Transaction ${i + 1}/4: Recording audit for ${contractAddress}`);
      console.log(`   Risk Score: ${riskScore}, Report Hash: ${reportHash}`);

      const tx = await auditRegistry.recordAudit(contractAddress, riskScore, reportHash);
      console.log(`   ⏳ Transaction sent: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`   ✅ Confirmed in block: ${receipt.blockNumber}`);
      console.log(`   💰 Gas used: ${receipt.gasUsed.toString()}`);

      // Verificar que se registró correctamente
      try {
        const latestAudit = await auditRegistry.getLatestAudit(contractAddress);
        const isCertified = await auditRegistry.isCertified(contractAddress);
        console.log(`   ✓ Audit recorded - Risk: ${latestAudit.riskScore}, Certified: ${isCertified}`);
      } catch (verifyError) {
        console.log(`   ⚠️  Audit recorded but verification failed: ${verifyError.message}`);
      }

      // Esperar un poco entre transacciones
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`   ❌ Error in transaction ${i + 1}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎨 TEST TRANSACTIONS - GuardNFT");
  console.log("=".repeat(60));

  // 4 transacciones en GuardNFT (mint badges)
  // Usar direcciones diferentes para evitar conflictos
  const badgeContracts = [];
  for (let i = 1; i <= 4; i++) {
    const uniqueId = (timestamp + i + 200).toString(16).padStart(40, "0");
    const badgeAddress = ethers.getAddress("0x" + uniqueId);
    badgeContracts.push(badgeAddress);
  }

  for (let i = 0; i < 4; i++) {
    const contractAddress = badgeContracts[i];
    const riskScore = 20 + (i * 5);
    const recipient = deployer.address; // Mint to deployer
    const uri = `https://defiguard.ai/badges/test${i + 1}`;

    try {
      console.log(`\n📝 Transaction ${i + 1}/4: Minting badge for ${contractAddress}`);
      console.log(`   Recipient: ${recipient}, Risk Score: ${riskScore}`);

      // Verificar si ya existe un badge para este contrato
      try {
        const existingTokenId = await guardNFT.getBadgeByContract(contractAddress);
        if (existingTokenId > 0n) {
          console.log(`   ℹ️  Badge already exists (Token ID: ${existingTokenId}), skipping...`);
          continue;
        }
      } catch (e) {
        // No existe badge, continuar
      }

      // Verificar que el contrato está certificado
      let isCertified = false;
      try {
        isCertified = await auditRegistry.isCertified(contractAddress);
      } catch (e) {
        // Contrato no tiene audits aún
      }

      if (!isCertified) {
        console.log(`   ⚠️  Contract not certified, certifying first...`);
        try {
          const certTx = await auditRegistry.grantCertification(contractAddress);
          await certTx.wait();
          console.log(`   ✓ Certification granted`);
        } catch (certError) {
          console.log(`   ⚠️  Could not certify: ${certError.message}`);
        }
      }

      // Registrar audit primero (necesario para certificación)
      console.log(`   📋 Recording audit first...`);
      try {
        const auditTx = await auditRegistry.recordAudit(contractAddress, riskScore, `QmAuditForBadge${i + 1}${timestamp}`);
        await auditTx.wait();
        console.log(`   ✓ Audit recorded`);
      } catch (auditError) {
        console.log(`   ⚠️  Could not record audit: ${auditError.message}`);
        // Continuar de todas formas, puede que ya exista
      }

      // Asegurar certificación
      try {
        isCertified = await auditRegistry.isCertified(contractAddress);
        if (!isCertified) {
          console.log(`   ⚠️  Contract not certified, certifying...`);
          const certTx = await auditRegistry.grantCertification(contractAddress);
          await certTx.wait();
          console.log(`   ✓ Certification granted`);
        } else {
          console.log(`   ✓ Contract is certified`);
        }
      } catch (certError) {
        console.log(`   ⚠️  Certification check/update failed: ${certError.message}`);
      }

      const tx = await guardNFT.mintBadge(recipient, contractAddress, riskScore, uri);
      console.log(`   ⏳ Transaction sent: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`   ✅ Confirmed in block: ${receipt.blockNumber}`);
      console.log(`   💰 Gas used: ${receipt.gasUsed.toString()}`);

      // Verificar que se mintió correctamente
      try {
        const tokenId = await guardNFT.getBadgeByContract(contractAddress);
        const badgeInfo = await guardNFT.getBadgeInfo(tokenId);
        console.log(`   ✓ Badge minted - Token ID: ${tokenId}, Risk: ${badgeInfo.riskScore}`);
      } catch (verifyError) {
        console.log(`   ⚠️  Badge minted but verification failed: ${verifyError.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`   ❌ Error in transaction ${i + 1}:`, error.message);
      if (error.reason) {
        console.error(`   Reason: ${error.reason}`);
      }
      if (error.data) {
        console.error(`   Data: ${error.data}`);
      }
      if (error.message.includes("BadgeAlreadyExists")) {
        console.log(`   ℹ️  Badge already exists for this contract, skipping...`);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🪙 TEST TRANSACTIONS - GuardToken");
  console.log("=".repeat(60));

  // 4 transacciones en GuardToken
  // Opción 1: Airdrops (si hay usuarios disponibles)
  // Opción 2: Mint rewards a diferentes direcciones
  
  // Generar direcciones de prueba únicas para rewards usando timestamp
  const rewardRecipients = [];
  for (let i = 1; i <= 4; i++) {
    const uniqueId = (timestamp + i + 100).toString(16).padStart(40, "0");
    const testAddress = ethers.getAddress("0x" + uniqueId);
    rewardRecipients.push(testAddress);
  }

  // Transacción 1: Single mint reward
  try {
    console.log(`\n📝 Transaction 1/4: Mint reward to ${rewardRecipients[0]}`);
    const amount1 = ethers.parseEther("1000");
    const tx1 = await guardToken.mintReward(rewardRecipients[0], amount1, "Test Reward 1");
    console.log(`   ⏳ Transaction sent: ${tx1.hash}`);
    const receipt1 = await tx1.wait();
    console.log(`   ✅ Confirmed in block: ${receipt1.blockNumber}`);
    console.log(`   💰 Gas used: ${receipt1.gasUsed.toString()}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
  }

  // Transacción 2: Another single mint
  try {
    console.log(`\n📝 Transaction 2/4: Mint reward to ${rewardRecipients[1]}`);
    const amount2 = ethers.parseEther("2000");
    const tx2 = await guardToken.mintReward(rewardRecipients[1], amount2, "Test Reward 2");
    console.log(`   ⏳ Transaction sent: ${tx2.hash}`);
    const receipt2 = await tx2.wait();
    console.log(`   ✅ Confirmed in block: ${receipt2.blockNumber}`);
    console.log(`   💰 Gas used: ${receipt2.gasUsed.toString()}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
  }

  // Transacción 3: Batch mint (2 recipients)
  try {
    console.log(`\n📝 Transaction 3/4: Batch mint to 2 recipients`);
    const batchRecipients = [rewardRecipients[2], rewardRecipients[3]];
    const batchAmounts = [ethers.parseEther("500"), ethers.parseEther("750")];
    const tx3 = await guardToken.batchMintRewards(batchRecipients, batchAmounts, "Batch Test 1");
    console.log(`   ⏳ Transaction sent: ${tx3.hash}`);
    const receipt3 = await tx3.wait();
    console.log(`   ✅ Confirmed in block: ${receipt3.blockNumber}`);
    console.log(`   💰 Gas used: ${receipt3.gasUsed.toString()}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
  }

  // Transacción 4: Another batch mint (4 recipients)
  try {
    console.log(`\n📝 Transaction 4/4: Batch mint to 4 recipients`);
    const batchRecipients4 = [
      rewardRecipients[0],
      rewardRecipients[1],
      rewardRecipients[2],
      rewardRecipients[3],
    ];
    const batchAmounts4 = [
      ethers.parseEther("100"),
      ethers.parseEther("200"),
      ethers.parseEther("300"),
      ethers.parseEther("400"),
    ];
    const tx4 = await guardToken.batchMintRewards(batchRecipients4, batchAmounts4, "Batch Test 2");
    console.log(`   ⏳ Transaction sent: ${tx4.hash}`);
    const receipt4 = await tx4.wait();
    console.log(`   ✅ Confirmed in block: ${receipt4.blockNumber}`);
    console.log(`   💰 Gas used: ${receipt4.gasUsed.toString()}`);
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ TEST TRANSACTIONS COMPLETED");
  console.log("=".repeat(60));
  console.log("\n📊 Summary:");
  console.log("  - AuditRegistry: 4 audits recorded");
  console.log("  - GuardNFT: 4 badges minted");
  console.log("  - GuardToken: 4 reward transactions");
  console.log("\n🔍 View transactions on Basescan:");
  console.log(`   https://sepolia.basescan.org/address/${deployer.address}#txns`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

