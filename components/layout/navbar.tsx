"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "thirdweb/react";
import { Shield, Menu, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { thirdwebClient } from "@/lib/thirdweb/client-config";
import { CONTRACT_ADDRESSES } from "@/lib/constants";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/audit", label: "Audit" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/monitoring", label: "Monitoring" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 blur-xl bg-primary/50 group-hover:bg-primary/70 transition-all" />
            </div>
            <span className="text-xl font-bold gradient-text">DeFiGuard IA</span>
            <span className="text-xs text-gray-500 hidden sm:inline">Base Sepolia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative group",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all group-hover:w-full" />
              </Link>
            ))}

            {/* Contracts Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1">
                Contracts <ExternalLink className="h-3 w-3" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-80 glass rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="space-y-2 text-xs">
                  <a
                    href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.AUDIT_REGISTRY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-primary transition-colors"
                  >
                    <div className="font-medium">AuditRegistry</div>
                    <div className="text-gray-500 font-mono">{CONTRACT_ADDRESSES.AUDIT_REGISTRY}</div>
                  </a>
                  <a
                    href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.GUARD_NFT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-primary transition-colors"
                  >
                    <div className="font-medium">GuardNFT</div>
                    <div className="text-gray-500 font-mono">{CONTRACT_ADDRESSES.GUARD_NFT}</div>
                  </a>
                  <a
                    href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.GUARD_TOKEN}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-primary transition-colors"
                  >
                    <div className="font-medium">GuardToken</div>
                    <div className="text-gray-500 font-mono">{CONTRACT_ADDRESSES.GUARD_TOKEN}</div>
                  </a>
                </div>
              </div>
            </div>

            <ConnectButton client={thirdwebClient} />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <ConnectButton client={thirdwebClient} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
