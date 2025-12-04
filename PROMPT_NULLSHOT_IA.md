# 🚀 Prompt Completo para Nullshot IA - DeFiGuard AI

## Instrucciones para Nullshot IA

Crea una aplicación web completa llamada **DeFiGuard AI** - un auditor de seguridad de contratos inteligentes impulsado por IA, construido con Next.js 14, TypeScript, Gemini 2.5 Flash, Thirdweb, y arquitectura MCP de Nullshot Framework.

---

## 📋 ESPECIFICACIONES GENERALES DEL PROYECTO

### Nombre del Proyecto
**DeFiGuard AI** - AI-Powered Smart Contract Security Auditor

### Propósito
Aplicación web completa para auditar contratos inteligentes Solidity usando IA (Gemini 2.5 Flash), con integración blockchain (Thirdweb), arquitectura MCP (Nullshot Framework), y certificación NFT on-chain.

### Stack Tecnológico Principal
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Gemini 2.5 Flash API
- **Blockchain**: Thirdweb SDK v5, Thirdweb React, Base Sepolia, Arbitrum Sepolia
- **AI**: Google Gemini 2.5 Flash (`gemini-2.5-flash-latest`)
- **Framework**: Nullshot Framework con MCP Architecture (`@nullshot/cli`)
- **Package Manager**: pnpm
- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin, Hardhat

---

## 📁 ESTRUCTURA DE ARCHIVOS Y CARPETAS

Crea la siguiente estructura completa:

```
defiguard-ai/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts
│   │   └── gemini/
│   │       └── route.ts
│   ├── audit/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── monitoring/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── audit/
│   │   ├── analysis-results.tsx
│   │   ├── code-diff-viewer.tsx
│   │   ├── contract-uploader.tsx
│   │   └── vulnerability-card.tsx
│   ├── dashboard/
│   │   ├── nft-badges.tsx
│   │   ├── recent-audits.tsx
│   │   └── risk-chart.tsx
│   ├── home/
│   │   ├── cta.tsx
│   │   ├── features.tsx
│   │   ├── hero.tsx
│   │   ├── how-it-works.tsx
│   │   └── stats.tsx
│   ├── layout/
│   │   ├── footer.tsx
│   │   ├── navbar.tsx
│   │   └── neural-background.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── tabs.tsx
├── contracts/
│   ├── AuditRegistry.sol
│   ├── GuardNFT.sol
│   └── GuardToken.sol
├── lib/
│   ├── agents/
│   │   ├── auditor-agent.ts
│   │   ├── remediation-agent.ts
│   │   └── risk-agent.ts
│   ├── constants.ts
│   ├── gemini/
│   │   └── client.ts
│   ├── mcp/
│   │   ├── blockchain-mcp.ts
│   │   ├── defi-data-mcp.ts
│   │   └── slither-mcp.ts
│   ├── thirdweb/
│   │   ├── client-config.ts
│   │   └── client.ts
│   └── utils.ts
├── scripts/
│   └── setup.sh
├── .env.local.example
├── .eslintrc.json
├── .gitignore
├── mcp.json
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📦 CONFIGURACIÓN DE DEPENDENCIAS (package.json)

```json
{
  "name": "defiguard-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "vercel --prod",
    "deploy:contracts": "hardhat run scripts/deploy.ts --network baseSepolia",
    "nullshot:init": "nullshot create",
    "nullshot:validate": "nullshot validate",
    "nullshot:install": "nullshot install",
    "nullshot:list": "nullshot list"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@thirdweb-dev/chains": "^0.1.120",
    "@thirdweb-dev/sdk": "^4.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0",
    "next": "14.1.0",
    "prism-react-renderer": "^2.3.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-syntax-highlighter": "^15.5.0",
    "recharts": "^2.12.0",
    "sonner": "^1.4.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "thirdweb": "^5.0.0"
  },
  "devDependencies": {
    "@nullshot/cli": "^0.2.5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/react-syntax-highlighter": "^15.5.11",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "postcss": "^8",
    "prettier": "^3.2.5",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

---

## 🔧 CONFIGURACIÓN DE NULLSHOT MCP (mcp.json)

```json
{
  "mcpServers": {
    "slither-analyzer": {
      "command": "node lib/mcp/slither-mcp.ts"
    },
    "blockchain-data": {
      "command": "node lib/mcp/blockchain-mcp.ts",
      "env": [
        {
          "name": "NEXT_PUBLIC_THIRDWEB_CLIENT_ID"
        }
      ]
    },
    "defi-data": {
      "command": "node lib/mcp/defi-data-mcp.ts"
    }
  }
}
```

---

## 🎨 DISEÑO Y ESTILOS

### Tema Visual
- **Estilo**: Glassmorphism con efectos neón cyberpunk
- **Colores principales**: 
  - Cyber Blue: `#00f0ff`
  - Cyber Purple: `#b400ff`
  - Cyber Pink: `#ff00ea`
  - Cyber Green: `#00ff94`
- **Fondo**: Gradiente oscuro con patrón neural animado
- **Tipografía**: Moderna, sans-serif, con efectos de gradiente en títulos

### Componentes UI Base
Todos los componentes deben usar:
- Radix UI para accesibilidad
- Tailwind CSS para estilos
- Framer Motion para animaciones suaves
- Lucide React para iconos

---

## 🤖 AGENTES IA (lib/agents/)

### 1. AuditorAgent (auditor-agent.ts)

```typescript
import { analyzeContractWithGemini, VulnerabilityAnalysis } from "../gemini/client";

export class AuditorAgent {
  private name: string;
  private description: string;
  private version: string;

  constructor() {
    this.name = "SmartContractAuditor";
    this.description = "Analyzes smart contracts for security vulnerabilities using multiple detection methods";
    this.version = "1.0.0";
  }

  async analyzeContract(code: string): Promise<VulnerabilityAnalysis> {
    console.log("🔍 Starting security analysis...");
    
    // Use Gemini for AI-powered analysis
    const aiAnalysis = await analyzeContractWithGemini(code);
    
    console.log(`✅ Analysis complete. Found ${aiAnalysis.vulnerabilities.length} vulnerabilities`);
    
    return aiAnalysis;
  }

  async quickScan(code: string): Promise<{ riskScore: number; criticalCount: number }> {
    const analysis = await this.analyzeContract(code);
    
    const criticalCount = analysis.vulnerabilities.filter(
      v => v.severity === "Critical"
    ).length;
    
    return {
      riskScore: analysis.riskScore,
      criticalCount,
    };
  }
}

export const auditorAgent = new AuditorAgent();
```

### 2. RiskAgent (risk-agent.ts)

```typescript
import { VulnerabilityAnalysis } from "../gemini/client";

export class RiskAgent {
  calculateRiskScore(analysis: VulnerabilityAnalysis): number {
    let score = 0;
    
    analysis.vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case "Critical": score += 30; break;
        case "High": score += 20; break;
        case "Medium": score += 10; break;
        case "Low": score += 5; break;
      }
    });
    
    return Math.min(100, score);
  }

  getRiskLevel(score: number): "Low" | "Medium" | "High" | "Critical" {
    if (score < 30) return "Low";
    if (score < 50) return "Medium";
    if (score < 75) return "High";
    return "Critical";
  }
}

export const riskAgent = new RiskAgent();
```

### 3. RemediationAgent (remediation-agent.ts)

```typescript
import { generateRemediationCode, Vulnerability } from "../gemini/client";

export class RemediationAgent {
  async generateFix(originalCode: string, vulnerability: Vulnerability): Promise<string> {
    return await generateRemediationCode(originalCode, vulnerability);
  }

  async generateMultipleFixes(
    originalCode: string,
    vulnerabilities: Vulnerability[]
  ): Promise<Record<string, string>> {
    const fixes: Record<string, string> = {};
    
    for (const vuln of vulnerabilities) {
      fixes[vuln.type] = await this.generateFix(originalCode, vuln);
    }
    
    return fixes;
  }
}

export const remediationAgent = new RemediationAgent();
```

---

## 🧠 CLIENTE GEMINI (lib/gemini/client.ts)

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface VulnerabilityAnalysis {
  vulnerabilities: Vulnerability[];
  riskScore: number;
  gasOptimizations: string[];
  bestPractices: string[];
  summary: string;
}

export interface Vulnerability {
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  line: number;
  description: string;
  exploitScenario: string;
  fix: string;
  similarExploits: string[];
}

export async function analyzeContractWithGemini(
  code: string
): Promise<VulnerabilityAnalysis> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash-latest",
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });

  const prompt = `You are an expert smart contract security auditor. Analyze this Solidity code for vulnerabilities.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations outside JSON.

\`\`\`solidity
${code}
\`\`\`

Provide a detailed security analysis in this EXACT JSON format:

{
  "vulnerabilities": [
    {
      "type": "Reentrancy" | "Integer Overflow" | etc.,
      "severity": "Critical" | "High" | "Medium" | "Low",
      "line": line_number,
      "description": "detailed explanation of the vulnerability",
      "exploitScenario": "step-by-step how this can be exploited",
      "fix": "recommended code fix",
      "similarExploits": ["DAO Hack 2016", "Other similar real-world exploits"]
    }
  ],
  "riskScore": number_0_to_100,
  "gasOptimizations": ["suggestion 1", "suggestion 2"],
  "bestPractices": ["recommendation 1", "recommendation 2"],
  "summary": "Overall security assessment of the contract"
}

Find ALL vulnerabilities including:
- Reentrancy attacks
- Integer overflow/underflow
- Unchecked external calls
- Access control issues
- DOS vulnerabilities
- Front-running risks
- Timestamp manipulation
- Uninitialized storage
- Delegatecall dangers
- tx.origin authentication`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean response - remove markdown code blocks if present
    const cleanedResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    const analysis = JSON.parse(cleanedResponse);
    return analysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze contract with AI");
  }
}

export async function generateRemediationCode(
  originalCode: string,
  vulnerability: Vulnerability
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash-latest",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });

  const prompt = `Given this vulnerable Solidity code and the identified vulnerability, provide the COMPLETE FIXED CODE.

ORIGINAL CODE:

\`\`\`solidity
${originalCode}
\`\`\`

VULNERABILITY:

Type: ${vulnerability.type}
Line: ${vulnerability.line}
Issue: ${vulnerability.description}

Provide ONLY the fixed Solidity code. No explanations, no markdown blocks, just pure Solidity code.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function explainVulnerability(
  vulnerability: Vulnerability
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash-latest",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  const prompt = `Explain this smart contract vulnerability in simple terms for developers:

Type: ${vulnerability.type}
Severity: ${vulnerability.severity}
Description: ${vulnerability.description}

Provide:
1. What this vulnerability means (2-3 sentences)
2. Real-world example of this exploit
3. Why it's dangerous
4. How to prevent it

Keep it concise and educational.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

## 🔌 SERVIDORES MCP (lib/mcp/)

### 1. SlitherMCP (slither-mcp.ts)

```typescript
export class SlitherMCP {
  async analyzeContract(code: string): Promise<{
    vulnerabilities: string[];
    gasIssues: string[];
    codeQuality: number;
  }> {
    // Simulated static analysis results
    // In production, this would call Slither tool
    return {
      vulnerabilities: [],
      gasIssues: [],
      codeQuality: 85,
    };
  }
}

export const slitherMCP = new SlitherMCP();
```

### 2. BlockchainMCP (blockchain-mcp.ts)

```typescript
export class BlockchainMCP {
  async getContractInfo(address: string, chainId: number): Promise<{
    verified: boolean;
    transactions: number;
    holders: number;
    value: string;
  }> {
    // In production, this would query blockchain explorers
    return {
      verified: false,
      transactions: 0,
      holders: 0,
      value: "0",
    };
  }

  async getTransactionHistory(address: string): Promise<any[]> {
    return [];
  }
}

export const blockchainMCP = new BlockchainMCP();
```

### 3. DeFiDataMCP (defi-data-mcp.ts)

```typescript
export class DeFiDataMCP {
  async getExploitHistory(contractType: string): Promise<string[]> {
    // Returns historical exploits related to contract patterns
    return [
      "DAO Hack 2016 - Reentrancy",
      "Parity Wallet Hack 2017 - Access Control",
    ];
  }

  async getSimilarContracts(address: string): Promise<string[]> {
    return [];
  }
}

export const defiDataMCP = new DeFiDataMCP();
```

---

## ⛓️ INTEGRACIÓN THIRDWEB (lib/thirdweb/)

### client-config.ts

```typescript
import { createThirdwebClient } from "thirdweb";

export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});
```

### client.ts

```typescript
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BaseSepoliaTestnet, ArbitrumSepolia } from "@thirdweb-dev/chains";

export function getThirdwebSDK(chainId: number) {
  const chain = chainId === 84532 ? BaseSepoliaTestnet : ArbitrumSepolia;
  
  return new ThirdwebSDK(chain, {
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });
}

export async function deployAuditRegistry(sdk: ThirdwebSDK) {
  const contract = await sdk.deployer.deployBuiltInContract("custom", {
    name: "DeFiGuardAuditRegistry",
    primary_sale_recipient: await sdk.wallet.getAddress(),
  });
  
  if (typeof contract === "string") {
    return contract;
  }
  
  if ("address" in contract && typeof contract.address === "string") {
    return contract.address;
  }
  
  if (typeof (contract as any).getAddress === "function") {
    return (contract as any).getAddress();
  }
  
  throw new Error("Could not get contract address from deployed contract");
}

export async function recordAudit(
  sdk: ThirdwebSDK,
  registryAddress: string,
  contractAddress: string,
  riskScore: number
) {
  const contract = await sdk.getContract(registryAddress);
  
  const tx = await contract.call("recordAudit", [
    contractAddress,
    riskScore,
    Math.floor(Date.now() / 1000),
  ]);
  
  return tx.receipt.transactionHash;
}
```

---

## 🎯 PÁGINAS Y RUTAS (app/)

### layout.tsx

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NeuralBackground } from "@/components/layout/neural-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeFiGuard AI - AI-Powered Smart Contract Security Auditor",
  description: "Advanced AI-powered smart contract security auditor using Gemini 2.5 Flash",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NeuralBackground />
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

### providers.tsx

```typescript
"use client";

import React, { useMemo } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

export function Providers({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => {
    const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
    
    if (!clientId) {
      console.error(
        "❌ ERROR: NEXT_PUBLIC_THIRDWEB_CLIENT_ID no está configurado."
      );
      return createThirdwebClient({
        clientId: "",
      });
    }

    return createThirdwebClient({
      clientId: clientId,
    });
  }, []);

  return (
    // @ts-ignore
    <ThirdwebProvider client={client}>
      {children}
    </ThirdwebProvider>
  );
}
```

### page.tsx (Home)

```typescript
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Stats } from "@/components/home/stats";
import { CTA } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
    </>
  );
}
```

### audit/page.tsx

```typescript
"use client";

import React, { useState } from "react";
import { ContractUploader } from "@/components/audit/contract-uploader";
import { AnalysisResults } from "@/components/audit/analysis-results";
import { VulnerabilityAnalysis } from "@/lib/gemini/client";
import { toast } from "sonner";

export default function AuditPage() {
  const [analysis, setAnalysis] = useState<VulnerabilityAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (code: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      setAnalysis(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze contract. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Smart Contract Auditor</span>
        </h1>
        <p className="text-muted-foreground">
          Upload your Solidity contract for instant AI-powered security analysis
        </p>
      </div>

      <div className="space-y-8">
        <ContractUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        {analysis && <AnalysisResults analysis={analysis} />}
      </div>
    </div>
  );
}
```

### dashboard/page.tsx

```typescript
"use client";

import { RecentAudits } from "@/components/dashboard/recent-audits";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { NFTBadges } from "@/components/dashboard/nft-badges";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">
        <span className="gradient-text">Dashboard</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentAudits />
        <RiskChart />
        <NFTBadges />
      </div>
    </div>
  );
}
```

### monitoring/page.tsx

```typescript
"use client";

export default function MonitoringPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">
        <span className="gradient-text">Real-Time Monitoring</span>
      </h1>
      <p className="text-muted-foreground">
        Monitor your audited contracts for security threats in real-time.
      </p>
    </div>
  );
}
```

---

## 🔌 API ROUTES (app/api/)

### analyze/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auditorAgent } from "@/lib/agents/auditor-agent";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Invalid contract code" },
        { status: 400 }
      );
    }

    // Analyze contract using AI agent
    const analysis = await auditorAgent.analyzeContract(code);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze contract" },
      { status: 500 }
    );
  }
}
```

### gemini/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { analyzeContractWithGemini } from "@/lib/gemini/client";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeContractWithGemini(code);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze with Gemini" },
      { status: 500 }
    );
  }
}
```

---

## 🎨 COMPONENTES PRINCIPALES

### Navbar (components/layout/navbar.tsx)

- Logo con icono Shield de Lucide React
- Navegación: Home, Audit, Dashboard, Monitoring
- ConnectButton de Thirdweb para conectar wallet
- Diseño glassmorphism con bordes neón
- Responsive con menú móvil

### Hero (components/home/hero.tsx)

- Título principal con efecto gradiente animado
- Subtítulo descriptivo
- Botones CTA: "Start Auditing" y "View Dashboard"
- Animaciones Framer Motion
- Fondo neural animado

### ContractUploader (components/audit/contract-uploader.tsx)

- Textarea para pegar código Solidity
- Botón "Analyze Contract"
- Loading state durante análisis
- Validación de código Solidity básica

### AnalysisResults (components/audit/analysis-results.tsx)

- Muestra risk score con indicador visual
- Lista de vulnerabilidades con cards
- Cada vulnerabilidad muestra:
  - Tipo y severidad (badge de color)
  - Descripción
  - Línea de código afectada
  - Escenario de explotación
  - Fix recomendado
  - Exploits similares históricos
- Tabs para: Vulnerabilities, Gas Optimizations, Best Practices
- Botón para generar código corregido

### VulnerabilityCard (components/audit/vulnerability-card.tsx)

- Card individual para cada vulnerabilidad
- Color coding por severidad:
  - Critical: Rojo
  - High: Naranja
  - Medium: Amarillo
  - Low: Azul
- Expandible para ver detalles completos
- Botón "View Fix" que muestra código corregido

### CodeDiffViewer (components/audit/code-diff-viewer.tsx)

- Muestra código original vs código corregido
- Syntax highlighting con react-syntax-highlighter
- Tema oscuro (vscDarkPlus)
- Líneas resaltadas donde hay cambios

---

## ⛓️ SMART CONTRACTS (contracts/)

### AuditRegistry.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AuditRegistry is Ownable {
    struct Audit {
        address contractAddress;
        uint256 riskScore;
        uint256 timestamp;
        string reportHash; // IPFS hash of full report
        bool isActive;
    }

    mapping(address => Audit[]) public contractAudits;
    mapping(address => bool) public isCertified;
    
    event AuditRecorded(
        address indexed contractAddress,
        uint256 riskScore,
        uint256 timestamp,
        string reportHash
    );
    
    event CertificationGranted(address indexed contractAddress);
    event CertificationRevoked(address indexed contractAddress);

    constructor() Ownable(msg.sender) {}

    function recordAudit(
        address _contractAddress,
        uint256 _riskScore,
        string memory _reportHash
    ) external onlyOwner {
        require(_riskScore <= 100, "Invalid risk score");
        
        Audit memory newAudit = Audit({
            contractAddress: _contractAddress,
            riskScore: _riskScore,
            timestamp: block.timestamp,
            reportHash: _reportHash,
            isActive: true
        });
        
        contractAudits[_contractAddress].push(newAudit);
        
        // Auto-certify if low risk
        if (_riskScore < 40) {
            isCertified[_contractAddress] = true;
            emit CertificationGranted(_contractAddress);
        }
        
        emit AuditRecorded(_contractAddress, _riskScore, block.timestamp, _reportHash);
    }

    function getLatestAudit(address _contractAddress) 
        external 
        view 
        returns (Audit memory) 
    {
        Audit[] memory audits = contractAudits[_contractAddress];
        require(audits.length > 0, "No audits found");
        return audits[audits.length - 1];
    }

    function getAuditCount(address _contractAddress) 
        external 
        view 
        returns (uint256) 
    {
        return contractAudits[_contractAddress].length;
    }

    function grantCertification(address _contractAddress) external onlyOwner {
        isCertified[_contractAddress] = true;
        emit CertificationGranted(_contractAddress);
    }

    function revokeCertification(address _contractAddress) external onlyOwner {
        isCertified[_contractAddress] = false;
        emit CertificationRevoked(_contractAddress);
    }
}
```

### GuardNFT.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GuardNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) public contractToTokenId;

    constructor() ERC721("DeFiGuard Certification", "GUARD") Ownable(msg.sender) {}

    function mintCertification(address to, address contractAddress, string memory tokenURI) 
        external 
        onlyOwner 
        returns (uint256) 
    {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        contractToTokenId[contractAddress] = tokenId;
        return tokenId;
    }

    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
```

### GuardToken.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GuardToken is ERC20, Ownable {
    constructor() ERC20("DeFiGuard Token", "GUARD") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

---

## 🎨 ESTILOS GLOBALES (app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 187 100% 50%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --muted: 217.2 32.6% 17.5%;
    --accent: 217.2 32.6% 17.5%;
    --border: 217.2 32.6% 17.5%;
    --radius: 0.5rem;
  }
}

@layer utilities {
  .glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .gradient-text {
    background: linear-gradient(135deg, #00f0ff 0%, #b400ff 50%, #ff00ea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .neural-pattern {
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(180, 0, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, rgba(255, 0, 234, 0.1) 0%, transparent 50%);
  }
}
```

---

## ⚙️ CONFIGURACIONES

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['nullshot.ai'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'DeFiGuard AI',
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

module.exports = nextConfig
```

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cyber: {
          blue: "#00f0ff",
          purple: "#b400ff",
          pink: "#ff00ea",
          green: "#00ff94",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "neural-pulse": "neural-pulse 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "gradient": "gradient 8s linear infinite",
      },
      keyframes: {
        "neural-pulse": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        glow: {
          from: { boxShadow: "0 0 20px rgba(0, 240, 255, 0.3)" },
          to: { boxShadow: "0 0 40px rgba(0, 240, 255, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🔑 VARIABLES DE ENTORNO (.env.local.example)

```bash
# AI Model
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-latest

# Blockchain
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key_here

# RPC Endpoints
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://rpc.sepolia.org

# Explorer APIs (Optional)
BASESCAN_API_KEY=your_basescan_key
ARBISCAN_API_KEY=your_arbiscan_key
ETHERSCAN_API_KEY=your_etherscan_key
```

---

## 📝 README.md

Incluye un README completo con:
- Descripción del proyecto
- Stack tecnológico
- Instrucciones de instalación
- Variables de entorno
- Guía de deployment
- Estructura del proyecto
- Uso de la aplicación
- Información del hackathon (NullShot Hacks Season 0 - Track 1b)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

Asegúrate de que el proyecto incluya:

- [x] Next.js 14 con App Router
- [x] TypeScript configurado correctamente
- [x] Tailwind CSS con tema oscuro y glassmorphism
- [x] Framer Motion para animaciones
- [x] Integración completa de Thirdweb (v5)
- [x] Cliente Gemini 2.5 Flash configurado
- [x] 3 Agentes IA implementados (Auditor, Risk, Remediation)
- [x] 3 Servidores MCP implementados (Slither, Blockchain, DeFi)
- [x] Configuración mcp.json para Nullshot Framework
- [x] API Routes para análisis de contratos
- [x] Componentes UI completos y responsive
- [x] Smart contracts Solidity (AuditRegistry, GuardNFT, GuardToken)
- [x] Páginas: Home, Audit, Dashboard, Monitoring
- [x] Sistema de autenticación con wallet (Thirdweb ConnectButton)
- [x] Visualización de vulnerabilidades con código corregido
- [x] Sistema de scoring de riesgo
- [x] Integración blockchain multi-chain

---

## 🎯 CARACTERÍSTICAS PRINCIPALES A IMPLEMENTAR

1. **Análisis de Contratos con IA**
   - Upload de código Solidity
   - Análisis con Gemini 2.5 Flash
   - Detección de vulnerabilidades
   - Generación de fixes automáticos

2. **Dashboard Interactivo**
   - Historial de auditorías
   - Gráficos de riesgo
   - Badges NFT de certificación

3. **Integración Blockchain**
   - Conexión de wallet
   - Registro on-chain de auditorías
   - Mint de NFTs de certificación
   - Soporte multi-chain

4. **Arquitectura MCP**
   - Servidores MCP para análisis estático
   - Servidores MCP para datos blockchain
   - Servidores MCP para datos DeFi
   - Integración con Nullshot Framework

---

## 🚀 INSTRUCCIONES FINALES

1. **Crea todos los archivos** según la estructura especificada
2. **Implementa todos los componentes** con TypeScript y Tailwind CSS
3. **Configura las integraciones** (Gemini, Thirdweb, Nullshot)
4. **Asegúrate de que el diseño** sea moderno, glassmorphism, con efectos neón
5. **Implementa todas las funcionalidades** de análisis, dashboard, y blockchain
6. **Incluye manejo de errores** y estados de carga
7. **Haz la aplicación responsive** para móvil y desktop
8. **Agrega animaciones** con Framer Motion
9. **Documenta todo** en el README
10. **Prueba todas las funcionalidades** antes de considerar completo

---

## 🎨 NOTAS DE DISEÑO

- **Colores**: Usa la paleta cyber (azul, púrpura, rosa, verde neón)
- **Efectos**: Glassmorphism, blur, glow, gradientes animados
- **Tipografía**: Gradientes en títulos principales
- **Iconos**: Lucide React para todos los iconos
- **Animaciones**: Suaves y profesionales con Framer Motion
- **Responsive**: Mobile-first approach

---

**¡Crea este proyecto completo y funcional con todas las características especificadas!**

