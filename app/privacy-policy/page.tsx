"use client";

import React from "react";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-text">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">
            <strong>Effective Date:</strong> {currentDate}
          </p>
        </div>

        {/* Introduction */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              DeFiGuard AI ("we," "our," or "us") is committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website at <strong className="text-white">defiguard.ai</strong> and use our services, including 
              our AI-powered smart contract security auditing platform.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By accessing or using our Service, you agree to the collection and use of information in accordance with 
              this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              2. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">2.1. Information You Provide Directly</h3>
              <p className="text-muted-foreground text-sm">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 space-y-1 ml-4">
                <li>Register for an account or connect your Web3 wallet</li>
                <li>Submit smart contract code for analysis</li>
                <li>Record audit results on-chain</li>
                <li>Mint NFT certification badges</li>
                <li>Contact us for support or inquiries</li>
                <li>Subscribe to our newsletter or updates</li>
              </ul>
              <p className="text-muted-foreground text-sm mt-3">
                This information may include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 space-y-1 ml-4">
                <li><strong className="text-white">Wallet Address:</strong> Your blockchain wallet address (public key)</li>
                <li><strong className="text-white">Contract Code:</strong> Smart contract source code you submit for analysis</li>
                <li><strong className="text-white">Contract Addresses:</strong> Addresses of contracts you audit</li>
                <li><strong className="text-white">Email Address:</strong> If you provide it for communications</li>
                <li><strong className="text-white">Transaction Data:</strong> On-chain transaction hashes and metadata</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2.2. Automatically Collected Information</h3>
              <p className="text-muted-foreground text-sm">
                When you use our Service, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 space-y-1 ml-4">
                <li><strong className="text-white">Usage Data:</strong> How you interact with our Service, pages visited, features used</li>
                <li><strong className="text-white">Device Information:</strong> Browser type, operating system, device identifiers</li>
                <li><strong className="text-white">IP Address:</strong> Your Internet Protocol address</li>
                <li><strong className="text-white">Blockchain Data:</strong> Public blockchain data related to your transactions</li>
                <li><strong className="text-white">Cookies and Tracking Technologies:</strong> As described in Section 7</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2.3. Blockchain Data</h3>
              <p className="text-muted-foreground text-sm">
                Our Service interacts with blockchain networks (Base Sepolia). Blockchain data is public and permanent. 
                When you record audits or mint badges on-chain, this information becomes part of the public blockchain 
                record and cannot be deleted. We access and display this public blockchain data as part of our Service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              3. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 ml-4">
              <li><strong className="text-white">Provide and Improve Services:</strong> Analyze smart contracts, generate security reports, record audits on-chain, and mint certification badges</li>
              <li><strong className="text-white">Process Transactions:</strong> Facilitate on-chain transactions for audit recording and NFT minting</li>
              <li><strong className="text-white">Communicate:</strong> Respond to inquiries, send service updates, and provide customer support</li>
              <li><strong className="text-white">Security:</strong> Detect and prevent fraud, abuse, and security threats</li>
              <li><strong className="text-white">Analytics:</strong> Understand usage patterns to improve our Service</li>
              <li><strong className="text-white">Legal Compliance:</strong> Comply with applicable laws, regulations, and legal processes</li>
              <li><strong className="text-white">Research:</strong> Conduct research and analysis to improve security analysis capabilities</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              4. Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm mb-3">
                We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">4.1. Public Blockchain Data</h3>
              <p className="text-muted-foreground text-sm">
                Information recorded on-chain (audit records, NFT badges) is publicly accessible on the blockchain and 
                cannot be deleted. This data is visible to anyone who queries the blockchain.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">4.2. Service Providers</h3>
              <p className="text-muted-foreground text-sm">
                We may share information with third-party service providers who perform services on our behalf, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 space-y-1 ml-4">
                <li>Cloud hosting and infrastructure providers</li>
                <li>Blockchain network providers (Base Sepolia RPC)</li>
                <li>AI service providers (Google Gemini API)</li>
                <li>Analytics and monitoring services</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">4.3. Legal Requirements</h3>
              <p className="text-muted-foreground text-sm">
                We may disclose information if required by law, court order, or government regulation, or to protect 
                our rights, property, or safety, or that of our users or others.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">4.4. Business Transfers</h3>
              <p className="text-muted-foreground text-sm">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part 
                of that transaction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              5. Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              We implement appropriate technical and organizational measures to protect your information from unauthorized 
              access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 ml-4">
              <li>Encryption of data in transit using SSL/TLS</li>
              <li>Secure storage practices for sensitive information</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Monitoring for security threats and vulnerabilities</li>
            </ul>
            <p className="text-muted-foreground text-sm mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
              to protect your information, we cannot guarantee absolute security. You are responsible for maintaining the 
              security of your wallet and private keys.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>6. Your Data Protection Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-1 text-sm">Right to Access</h3>
                <p className="text-muted-foreground text-sm">
                  You have the right to request copies of your personal information that we hold.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Right to Rectification</h3>
                <p className="text-muted-foreground text-sm">
                  You have the right to request that we correct any information you believe is inaccurate or incomplete.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Right to Erasure</h3>
                <p className="text-muted-foreground text-sm">
                  You have the right to request that we erase your personal information, under certain conditions. 
                  <strong className="text-white"> Note:</strong> Information recorded on blockchain cannot be deleted.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Right to Restrict Processing</h3>
                <p className="text-muted-foreground text-sm">
                  You have the right to request that we restrict the processing of your personal information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Right to Data Portability</h3>
                <p className="text-muted-foreground text-sm">
                  You have the right to request that we transfer your data to another organization or directly to you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm">Right to Object</h3>
                <p className="text-muted-foreground text-sm">
                  You have the right to object to our processing of your personal information.
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mt-4">
              To exercise these rights, please contact us using the information provided in Section 10.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>7. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. 
              Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Types of cookies we use:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 ml-4">
              <li><strong className="text-white">Essential Cookies:</strong> Required for the Service to function properly</li>
              <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how users interact with our Service</li>
              <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-muted-foreground text-sm mt-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
              if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Our Service is not intended for children under the age of 18. We do not knowingly collect personal information 
              from children under 18. If you are a parent or guardian and believe your child has provided us with personal 
              information, please contact us immediately. If we become aware that we have collected personal information from 
              a child under 18, we will take steps to delete such information.
            </p>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>9. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have data protection laws that differ from those in your country. By using our Service, 
              you consent to the transfer of your information to these countries. We take appropriate safeguards to ensure 
              your information is protected in accordance with this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Changes */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>10. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Effective Date" at the top. You are advised to review this 
              Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted 
              on this page.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              11. Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-sm text-white font-semibold mb-2">DeFiGuard AI</p>
              <p className="text-sm text-muted-foreground">
                Email: <a href="mailto:privacy@defiguard.ai" className="text-primary hover:underline">privacy@defiguard.ai</a>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Website: <a href="/contact" className="text-primary hover:underline">/contact</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/">
            <Button size="lg" variant="glow" className="text-lg px-8">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

