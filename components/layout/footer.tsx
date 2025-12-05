"use client";

import React from "react";
import Link from "next/link";
import { Shield, Twitter, Zap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Audit Contract", href: "/audit", description: "AI-powered smart contract security analysis" },
      { label: "Dashboard", href: "/dashboard", description: "View audit history and statistics" },
      { label: "Monitoring", href: "/monitoring", description: "Real-time contract monitoring" },
      { label: "NFT Badges", href: "/dashboard", description: "View certification badges" },
    ],
    resources: [
      { label: "NullShot Framework", href: "https://nullshot.ai", description: "Built on NullShot Architecture" },
      { label: "Security Best Practices", href: "/security-best-practices", description: "Smart contract security guidelines" },
      { label: "API Documentation", href: "/api-documentation", description: "Integration guides and API reference" },
      { label: "Tutorials", href: "/tutorials", description: "Learn how to use DeFiGuard AI" },
    ],
    company: [
      { label: "About", href: "/about", description: "Learn about DeFiGuard AI" },
      { label: "Blog", href: "/blog", description: "Latest news and updates" },
      { label: "Contact", href: "/contact", description: "Get in touch with us" },
    ],
  };

  return (
    <footer className="glass border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold gradient-text">DeFiGuard AI</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
              AI-powered smart contract security auditor using GEMINI IA + MCP NullShot Architecture powered by AI SDK. Integrated MCP servers enhance security analysis with comprehensive vulnerability detection.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">30s average analysis time</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <p className="text-xs text-muted-foreground">
                Made by <span className="text-primary font-semibold">Vaiosx</span> & <span className="text-primary font-semibold">M0nsxx</span>
              </p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">
                {category === "product" ? "PRODUCT" : category === "resources" ? "RESOURCES" : "COMPANY"}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block group"
                    >
                      <span className="group-hover:underline">{link.label}</span>
                      {link.description && (
                        <span className="block text-xs text-gray-500 mt-0.5">{link.description}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} DeFiGuard AI. Built for NullShot Hacks Season 0.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <Link
              href="/privacy-policy"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

