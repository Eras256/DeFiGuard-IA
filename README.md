# 🛡️ DeFiGuard AI - AI-Powered Smart Contract Security Auditor

![DeFiGuard AI](https://img.shields.io/badge/Built%20With-Gemini%202.5%20Flash-blue)
![License](https://img.shields.io/badge/License-MIT-green)
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
- 🧠 **MCP Architecture** - Model Context Protocol for enhanced security analysis
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
- **MCP Architecture** - Model Context Protocol implementation
- **Custom MCP Servers** - Slither, Blockchain Data, DeFi Analytics
- **AI Agents** - AdvancedAuditorAgent, RiskAgent, RemediationAgent

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

### Deploy to Production

Deploy your application to your preferred hosting platform (Vercel, Netlify, etc.) for production use.

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

## 🏗️ System Architecture

### Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT LAYER                                         │
│                              (Browser / Next.js Frontend)                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Home Page  │  │  Audit Page  │  │  Dashboard   │  │  Monitoring  │              │
│  │  (Landing)   │  │  (Analysis)  │  │  (Stats)     │  │  (Alerts)    │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                  │                        │
│         └──────────────────┴──────────────────┴──────────────────┘                        │
│                              │                                                             │
│                    ┌─────────▼─────────┐                                                 │
│                    │   Shared Components │                                                 │
│                    │  - Navbar/Footer   │                                                 │
│                    │  - UI Components   │                                                 │
│                    │  - Chatbot         │                                                 │
│                    └─────────┬─────────┘                                                 │
│                              │                                                             │
└──────────────────────────────┼───────────────────────────────────────────────────────────┘
                               │
                               │ HTTP Requests
                               │
┌──────────────────────────────▼───────────────────────────────────────────────────────────┐
│                                 API ROUTES LAYER                                         │
│                              (Next.js API Routes)                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                      │
│  │  /api/analyze    │  │ /api/record-audit│  │  /api/mint-badge │                      │
│  │  (POST)         │  │  (POST)          │  │  (POST)          │                      │
│  │                  │  │                  │  │                  │                      │
│  │  - Validates     │  │  - Prepares      │  │  - Checks        │                      │
│  │    contract code │  │    transaction   │  │    certification │                      │
│  │  - Calls         │  │  - Uses          │  │  - Mints NFT     │                      │
│  │    AdvancedAgent │  │    Thirdweb SDK  │  │    badge         │                      │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘                      │
│           │                      │                      │                                  │
│           │                      │                      │                                  │
│  ┌────────▼──────────────────────▼──────────────────────▼────────┐                       │
│  │              /api/chat (Chatbot API)                         │                       │
│  │              /api/gemini (Gemini Proxy)                     │                       │
│  │              /api/transactions (TX History)                   │                       │
│  └──────────────────────────────────────────────────────────────┘                       │
│                                                                                           │
└──────────────────────────────┬───────────────────────────────────────────────────────────┘
                               │
                               │ Function Calls
                               │
┌──────────────────────────────▼───────────────────────────────────────────────────────────┐
│                            AI AGENTS LAYER                                               │
│                    (MCP Architecture)                                                      │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐              │
│  │              AdvancedAuditorAgent (Main Agent)                       │              │
│  │  ┌───────────────────────────────────────────────────────────────┐  │              │
│  │  │  analyzeContract(code, contractAddress?)                      │  │              │
│  │  │  1. Calls MCP Servers in parallel                            │  │              │
│  │  │  2. Builds enriched context                                   │  │              │
│  │  │  3. Sends to Gemini 2.5 Flash via AI SDK                     │  │              │
│  │  │  4. Returns VulnerabilityAnalysis                             │  │              │
│  │  └───────────────────────────────────────────────────────────────┘  │              │
│  └─────────────────────────────────────────────────────────────────────┘              │
│                              │                                                           │
│         ┌────────────────────┼────────────────────┐                                     │
│         │                    │                    │                                     │
│  ┌──────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐                            │
│  │ RiskAgent   │    │ Remediation   │    │ AuditorAgent │                            │
│  │             │    │ Agent         │    │ (Legacy)     │                            │
│  │ - Calculates│    │               │    │              │                            │
│  │   risk score│    │ - Generates   │    │ - Basic      │                            │
│  │ - Classifies│    │   secure fixes│    │   analysis   │                            │
│  │   risk level│    │ - Code patches│    │              │                            │
│  └─────────────┘    └──────────────┘    └──────────────┘                            │
│                                                                                           │
└──────────────────────────────┬───────────────────────────────────────────────────────────┘
                               │
                               │ MCP Protocol Calls
                               │
┌──────────────────────────────▼───────────────────────────────────────────────────────────┐
│                          MCP SERVERS LAYER                                               │
│                    (Model Context Protocol)                                              │
│                    Configured via mcp.json                                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │   SlitherMCP         │  │   BlockchainMCP       │  │   DeFiDataMCP       │        │
│  │   (slither-analyzer) │  │   (blockchain-data)   │  │   (defi-data)        │        │
│  │                      │  │                      │  │                      │        │
│  │  Methods:           │  │  Methods:            │  │  Methods:           │        │
│  │  - analyze()        │  │  - getContractInfo() │  │  - getExploitHistory()│        │
│  │  - getVulnerability  │  │  - getTransaction     │  │  - getHistorical     │        │
│  │    Patterns()       │  │    History()          │  │    Exploits()        │        │
│  │                      │  │                      │  │  - getProtocolTVL()  │        │
│  │  Output:            │  │  Output:             │  │  - getSecurityRating │        │
│  │  - Static analysis   │  │  - Contract info     │  │    ()                │        │
│  │  - Vulnerability     │  │  - TX history        │  │                      │        │
│  │    patterns          │  │  - On-chain data     │  │  Output:             │        │
│  │                      │  │                      │  │  - Historical        │        │
│  │                      │  │  Integrates:         │  │    exploits          │        │
│  │                      │  │  - Thirdweb SDK      │  │  - DeFi protocol     │        │
│  │                      │  │  - Basescan API     │  │    data               │        │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘        │
│                                                                                           │
│  All MCP servers called in parallel via Promise.allSettled()                             │
│  Context aggregated and injected into Gemini prompt                                      │
│                                                                                           │
└──────────────────────────────┬───────────────────────────────────────────────────────────┘
                               │
                               │ API Calls
                               │
┌──────────────────────────────▼───────────────────────────────────────────────────────────┐
│                          AI/ML LAYER                                                      │
│                    (Google Gemini 2.5 Flash)                                             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐              │
│  │                    Gemini API Client                                 │              │
│  │  (lib/gemini/client.ts)                                              │              │
│  │                                                                       │              │
│  │  - analyzeContractWithGemini()                                       │              │
│  │  - generateRemediationCode()                                         │              │
│  │  - Multi-model fallback system:                                      │              │
│  │    1. gemini-2.5-flash (primary)                                    │              │
│  │    2. gemini-2.5-pro (fallback)                                     │              │
│  │    3. gemini-2.0-flash (fallback)                                   │              │
│  │    4. gemini-1.5-flash (fallback)                                   │              │
│  │    5. gemini-1.5-pro (fallback)                                     │              │
│  │                                                                       │              │
│  │  Input: Contract code + MCP context                                   │              │
│  │  Output: VulnerabilityAnalysis JSON                                  │              │
│  │    - vulnerabilities[] (type, severity, line, description, fix)      │              │
│  │    - riskScore (0-100)                                               │              │
│  │    - gasOptimizations[]                                              │              │
│  │    - bestPractices[]                                                 │              │
│  │    - summary                                                          │              │
│  └─────────────────────────────────────────────────────────────────────┘              │
│                                                                                           │
└──────────────────────────────┬───────────────────────────────────────────────────────────┘
                               │
                               │ Blockchain Calls
                               │
┌──────────────────────────────▼───────────────────────────────────────────────────────────┐
│                        BLOCKCHAIN LAYER                                                   │
│                    (Base Sepolia Network)                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐              │
│  │                    Thirdweb SDK                                     │              │
│  │  - Wallet connection (ConnectButton)                                  │              │
│  │  - Contract interaction                                               │              │
│  │  - Transaction preparation                                           │              │
│  └─────────────────────────────────────────────────────────────────────┘              │
│                              │                                                           │
│         ┌────────────────────┼────────────────────┐                                     │
│         │                    │                    │                                     │
│  ┌──────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐                            │
│  │ AuditRegistry│    │   GuardNFT   │    │  GuardToken  │                            │
│  │              │    │   (ERC-721)  │    │   (ERC-20)   │                            │
│  │              │    │              │    │              │                            │
│  │ Functions:   │    │ Functions:   │    │ Functions:   │                            │
│  │ - recordAudit│    │ - mintBadge() │    │ - claimAirdrop│                            │
│  │ - getAllAudits│   │ - getBadgeInfo│   │ - mintReward │                            │
│  │ - checkCert  │    │ - isCertified │   │ - batchMint  │                            │
│  │ - contractOwner│ │              │    │              │                            │
│  │              │    │              │    │              │                            │
│  │ Address:     │    │ Address:     │    │ Address:     │                            │
│  │ 0x6D3d...8eF │    │ 0xE429...F52 │    │ 0xBc30...DED │                            │
│  └──────────────┘    └──────────────┘    └──────────────┘                            │
│                                                                                           │
│  All contracts verified on Basescan & Sourcify                                            │
│                                                                                           │
└──────────────────────────────┬───────────────────────────────────────────────────────────┘
                               │
                               │ External API Calls
                               │
┌──────────────────────────────▼───────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Basescan API │  │ DefiLlama API │  │ Google Gemini│  │ Thirdweb     │              │
│  │              │  │               │  │ API          │  │ Infrastructure│              │
│  │ - Contract   │  │ - Protocol TVL │  │ - AI Analysis │  │ - RPC Nodes  │              │
│  │   verification│  │ - DeFi data   │  │ - Code gen    │  │ - Indexing   │              │
│  │ - TX history │  │               │  │               │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW EXAMPLE                                           │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  1. User uploads contract code → Frontend (Audit Page)                                    │
│  2. Frontend → POST /api/analyze { code, contractAddress? }                              │
│  3. API Route → AdvancedAuditorAgent.analyzeContract()                                  │
│  4. AdvancedAuditorAgent calls MCP servers in parallel:                                  │
│     ├─ SlitherMCP.analyze() → Static analysis                                            │
│     ├─ DeFiDataMCP.getHistoricalExploits() → Exploit correlation                        │
│     └─ BlockchainMCP.getContractInfo() → On-chain data (if address provided)            │
│  5. MCP context aggregated → buildAnalysisPrompt()                                      │
│  6. Prompt sent to Gemini 2.5 Flash via AI SDK                                           │
│  7. Gemini returns VulnerabilityAnalysis JSON                                            │
│  8. Response sent back to Frontend                                                       │
│  9. User clicks "Record Audit" → POST /api/record-audit                                 │
│  10. API prepares transaction → Thirdweb SDK → AuditRegistry.recordAudit()              │
│  11. If riskScore < 40 → Contract certified → User can mint NFT badge                 │
│  12. User clicks "Mint Badge" → POST /api/mint-badge                                   │
│  13. API checks certification → GuardNFT.mintBadge() → NFT minted                       │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Components Breakdown

#### **1. Client Layer (Frontend)**
- **Framework**: Next.js 14 with App Router
- **Pages**: Home, Audit, Dashboard, Monitoring
- **Components**: Modular React components with Tailwind CSS
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Wallet Integration**: Thirdweb ConnectButton

#### **2. API Routes Layer**
- **Framework**: Next.js API Routes (Node.js runtime)
- **Endpoints**:
  - `/api/analyze` - Contract analysis with MCP integration
  - `/api/record-audit` - On-chain audit registration
  - `/api/mint-badge` - NFT badge minting
  - `/api/chat` - AI chatbot for security questions
  - `/api/gemini` - Direct Gemini API proxy
  - `/api/transactions` - Transaction history

#### **3. AI Agents Layer (MCP Architecture)**
- **AdvancedAuditorAgent**: Main agent orchestrating MCP servers and AI analysis
- **RiskAgent**: Calculates risk scores (0-100) and classifies risk levels
- **RemediationAgent**: Generates secure code fixes for vulnerabilities
- **AuditorAgent**: Legacy agent for basic analysis

#### **4. MCP Servers Layer (Model Context Protocol)**
- **Configuration**: `mcp.json` following Model Context Protocol specification
- **SlitherMCP**: Static code analysis, vulnerability pattern detection
- **BlockchainMCP**: On-chain data fetching via Thirdweb SDK and Basescan API
- **DeFiDataMCP**: Historical exploit correlation and DeFi protocol data
- **Execution**: Parallel execution via `Promise.allSettled()` for fault tolerance

##### **How MCP Architecture Works**

The Model Context Protocol (MCP) architecture is the core innovation that makes DeFiGuard AI's analysis so powerful. Here's how it works:

**1. Parallel MCP Server Execution**
When analyzing a contract, the `AdvancedAuditorAgent` simultaneously calls three specialized MCP servers:

- **SlitherMCP Server** (`lib/mcp/slither-mcp.ts`):
  - Performs static code analysis on the Solidity contract
  - Detects known vulnerability patterns (reentrancy, overflow, access control issues)
  - Analyzes code structure and identifies potential security weaknesses
  - Returns structured vulnerability data with line numbers and severity levels

- **BlockchainMCP Server** (`lib/mcp/blockchain-mcp.ts`):
  - Fetches on-chain data when a contract address is provided
  - Retrieves transaction history and contract verification status
  - Analyzes contract interactions and token holder information
  - Provides real-world context about the contract's deployment and usage

- **DeFiDataMCP Server** (`lib/mcp/defi-data-mcp.ts`):
  - Correlates contract patterns with historical exploits
  - Matches vulnerabilities to real-world hacks (DAO Hack 2016, Parity Wallet, etc.)
  - Provides exploit scenarios based on similar contracts that were compromised
  - Enhances AI understanding with DeFi protocol security data

**2. Context Aggregation**
All MCP server responses are aggregated into a rich context string that includes:
- Static analysis results from Slither
- On-chain data and transaction patterns
- Historical exploit correlations
- Vulnerability pattern matches

**3. Enhanced AI Analysis**
The aggregated MCP context is injected into the Gemini AI prompt, providing the model with:
- **Multi-dimensional analysis**: Not just code review, but real-world context
- **Historical knowledge**: Understanding of how similar vulnerabilities were exploited
- **On-chain validation**: Verification of contract behavior in production
- **Pattern recognition**: Detection of vulnerabilities that static analysis alone might miss

**4. Fault Tolerance**
The system uses `Promise.allSettled()` to ensure that if one MCP server fails, the analysis continues with data from the other servers. This makes the system resilient and ensures partial failures don't break the entire analysis.

**Example Flow:**
```
User submits contract → AdvancedAuditorAgent.analyzeContract()
  ↓
Parallel execution:
  ├─ SlitherMCP.analyze() → Static analysis results
  ├─ DeFiDataMCP.getHistoricalExploits() → Exploit correlations
  └─ BlockchainMCP.getContractInfo() → On-chain data (if address provided)
  ↓
Context aggregation → buildMCPContext()
  ↓
Enhanced prompt with MCP data → Gemini AI
  ↓
Comprehensive vulnerability analysis with real-world context
```

This architecture combines the best of:
- **Static Analysis** (Slither) for pattern detection
- **On-Chain Intelligence** (Blockchain) for real-world validation
- **Historical Knowledge** (DeFi) for exploit correlation
- **AI Reasoning** (Gemini) for comprehensive understanding

The result is a security analysis that's not just code review, but a comprehensive security assessment that understands both the code and its real-world implications.

#### **5. AI/ML Layer**
- **Provider**: Google Gemini 2.5 Flash (primary)
- **Fallback Chain**: Multi-model fallback system for reliability
- **Integration**: AI SDK (`@ai-sdk/google`) for streaming and error handling
- **Context Window**: 2M tokens for large contract analysis
- **Output Format**: Structured JSON (VulnerabilityAnalysis)

#### **6. Blockchain Layer**
- **Network**: Base Sepolia (Chain ID: 84532)
- **SDK**: Thirdweb SDK v5 for contract interaction
- **Smart Contracts**:
  - **AuditRegistry**: On-chain audit registry with `contractOwner` mapping
  - **GuardNFT**: ERC-721 certification badges (decentralized minting)
  - **GuardToken**: ERC-20 rewards token (1B supply)
- **Verification**: All contracts verified on Basescan & Sourcify

#### **7. External Services**
- **Basescan API**: Contract verification and transaction history
- **DefiLlama API**: DeFi protocol TVL and data
- **Google Gemini API**: AI model inference
- **Thirdweb Infrastructure**: RPC nodes and blockchain indexing

### Key Architectural Patterns

1. **MCP Architecture**: Model Context Protocol for agent-server communication
2. **Parallel Processing**: MCP servers called in parallel for performance
3. **Fault Tolerance**: `Promise.allSettled()` ensures partial failures don't break analysis
4. **Multi-Model Fallback**: Automatic fallback to alternative Gemini models
5. **Decentralized Minting**: Users mint badges directly from wallets (no server dependency)
6. **On-Chain Registry**: Immutable audit records stored on blockchain
7. **Type Safety**: Full TypeScript coverage across all layers

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
│   ├── agents/             # AI agents
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

## 🤖 AI Agents & MCP Architecture

### 🎯 AI Agents Implemented

1. **AdvancedAuditorAgent** - Analyzes smart contracts for vulnerabilities using Gemini AI with MCP integration
2. **RiskAgent** - Calculates comprehensive risk scores
3. **RemediationAgent** - Generates secure code fixes

### 🔌 MCP Servers Implemented

DeFiGuard AI leverages the **Model Context Protocol (MCP)** architecture to provide multi-dimensional security analysis. The system integrates three specialized MCP servers that work in parallel to enhance AI-powered contract analysis:

#### **1. SlitherMCP Server** (`lib/mcp/slither-mcp.ts`)
- **Purpose**: Static code analysis and vulnerability pattern detection
- **Capabilities**:
  - Analyzes Solidity code structure and syntax
  - Detects known vulnerability patterns (reentrancy, overflow, access control)
  - Identifies code quality issues and gas optimization opportunities
  - Provides line-by-line vulnerability mapping
- **Integration**: Called automatically for every contract analysis
- **Output**: Structured vulnerability data with severity levels and recommendations

#### **2. BlockchainMCP Server** (`lib/mcp/blockchain-mcp.ts`)
- **Purpose**: On-chain data fetching and transaction analysis
- **Capabilities**:
  - Retrieves contract verification status from blockchain explorers
  - Fetches transaction history and interaction patterns
  - Analyzes token holder distribution and contract usage
  - Validates contract behavior in production environment
- **Integration**: Called when a contract address is provided (optional)
- **Output**: Real-world contract usage data and on-chain validation

#### **3. DeFiDataMCP Server** (`lib/mcp/defi-data-mcp.ts`)
- **Purpose**: Historical exploit correlation and DeFi security intelligence
- **Capabilities**:
  - Correlates contract patterns with historical exploits
  - Matches vulnerabilities to real-world hacks (DAO Hack 2016, Parity Wallet, etc.)
  - Provides exploit scenarios based on similar compromised contracts
  - Enhances AI understanding with DeFi protocol security data
- **Integration**: Called automatically for every contract analysis
- **Output**: Historical exploit correlations and real-world attack scenarios

### 🚀 How MCP Architecture Enhances AI Analysis

The power of DeFiGuard AI comes from the seamless integration of MCP servers with Gemini AI:

**Step 1: Parallel Data Collection**
```
Contract Code Submitted
    ↓
AdvancedAuditorAgent triggers parallel MCP calls:
    ├─ SlitherMCP → Static analysis results
    ├─ DeFiDataMCP → Historical exploit data
    └─ BlockchainMCP → On-chain data (if address provided)
```

**Step 2: Context Enrichment**
All MCP server responses are aggregated into a comprehensive context that includes:
- Static analysis findings (vulnerability patterns, code quality)
- Historical exploit correlations (similar vulnerabilities that were exploited)
- On-chain validation (real-world contract behavior and usage)

**Step 3: Enhanced AI Prompt**
The enriched context is injected into the Gemini AI prompt, providing:
- **Multi-dimensional understanding**: Not just code review, but real-world context
- **Historical knowledge**: Understanding of how similar vulnerabilities were exploited
- **Pattern recognition**: Detection of vulnerabilities that static analysis alone might miss
- **Contextual recommendations**: Fixes based on proven solutions from similar cases

**Step 4: Comprehensive Analysis**
Gemini AI processes the enriched context and generates:
- Detailed vulnerability reports with exploit scenarios
- Risk scores based on both code analysis and historical data
- Secure code fixes informed by real-world exploit patterns
- Best practices recommendations validated by on-chain data

**Benefits of MCP Architecture:**
- ✅ **Fault Tolerance**: Uses `Promise.allSettled()` - partial failures don't break analysis
- ✅ **Performance**: Parallel execution reduces analysis time
- ✅ **Accuracy**: Multi-dimensional analysis catches more vulnerabilities
- ✅ **Context**: Real-world data enhances AI understanding
- ✅ **Scalability**: Easy to add new MCP servers for additional capabilities

**✅ MCP Configuration:** This project implements Model Context Protocol (MCP) with `mcp.json` configuration file for seamless MCP server integration.

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

- **Thirdweb** for blockchain infrastructure
- **Google** for Gemini 2.5 Flash API access
- **OpenZeppelin** for secure contract libraries
- **Model Context Protocol** for MCP architecture specification

## 📞 Contact

- Twitter: [@defiguard_ai](https://twitter.com/defiguard_ai)
- Email: security@defiguard.ai

---

**Made with ❤️ by Vaiosx & M0nsxx**
