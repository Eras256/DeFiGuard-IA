import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NeuralBackground } from "@/components/layout/neural-background";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeFiGuard AI | AI-Powered Smart Contract Security Auditor",
  description: "Secure your smart contracts with AI-powered audits using Gemini 2.5 Flash and MCP architecture. Multi-chain support, instant results, and actionable fixes.",
  keywords: "smart contract, security audit, AI, Gemini, blockchain, DeFi, Web3, Solidity",
  authors: [{ name: "DeFiGuard AI Team" }],
  openGraph: {
    title: "DeFiGuard AI | AI-Powered Smart Contract Security",
    description: "AI-powered smart contract auditing in seconds. Built for NullShot Hacks Season 0.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <NeuralBackground />
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <Toaster position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}

