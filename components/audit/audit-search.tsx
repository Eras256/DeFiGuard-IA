"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { useAudits } from "@/lib/hooks/useAudits";

export function AuditSearch() {
  const [searchAddress, setSearchAddress] = useState("");
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const { audits, loading, error } = useAudits(searchedAddress || undefined);

  const handleSearch = () => {
    const trimmed = searchAddress.trim();
    if (trimmed && /^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      setSearchedAddress(trimmed);
    } else {
      alert("Please enter a valid contract address (0x...)");
    }
  };

  const handleClear = () => {
    setSearchAddress("");
    setSearchedAddress(null);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search Audits by Contract
        </CardTitle>
        <CardDescription>
          Enter a contract address to view its audit history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="0x..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 font-mono text-sm"
          />
          <Button onClick={handleSearch} disabled={loading || !searchAddress.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
          {searchedAddress && (
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          )}
        </div>

        {searchedAddress && (
          <div className="mt-4 pt-4 border-t border-white/10">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>{error}</p>
              </div>
            ) : audits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No audits found for this contract</p>
                <p className="text-xs mt-2">
                  Address: {formatAddress(searchedAddress)}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {audits.length} Audit{audits.length !== 1 ? "s" : ""} found
                  </h3>
                  <a
                    href={`https://sepolia.basescan.org/address/${searchedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View on Basescan <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                {audits.map((audit, index) => (
                  <div
                    key={index}
                    className="glass p-4 rounded-lg border border-white/10 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-sm">
                        {formatAddress(audit.contractAddress)}
                      </div>
                      <div className={`text-lg font-bold ${
                        Number(audit.riskScore) < 40 ? "text-green-400" :
                        Number(audit.riskScore) < 60 ? "text-yellow-400" :
                        Number(audit.riskScore) < 80 ? "text-orange-400" : "text-red-400"
                      }`}>
                        Risk: {Number(audit.riskScore)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div>
                        {new Date(Number(audit.timestamp) * 1000).toLocaleString("en-US")}
                      </div>
                      {audit.isActive ? (
                        <span className="text-green-400">✓ Active</span>
                      ) : (
                        <span className="text-gray-500">✗ Inactive</span>
                      )}
                    </div>
                    {audit.reportHash && (
                      <div className="mt-2 text-xs text-muted-foreground font-mono">
                        Hash: {audit.reportHash.slice(0, 20)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

