"use client";

import React from "react";
import { ArrowLeft, Calendar, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Smart Contract Security: A Beginner's Guide",
    excerpt: "Learn the fundamentals of smart contract security and why auditing is crucial before deployment.",
    date: "December 15, 2025",
    readTime: "5 min read",
    category: "Security",
  },
  {
    id: 2,
    title: "How AI is Revolutionizing Smart Contract Auditing",
    excerpt: "Discover how Gemini AI and MCP Architecture are transforming the way we audit smart contracts.",
    date: "December 10, 2025",
    readTime: "7 min read",
    category: "Technology",
  },
  {
    id: 3,
    title: "Common Vulnerabilities Found in DeFi Contracts",
    excerpt: "An in-depth look at the most common security vulnerabilities discovered in DeFi protocols and how to prevent them.",
    date: "December 5, 2025",
    readTime: "10 min read",
    category: "Security",
  },
  {
    id: 4,
    title: "The Future of On-Chain Certification",
    excerpt: "Exploring how NFT badges and on-chain certification are creating new standards for smart contract security verification.",
    date: "November 28, 2025",
    readTime: "6 min read",
    category: "Blockchain",
  },
  {
    id: 5,
    title: "Best Practices for Smart Contract Development",
    excerpt: "Essential guidelines and best practices every Solidity developer should follow to write secure smart contracts.",
    date: "November 20, 2025",
    readTime: "8 min read",
    category: "Development",
  },
  {
    id: 6,
    title: "DeFiGuard AI: Behind the Scenes",
    excerpt: "A technical deep-dive into how DeFiGuard AI works, from code upload to comprehensive security analysis.",
    date: "November 15, 2025",
    readTime: "12 min read",
    category: "Technology",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold gradient-text">Blog</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Latest news, updates, and insights about smart contract security
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="glass hover:border-primary/50 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="glass mt-12">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">More Content Coming Soon</h3>
            <p className="text-muted-foreground mb-6">
              We're working on bringing you comprehensive articles, tutorials, and security insights. 
              Stay tuned for updates!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/audit">
                <Button variant="glow">Start Auditing</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

