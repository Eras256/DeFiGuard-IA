"use client";

import React from "react";
import { ArrowLeft, FileText, AlertTriangle, Shield, Scale, Gavel } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
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
            <FileText className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-text">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">
            <strong>Effective Date:</strong> {currentDate}
          </p>
        </div>

        {/* Introduction */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to DeFiGuard AI ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to 
              and use of our website at <strong className="text-white">defiguard.ai</strong> and our AI-powered smart 
              contract security auditing platform (collectively, the "Service").
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, 
              please do not access or use our Service. These Terms constitute a legally binding agreement between you and 
              DeFiGuard AI.
            </p>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>2. Eligibility and Account Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">2.1. Age Requirement</h3>
              <p className="text-muted-foreground text-sm">
                You must be at least 18 years old to use our Service. By using the Service, you represent and warrant that 
                you are at least 18 years of age.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2.2. Wallet Connection</h3>
              <p className="text-muted-foreground text-sm">
                To use certain features of our Service, you may need to connect a Web3 wallet (such as MetaMask, WalletConnect, 
                or similar). You are solely responsible for maintaining the security of your wallet and private keys. We do 
                not have access to your private keys and cannot recover them if lost.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2.3. Account Responsibility</h3>
              <p className="text-muted-foreground text-sm">
                You are responsible for all activities that occur under your wallet address. You agree to notify us immediately 
                of any unauthorized use of your wallet or any other breach of security.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Use of Service */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              3. Use of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">3.1. Permitted Use</h3>
              <p className="text-muted-foreground text-sm">
                You may use our Service for lawful purposes only and in accordance with these Terms. You agree to use the 
                Service to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 space-y-1 ml-4">
                <li>Analyze smart contracts for security vulnerabilities</li>
                <li>Record audit results on blockchain networks</li>
                <li>Mint certification badges for qualified contracts</li>
                <li>Access and view public audit records</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3.2. Prohibited Activities</h3>
              <p className="text-muted-foreground text-sm mb-2">
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                <li>Use the Service for any illegal purpose or in violation of any applicable laws or regulations</li>
                <li>Violate or infringe upon our intellectual property rights or the rights of others</li>
                <li>Attempt to gain unauthorized access to our Service, systems, or networks</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
                <li>Submit malicious code, viruses, or harmful content</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Use the Service to analyze contracts for malicious purposes or to exploit vulnerabilities</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Collect or harvest information about other users without their consent</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Smart Contract Analysis */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>4. Smart Contract Analysis Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">4.1. AI-Powered Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Our Service uses artificial intelligence (GEMINI IA + MCP NullShot Architecture) to analyze smart contract 
                code for security vulnerabilities. The analysis is provided "as-is" and is based on automated scanning and 
                pattern recognition.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.2. No Guarantee of Security</h3>
              <p className="text-muted-foreground text-sm">
                <strong className="text-white">IMPORTANT:</strong> Our analysis does not guarantee that your smart contract 
                is secure or free from vulnerabilities. AI analysis may produce false positives or false negatives. You should:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 space-y-1 ml-4">
                <li>Conduct additional security audits by professional auditors</li>
                <li>Review all findings manually</li>
                <li>Test your contracts thoroughly before deployment</li>
                <li>Not rely solely on automated analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.3. Contract Code</h3>
              <p className="text-muted-foreground text-sm">
                By submitting contract code for analysis, you represent that you have the right to submit such code and 
                that it does not violate any third-party rights. We do not claim ownership of your contract code, but we 
                may store and process it to provide the analysis service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Transactions */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>5. Blockchain Transactions and On-Chain Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">5.1. Transaction Fees</h3>
              <p className="text-muted-foreground text-sm">
                Recording audits on-chain and minting NFT badges require blockchain transactions. You are responsible for 
                paying all gas fees and transaction costs associated with these operations. We do not charge fees for our 
                Service, but blockchain networks require transaction fees.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5.2. Irreversibility</h3>
              <p className="text-muted-foreground text-sm">
                Blockchain transactions are irreversible. Once you record an audit or mint a badge on-chain, this action 
                cannot be undone. Please verify all information before confirming transactions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5.3. Public Records</h3>
              <p className="text-muted-foreground text-sm">
                Information recorded on blockchain networks is publicly accessible and permanent. Audit records, certification 
                badges, and associated metadata become part of the public blockchain record.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">5.4. Network Availability</h3>
              <p className="text-muted-foreground text-sm">
                Our Service operates on Base Sepolia testnet. We are not responsible for blockchain network outages, congestion, 
                or failures. Transactions may be delayed or fail due to network conditions beyond our control.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              6. Intellectual Property Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">6.1. Our Intellectual Property</h3>
              <p className="text-muted-foreground text-sm">
                The Service, including its design, features, functionality, and content, is owned by DeFiGuard AI and protected 
                by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create 
                derivative works of the Service without our express written permission.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">6.2. Your Content</h3>
              <p className="text-muted-foreground text-sm">
                You retain ownership of any smart contract code you submit. By using our Service, you grant us a license to 
                use, store, and process your code solely for the purpose of providing the analysis service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">6.3. Feedback</h3>
              <p className="text-muted-foreground text-sm">
                If you provide feedback, suggestions, or ideas about our Service, you grant us a perpetual, irrevocable, 
                royalty-free license to use, modify, and incorporate such feedback into our Service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              7. Disclaimers and Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">7.1. Service Provided "As-Is"</h3>
              <p className="text-muted-foreground text-sm">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">7.2. No Security Guarantee</h3>
              <p className="text-muted-foreground text-sm">
                We do not guarantee that our analysis will identify all vulnerabilities or that analyzed contracts are secure. 
                The analysis is provided for informational purposes only and should not be the sole basis for security decisions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">7.3. Limitation of Liability</h3>
              <p className="text-muted-foreground text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEFIGUARD AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF 
                OR RELATING TO YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">7.4. Maximum Liability</h3>
              <p className="text-muted-foreground text-sm">
                Our total liability to you for any claims arising from or related to the Service shall not exceed the amount 
                you paid us in the twelve (12) months preceding the claim, or $100, whichever is greater.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>8. Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              You agree to indemnify, defend, and hold harmless DeFiGuard AI, its officers, directors, employees, and agents 
              from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, 
              arising out of or in any way connected with your use of the Service, violation of these Terms, or infringement 
              of any rights of another.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>9. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">9.1. Termination by You</h3>
              <p className="text-muted-foreground text-sm">
                You may stop using our Service at any time. However, information already recorded on blockchain cannot be 
                deleted.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">9.2. Termination by Us</h3>
              <p className="text-muted-foreground text-sm">
                We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, 
                for any reason, including if you violate these Terms or engage in prohibited activities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">9.3. Effect of Termination</h3>
              <p className="text-muted-foreground text-sm">
                Upon termination, your right to use the Service will immediately cease. Sections of these Terms that by their 
                nature should survive termination will survive, including Sections 6 (Intellectual Property), 7 (Disclaimers), 
                8 (Indemnification), and 11 (Governing Law).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>10. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the 
              updated Terms on this page and updating the "Effective Date." Your continued use of the Service after such changes 
              constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Service.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              11. Governing Law and Dispute Resolution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">11.1. Governing Law</h3>
              <p className="text-muted-foreground text-sm">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United 
                States, without regard to its conflict of law provisions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">11.2. Dispute Resolution</h3>
              <p className="text-muted-foreground text-sm">
                Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding 
                arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law. 
                You waive your right to a jury trial and to participate in class actions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">11.3. Jurisdiction</h3>
              <p className="text-muted-foreground text-sm">
                For any disputes not subject to arbitration, you agree to submit to the exclusive jurisdiction of the courts 
                located in Delaware, United States.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Miscellaneous */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>12. Miscellaneous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">12.1. Entire Agreement</h3>
              <p className="text-muted-foreground text-sm">
                These Terms constitute the entire agreement between you and DeFiGuard AI regarding the Service and supersede 
                all prior agreements and understandings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">12.2. Severability</h3>
              <p className="text-muted-foreground text-sm">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or 
                eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">12.3. Waiver</h3>
              <p className="text-muted-foreground text-sm">
                Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or 
                provision.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">12.4. Assignment</h3>
              <p className="text-muted-foreground text-sm">
                You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may 
                assign these Terms without restriction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>13. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-sm text-white font-semibold mb-2">DeFiGuard AI</p>
              <p className="text-sm text-muted-foreground">
                Email: <a href="mailto:legal@defiguard.ai" className="text-primary hover:underline">legal@defiguard.ai</a>
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

