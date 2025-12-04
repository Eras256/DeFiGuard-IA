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
- 🌐 **Multi-Chain Support** - Ethereum, Base, Arbitrum, Optimism, Polygon
- 🔧 **Automated Fixes** - AI-generated secure code patches
- 📊 **Risk Scoring** - Comprehensive security analysis with severity levels
- 🏆 **NFT Certification** - On-chain verification badges for audited contracts
- 📡 **Real-Time Monitoring** - Continuous surveillance of deployed contracts
- 🧠 **MCP Architecture** - Built on Nullshot Framework for agent interoperability

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

# RPC Endpoints
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc

# Explorer APIs
BASESCAN_API_KEY=your_basescan_key
ARBISCAN_API_KEY=your_arbiscan_key
ETHERSCAN_API_KEY=your_etherscan_key
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
# Ensure you have testnet ETH
# Deploy to Base Sepolia
pnpm deploy:contracts

# Verify contracts (after deployment)
# Requiere BASESCAN_API_KEY en .env.local
npx hardhat verify --network baseSepolia --constructor-args scripts/verify-args-audit.js 0x9641E3A58aBe4c3a7320c3d176Da265A3a523F08
npx hardhat verify --network baseSepolia --constructor-args scripts/verify-args-nft.js 0xc838c5486eD3Cc6EFA08Ac12747a4270Cc19405b
npx hardhat verify --network baseSepolia --constructor-args scripts/verify-args-token.js 0x3d9f4d386b2a2C2bCdDC141aFD4593fCc9363440
```

**✅ Contratos Desplegados y Verificados:**
- Todos los contratos están verificados en Basescan y Sourcify
- Ver sección [Contratos Desplegados](#-integración-web3) más abajo para direcciones y links

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

### ⛓️ Integración Web3

- **AuditRegistry.sol** - Registro on-chain de auditorías
- **GuardNFT.sol** - NFTs de certificación para contratos auditados
- **GuardToken.sol** - Token ERC-20 para recompensas
- **Multi-chain** - Base, Arbitrum, Ethereum Sepolia
- **Wallet Integration** - Thirdweb ConnectButton

#### 📍 Contratos Desplegados en Base Sepolia (Verificados)

| Contrato | Dirección | Basescan | Sourcify |
|----------|-----------|----------|----------|
| **AuditRegistry** | [`0x9641E3A58aBe4c3a7320c3d176Da265A3a523F08`](https://sepolia.basescan.org/address/0x9641E3A58aBe4c3a7320c3d176Da265A3a523F08) | [✅ Verificado](https://sepolia.basescan.org/address/0x9641E3A58aBe4c3a7320c3d176Da265A3a523F08#code) | [✅ Verificado](https://repo.sourcify.dev/contracts/full_match/84532/0x9641E3A58aBe4c3a7320c3d176Da265A3a523F08/) |
| **GuardNFT** | [`0xc838c5486eD3Cc6EFA08Ac12747a4270Cc19405b`](https://sepolia.basescan.org/address/0xc838c5486eD3Cc6EFA08Ac12747a4270Cc19405b) | [✅ Verificado](https://sepolia.basescan.org/address/0xc838c5486eD3Cc6EFA08Ac12747a4270Cc19405b#code) | [✅ Verificado](https://repo.sourcify.dev/contracts/full_match/84532/0xc838c5486eD3Cc6EFA08Ac12747a4270Cc19405b/) |
| **GuardToken** | [`0x3d9f4d386b2a2C2bCdDC141aFD4593fCc9363440`](https://sepolia.basescan.org/address/0x3d9f4d386b2a2C2bCdDC141aFD4593fCc9363440) | [✅ Verificado](https://sepolia.basescan.org/address/0x3d9f4d386b2a2C2bCdDC141aFD4593fCc9363440#code) | [✅ Verificado](https://repo.sourcify.dev/contracts/full_match/84532/0x3d9f4d386b2a2C2bCdDC141aFD4593fCc9363440/) |

**Network:** Base Sepolia (Chain ID: 84532)  
**Deployer:** `0xF93F07b1b35b9DF13e2d53DbAd49396f0A9538D9`

> 💡 **Nota:** ✅ Todos los contratos están verificados en **Basescan** y **Sourcify**, disponibles para inspección pública. Los contratos utilizan OpenZeppelin v5.0.2 y siguen las mejores prácticas de seguridad de diciembre 2025.

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
- [x] Multi-chain support (Base, Arbitrum, Ethereum)
- [x] AI-powered analysis with Gemini
- [x] MCP server architecture
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

**Built with ❤️ for NullShot Hacks Season 0**

Track: 1b - Web App using Nullshot Framework
Tags: #AI #MCP #Security #SmartContracts #DeFi #Web3
