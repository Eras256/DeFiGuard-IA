"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";

interface CodeDiffViewerProps {
  original: string;
  fixed: string;
  vulnerability: string;
}

export function CodeDiffViewer({ original, fixed, vulnerability }: CodeDiffViewerProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Code Fix Preview
          </span>
          <Badge variant="outline">{vulnerability}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Code */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-red-400">❌ Vulnerable Code</div>
            <pre className="glass p-4 rounded-lg overflow-x-auto text-xs border-2 border-red-500/30">
              <code className="text-red-300">{original}</code>
            </pre>
          </div>

          {/* Fixed Code */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-green-400">✅ Fixed Code</div>
            <pre className="glass p-4 rounded-lg overflow-x-auto text-xs border-2 border-green-500/30">
              <code className="text-green-300">{fixed}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

