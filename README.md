# 🛡️ DeFiGuard AI - AI-Powered Smart Contract Security Auditor

Built for **NullShot Hacks Season 0 - Track 1b**

![DeFiGuard AI](https://img.shields.io/badge/Built%20With-Gemini%202.5%20Flash-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Framework](https://img.shields.io/badge/Framework-Nullshot-purple)
![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia-blue)
![Verified](https://img.shields.io/badge/Contracts-Verified-success)

## 🚀 Overview

DeFiGuard AI is an advanced AI-powered smart contract security auditor that leverages **Gemini 2.5 Flash** and **Model Context Protocol (MCP)** architecture to identify vulnerabilities in Solidity contracts within seconds.

### ✨ Key Features

- 🤖 **AI-Powered Analysis** - Gemini 2.5 Flash with 2M token context window
- ⚡ **Lightning Fast** - Complete audits in under 30 seconds
- 🌐 **EVM-Compatible Analysis** - Analyze contracts from any EVM-compatible chain. On-chain registration on Base Sepolia
- 🔧 **Automated Fixes** - AI-generated secure code patches
- 📊 **Risk Scoring** - Comprehensive security analysis with severity levels
- 🏆 **NFT Certification** - On-chain verification badges for audited contracts
- 📡 **Real-Time Monitoring** - Continuous surveillance of deployed contracts
- 🧠 **MCP Architecture** - Built on Nullshot Framework for agent interoperability
- 🔐 **Decentralized Minting** - Contract owners mint badges directly from their wallets

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with glassmorphism
- **Framer Motion** - Advanced animations
- **Thirdweb** - Wallet connection and blockchain infrastructure

### AI & Agents
- **Gemini 2.5 Flash** - Google's latest AI model
- **Nullshot MCP Architecture** - Model Context Protocol implementation
- **Custom MCP Servers** - Slither, Blockchain Data, DeFi Analytics
- **AI Agents** - AuditorAgent, RiskAgent, RemediationAgent

### Blockchain
- **Thirdweb SDK** - Multi-chain infrastructure
- **Thirdweb React** - Wallet connection and blockchain hooks
- **Viem** - TypeScript Ethereum library
- **Base Sepolia** - Primary deployment network

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Secure contract libraries
- **Hardhat** - Development environment

## 📦 Installation

### Prerequisites

- Node.js 18+ and pnpm
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Thirdweb Client ID from [Thirdweb Dashboard](https://thirdweb.com/dashboard)

### Setup Steps

```bash
# Clone repository
git clone https://github.com/yourusername/defiguard-ai.git
cd defiguard-ai

# Install dependencies with pnpm
pnpm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your API keys
nano .env.local

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 🔑 Environment Variables

Create `.env.local` file with:

```bash
# AI Model
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-latest

# Blockchain
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_secret_key

# Contract Addresses (Updated December 2025)
NEXT_PUBLIC_AUDIT_REGISTRY_ADDRESS=0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF
NEXT_PUBLIC_GUARD_NFT_ADDRESS=0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52
NEXT_PUBLIC_GUARD_TOKEN_ADDRESS=0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED

# RPC Endpoints
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc

# Explorer APIs (for contract verification)
BASESCAN_API_KEY=your_basescan_key
ARBISCAN_API_KEY=your_arbiscan_key
ETHERSCAN_API_KEY=your_etherscan_key

# Deployment (only needed for deploying contracts)
DEPLOYER_PRIVATE_KEY=0xyour_deployer_private_key_here

# Note: GUARD_NFT_OWNER_PRIVATE_KEY is NO LONGER NEEDED
# Users now mint badges directly from their wallets!
```

## 🚀 Deployment

### Deploy to Vercel

```bash
# Login to Vercel
pnpm vercel login

# Deploy to production
pnpm deploy
```

### Publish to Nullshot Jam

1. Go to [nullshot.ai/jam](https://nullshot.ai/jam)
2. Click "New Jam" → "Import from GitHub"
3. Connect your repository
4. Click "Publish Product"
5. Your app is now live on Nullshot!

### Deploy Smart Contracts

```bash
# Ensure you have testnet ETH and DEPLOYER_PRIVATE_KEY in .env.local
# Deploy all contracts to Base Sepolia
pnpm deploy:contracts

# Redeploy only updated contracts (AuditRegistry & GuardNFT)
pnpm redeploy:updated

# Verify contracts (after deployment)
# Requires BASESCAN_API_KEY in .env.local
pnpm verify:updated
```

**✅ Latest Deployed and Verified Contracts (Updated December 2025):**
- **AuditRegistry**: `0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF` - [View on Basescan](https://sepolia.basescan.org/address/0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF#code)
- **GuardNFT**: `0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52` - [View on Basescan](https://sepolia.basescan.org/address/0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52#code)
- **GuardToken**: `0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED` - [View on Basescan](https://sepolia.basescan.org/address/0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED#code)

**🆕 Key Updates (December 2025):**
- **Decentralized Badge Minting**: Contract owners can now mint certification badges directly from their wallets
- **No Server Required**: Users no longer need server-side private keys to mint badges
- **contractOwner Mapping**: AuditRegistry now tracks who registered each audit for ownership verification

## 📊 Project Structure

```
defiguard-ai/
├── app/                    # Next.js App Router pages
│   ├── audit/              # Contract auditing interface
│   ├── dashboard/           # User dashboard
│   ├── monitoring/          # Real-time monitoring
│   └── api/                # API routes
├── components/             # React components
│   ├── ui/                 # Base UI components
│   ├── layout/             # Layout components
│   ├── home/               # Landing page sections
│   ├── audit/               # Audit-specific components
│   └── dashboard/          # Dashboard widgets
├── lib/                    # Core logic
│   ├── agents/             # Nullshot AI agents
│   ├── mcp/                # MCP server implementations
│   ├── gemini/             # Gemini API client
│   └── thirdweb/           # Blockchain utilities
├── contracts/              # Solidity smart contracts
├── public/                 # Static assets
└── .env.local              # Environment variables
```

## 🧪 Testing

### Run Contract Tests

The project includes comprehensive test suites for all smart contracts:

```bash
# Run all contract tests
pnpm test:contracts
```

**Test Coverage:**
- ✅ **AuditRegistry.test.ts** - Tests for audit recording, certification, circular buffer DoS protection
- ✅ **GuardNFT.test.ts** - Tests for badge minting, query functions, URI updates
- ✅ **GuardToken.test.ts** - Tests for airdrop claims, reward minting, batch operations

### Execute Test Transactions on Base Sepolia

Run real transactions on Base Sepolia testnet to verify contract functionality:

```bash
# Execute test transactions for all contracts (requires DEPLOYER_PRIVATE_KEY in .env.local)
pnpm test:transactions

# Execute test transactions for updated contracts only (AuditRegistry & GuardNFT)
pnpm test:updated
```

**What it does:**
- Executes 4 transactions per contract (AuditRegistry, GuardNFT, GuardToken)
- Records audits with different risk scores (15, 25, 30, 35)
- Mints NFT badges for certified contracts using decentralized minting
- Tests reward minting (single and batch operations)
- All transactions are verifiable on Basescan

**Transaction Results:**
- ✅ **AuditRegistry**: 4 audits recorded successfully (~236,331 gas each)
- ✅ **GuardToken**: 4 reward transactions successful (~57,458-88,639 gas)
- ✅ **GuardNFT**: Badge minting works with owner-based verification (~251,974 gas)

**Gas Usage Statistics:**
- `AuditRegistry.recordAudit`: ~236,331 gas per transaction
- `GuardToken.mintReward`: ~57,458 gas per transaction
- `GuardToken.batchMintRewards` (2 recipients): ~88,639 gas
- `GuardToken.batchMintRewards` (4 recipients): ~78,181 gas
- `GuardNFT.mintBadge`: ~251,974 gas per transaction

**Updated Contracts Test Results (December 2025):**

**AuditRegistry Tests:**
- ✅ 4 audit recordings successful
- ✅ All contracts certified automatically (risk score < 40)
- ✅ `contractOwner` mapping working correctly
- ✅ Gas usage: ~236,331 gas per audit

**GuardNFT Tests:**
- ✅ Decentralized badge minting working correctly
- ✅ Owner verification working (only contract owner can mint)
- ✅ Certification verification working
- ✅ Gas usage: ~251,974 gas per badge mint

**Sample Test Transactions:**

**AuditRegistry:**
1. Contract 1 (Gold) - Risk Score: 15
   - TX: [`0xd662fec0ca4a3c3ed525cc0a0437cdec1c4c926978a9935eb35d47a500703333`](https://sepolia.basescan.org/tx/0xd662fec0ca4a3c3ed525cc0a0437cdec1c4c926978a9935eb35d47a500703333)
   - Gas: 236,331 | Block: 34573355

2. Contract 2 (Bronze) - Risk Score: 25
   - TX: [`0xdeced6ea47fbd49fafa7098fee3def9f7c616b3488a729fd2bdf883bd97bf221`](https://sepolia.basescan.org/tx/0xdeced6ea47fbd49fafa7098fee3def9f7c616b3488a729fd2bdf883bd97bf221)
   - Gas: 236,331 | Block: 34573358

3. Contract 3 (Bronze) - Risk Score: 30
   - TX: [`0x19e1937ab7c10ea61609dac99e1f04bfd9e08dcef1d9c8d406bd19d6082c945a`](https://sepolia.basescan.org/tx/0x19e1937ab7c10ea61609dac99e1f04bfd9e08dcef1d9c8d406bd19d6082c945a)
   - Gas: 236,331 | Block: 34573360

4. Contract 4 (Bronze) - Risk Score: 35
   - TX: [`0x7e14f27f1a195b3fd1dbbeaccb53b338e37631e354ffb4585237721a0c5e17bb`](https://sepolia.basescan.org/tx/0x7e14f27f1a195b3fd1dbbeaccb53b338e37631e354ffb4585237721a0c5e17bb)
   - Gas: 236,331 | Block: 34573363

**GuardNFT:**
- Badge #4, #5, #7 minted successfully
- Sample TX: [`0x6d46e2e2863386ab0f4f2159628a742e9ad3b19ee5adcc48f76f3694dc8ae70d`](https://sepolia.basescan.org/tx/0x6d46e2e2863386ab0f4f2159628a742e9ad3b19ee5adcc48f76f3694dc8ae70d)
- Gas: 251,974 | Block: 34573367

**View Transactions on Basescan:**
- [AuditRegistry Transactions](https://sepolia.basescan.org/address/0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF#txns)
- [GuardNFT Transactions](https://sepolia.basescan.org/address/0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52#txns)
- [GuardToken Transactions](https://sepolia.basescan.org/address/0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED#txns)
- [Deployer Address (All Transactions)](https://sepolia.basescan.org/address/0xF93F07b1b35b9DF13e2d53DbAd49396f0A9538D9#txns)

### Verify Transactions

Verify the executed test transactions on Base Sepolia:

```bash
# Verify transactions using Basescan API
pnpm verify:transactions

# Verify updated contracts on Basescan
pnpm verify:updated
```

**Verification Status**: ✅ **All transactions verified successfully**
- ✅ AuditRegistry `recordAudit` transactions confirmed
- ✅ GuardToken transactions confirmed (single mints + batch mints)
- ✅ GuardNFT badge minting transactions confirmed (decentralized minting working)
- ✅ All transactions visible and verifiable on Basescan
- ✅ Contracts verified on Basescan and Sourcify

For detailed verification report, see [TRANSACTION_VERIFICATION.md](./TRANSACTION_VERIFICATION.md).

## 🧪 Usage Examples

### Analyze a Contract

```typescript
import { auditorAgent } from "@/lib/agents/auditor-agent";

const code = `pragma solidity ^0.8.0; contract MyContract { // Your code here }`;

const analysis = await auditorAgent.analyzeContract(code);
console.log(`Risk Score: ${analysis.riskScore}`);
console.log(`Vulnerabilities: ${analysis.vulnerabilities.length}`);
```

### Use Gemini 2.5 Flash Directly

```typescript
import { analyzeContractWithGemini } from "@/lib/gemini/client";

const result = await analyzeContractWithGemini(contractCode);
```

### Mint Certification Badge (Decentralized)

```typescript
import { mintBadgeForContract } from "@/lib/contracts/mint-badge";

// User mints badge directly from their wallet
const txHash = await mintBadgeForContract(
  contractAddress,
  userAddress,
  riskScore,
  userAccount
);
```

## 🏆 NullShot Hacks Submission - Track 1b

This project is submitted to **NullShot Hacks Season 0 - Track 1b: Web App using Nullshot Platform**

### ✅ Requisitos Cumplidos

- ✅ **Publicación en Nullshot Platform** - Aplicación desplegable en Nullshot Jam
- ✅ **Arquitectura MCP/Agentes** - 3 Agentes + 3 Servidores MCP implementados
- ✅ **Integración Web3** - Contratos inteligentes, NFTs, tokens ERC-20
- ✅ **Tag "Nullshot Hacks S0"** - Aplicado en la presentación
- ✅ **Aplicación Web Completa** - Next.js 14 con todas las features
- ✅ **AI-Powered** - Gemini 2.5 Flash para análisis de contratos

### 🎯 Agentes Implementados

1. **AuditorAgent** - Analiza contratos inteligentes para vulnerabilidades
2. **RiskAgent** - Calcula puntuaciones de riesgo comprehensivas
3. **RemediationAgent** - Genera fixes de código seguros

### 🔌 Servidores MCP Implementados (Framework Oficial Nullshot)

1. **SlitherMCP** - Análisis estático de contratos Solidity
2. **BlockchainMCP** - Obtención de datos on-chain y transacciones
3. **DeFiDataMCP** - Datos DeFi e historial de exploits

**✅ Configuración Oficial:** Este proyecto usa el framework oficial de Nullshot con `@nullshot/cli` y archivo `mcp.json` configurado según el schema oficial.

### ⛓️ Web3 Integration

- **AuditRegistry.sol** - On-chain audit registry with contractOwner mapping
- **GuardNFT.sol** - Certification NFTs for audited contracts (decentralized minting)
- **GuardToken.sol** - ERC-20 token for rewards
- **Network** - Currently deployed on Base Sepolia (EVM-compatible contract analysis supported)
- **Wallet Integration** - Thirdweb ConnectButton

#### 📍 Deployed Contracts on Base Sepolia (Updated December 2025)

| Contract | Address | Basescan | Sourcify |
|----------|---------|----------|----------|
| **AuditRegistry** | [`0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF`](https://sepolia.basescan.org/address/0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF) | [✅ Verified](https://sepolia.basescan.org/address/0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF#code) | [✅ Verified](https://repo.sourcify.dev/contracts/full_match/84532/0x6D3d5487c41E1759b5457f5C29f8d41caC51a8eF/) |
| **GuardNFT** | [`0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52`](https://sepolia.basescan.org/address/0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52) | [✅ Verified](https://sepolia.basescan.org/address/0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52#code) | [✅ Verified](https://repo.sourcify.dev/contracts/full_match/84532/0xE429b1AFD7BDd12ceDB69777538f5925CB6CeF52/) |
| **GuardToken** | [`0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED`](https://sepolia.basescan.org/address/0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED) | [✅ Verified](https://sepolia.basescan.org/address/0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED#code) | [✅ Verified](https://repo.sourcify.dev/contracts/full_match/84532/0xBc3035ed036B280AdB9A6Ad19a46089E39e2eDED/) |

**Network:** Base Sepolia (Chain ID: 84532)  
**Deployer:** `0xF93F07b1b35b9DF13e2d53DbAd49396f0A9538D9`

> 💡 **Note:** ✅ All contracts are verified on **Basescan** and **Sourcify**, available for public inspection. Contracts use OpenZeppelin v5.0.2 and follow security best practices as of December 2025.

**🆕 December 2025 Updates:**
- **Decentralized Badge Minting**: Contract owners can now mint certification badges directly from their wallets
- **No Server Required**: Users mint badges without needing server-side private keys
- **contractOwner Mapping**: AuditRegistry tracks who registered each audit for ownership verification

### 🔒 Security Improvements Implemented (December 2025)

**AuditRegistry:**
- ✅ Circular buffer O(1) to prevent DoS in write operations
- ✅ Explicit limit on read functions (50 active audits)
- ✅ Custom errors for gas optimization
- ✅ Complete protection against DoS attacks
- ✅ **contractOwner mapping** for decentralized badge minting

**GuardNFT:**
- ✅ CEI pattern (Checks-Effects-Interactions) implemented
- ✅ Reentrancy protection
- ✅ Enhanced security documentation
- ✅ **Decentralized minting**: Only contract owners can mint their certification badges
- ✅ **Ownership verification**: Uses AuditRegistry's contractOwner mapping

**GuardToken:**
- ✅ Batch size limit (100 recipients) to prevent DoS
- ✅ Custom errors implemented
- ✅ Protection in batch operations

### 🔐 How Decentralized Badge Minting Works

1. **User Registers Audit**: When a user records an audit for their contract, their wallet address is stored as `contractOwner` in AuditRegistry
2. **Contract Gets Certified**: If risk score < 40, the contract is automatically certified
3. **User Mints Badge**: The same user (contract owner) can now mint the certification badge directly from their wallet
4. **Verification**: GuardNFT contract verifies:
   - The caller is the `contractOwner` of the audited contract
   - The contract is certified (risk score < 40)
   - No badge already exists for this contract

**Benefits:**
- ✅ Fully decentralized - no server dependency
- ✅ Users control their own badges
- ✅ More secure - no single point of failure
- ✅ True Web3 experience

### 📊 Test Coverage

**Unit Tests:**
- ✅ Comprehensive test suites for all three contracts
- ✅ Tests cover deployment, core functionality, edge cases, and security features
- ✅ Tests use Hardhat and Chai for assertions

**Integration Tests:**
- ✅ Real transactions executed on Base Sepolia testnet
- ✅ 4 transactions per contract for verification
- ✅ All transactions verifiable on Basescan
- ✅ Gas usage tracked and documented

**Test Files:**
- `test/AuditRegistry.test.ts` - 15+ test cases
- `test/GuardNFT.test.ts` - 12+ test cases  
- `test/GuardToken.test.ts` - 18+ test cases

**Transaction Verification:**
- ✅ All test transactions verified on Base Sepolia
- ✅ Script available: `pnpm verify:transactions`
- ✅ Detailed report: [TRANSACTION_VERIFICATION.md](./TRANSACTION_VERIFICATION.md)
- ✅ Total gas used: ~1,037,000 gas across all transactions

### Demo Video

[Watch Demo Video](https://youtube.com/watch?v=YOUR_VIDEO_ID)

### Live Deployment

- **Nullshot Jam**: [nullshot.ai/app/defiguard](https://nullshot.ai/app/defiguard)
- **Vercel**: [defiguard-ai.vercel.app](https://defiguard-ai.vercel.app)
- **GitHub**: [github.com/yourusername/defiguard-ai](https://github.com/yourusername/defiguard-ai)

## 🔒 Security Features

### Vulnerability Detection

- Reentrancy attacks
- Integer overflow/underflow
- Unchecked external calls
- Access control issues
- Denial of service vectors
- Front-running risks
- Timestamp manipulation
- Uninitialized storage
- Delegatecall vulnerabilities
- tx.origin authentication

### AI Analysis

Gemini 2.5 Flash provides:
- Pattern recognition across 2M token context
- Historical exploit correlation
- Natural language vulnerability explanations
- Automated remediation code generation

## 📈 Roadmap

- [x] Core auditing functionality
- [x] EVM-compatible contract analysis (on-chain registration on Base Sepolia)
- [x] AI-powered analysis with Gemini
- [x] MCP server architecture
- [x] **Decentralized badge minting** (December 2025)
- [ ] Solana contract support
- [ ] Automated GitHub integration
- [ ] Real-time monitoring alerts
- [ ] DAO governance for security ratings
- [ ] Insurance integration for audited contracts
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **NullShot** for the amazing hackathon and framework
- **Edenlayer** for MCP architecture inspiration
- **Thirdweb** for blockchain infrastructure
- **Google** for Gemini 2.5 Flash API access
- **OpenZeppelin** for secure contract libraries

## 📞 Contact

- Twitter: [@defiguard_ai](https://twitter.com/defiguard_ai)
- Discord: [Join NullShot](https://discord.gg/nullshot)
- Email: security@defiguard.ai

---

**Made with ❤️ by Vaiosx & M0nsxx**
