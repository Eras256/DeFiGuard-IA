"use client";

import React from "react";
import { Activity, Bell, Shield, AlertTriangle, CheckCircle, Loader2, ExternalLink, TrendingUp, Database, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMonitoring } from "@/lib/hooks/useMonitoring";
import { formatAddress, formatTimestamp } from "@/lib/utils";
import { CONTRACT_ADDRESSES, SUPPORTED_CHAINS } from "@/lib/constants";

export default function MonitoringPage() {
  const { audits, badges, transactions, alerts, activityFeed, stats, loading } = useMonitoring();

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-500/10";
      case "high":
        return "border-orange-500 bg-orange-500/10";
      case "medium":
        return "border-yellow-500 bg-yellow-500/10";
      default:
        return "border-blue-500 bg-blue-500/10";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "high_risk":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "new_audit":
        return <Shield className="h-4 w-4 text-blue-400" />;
      case "new_badge":
        return <Award className="h-4 w-4 text-purple-400" />;
      default:
        return <Bell className="h-4 w-4 text-orange-400" />;
    }
  };

  const getTransactionType = (tx: any) => {
    if (tx.to.toLowerCase() === CONTRACT_ADDRESSES.AUDIT_REGISTRY.toLowerCase()) {
      return { label: "Audit Recorded", color: "text-blue-400", icon: Shield };
    } else if (tx.to.toLowerCase() === CONTRACT_ADDRESSES.GUARD_NFT.toLowerCase()) {
      return { label: "Badge Minted", color: "text-purple-400", icon: Award };
    }
    return { label: "Transaction", color: "text-gray-400", icon: Activity };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Real-Time Monitoring</span>
        </h1>
        <p className="text-muted-foreground">
          24/7 surveillance of your deployed smart contracts • 100% on-chain data
        </p>

        {/* Live Data Indicator */}
        <div className="mt-4 inline-flex items-center gap-2 glass rounded-full px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-cyber-green animate-pulse"></div>
          <span className="text-sm text-gray-400">
            Live data from Base Sepolia • {stats.totalTransactions} transactions monitored
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Database className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold text-white">{stats.totalAudits}</div>
            </div>
            <div className="text-sm font-medium text-gray-300 mb-1">Total Audits</div>
            <div className="text-xs text-gray-500">Registered on-chain</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-cyber-purple" />
              <div className="text-3xl font-bold text-white">{stats.totalBadges}</div>
            </div>
            <div className="text-sm font-medium text-gray-300 mb-1">NFT Badges</div>
            <div className="text-xs text-gray-500">Badges minted</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div className="text-3xl font-bold text-white">{stats.highRiskAudits}</div>
            </div>
            <div className="text-sm font-medium text-gray-300 mb-1">High Risk</div>
            <div className="text-xs text-gray-500">Risk score ≥ 60</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-cyber-green" />
              <div className="text-3xl font-bold text-white">{stats.certifiedContracts}</div>
            </div>
            <div className="text-sm font-medium text-gray-300 mb-1">Certified</div>
            <div className="text-xs text-gray-500">Risk score &lt; 40</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <Card className="glass col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>
              Real-time transactions and events from contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : activityFeed.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {activityFeed.map((activity) => {
                  const txType = getTransactionType(activity);
                  const TxIcon = txType.icon;
                  const timeAgo = formatTimestamp(activity.timestamp);
                  
                  return (
                    <div
                      key={activity.id}
                      className="glass p-3 rounded-lg flex items-center justify-between hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-2 h-2 rounded-full ${activity.status === "success" ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
                        <TxIcon className={`h-4 w-4 ${txType.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{txType.label}</div>
                          <div className="text-xs text-muted-foreground font-mono truncate">
                            {formatAddress(activity.to)} • Block #{activity.blockNumber}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono truncate mt-1">
                            Hash: {formatAddress(activity.hash)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground">{timeAgo}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            window.open(
                              `${SUPPORTED_CHAINS.baseSepolia.explorer}/tx/${activity.hash}`,
                              "_blank"
                            );
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-400" />
              Security Alerts
            </CardTitle>
            <CardDescription>
              {alerts.length > 0 ? `${alerts.length} active alert${alerts.length !== 1 ? 's' : ''}` : "No alerts"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <p className="text-sm">Everything is working correctly</p>
                <p className="text-xs mt-1">No active alerts</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {alerts.slice(0, 10).map((alert) => (
                  <div
                    key={alert.id}
                    className={`glass p-3 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{alert.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {alert.message}
                        </div>
                        {alert.contractAddress && (
                          <div className="text-xs text-muted-foreground font-mono mt-1">
                            {formatAddress(alert.contractAddress)}
                          </div>
                        )}
                        {alert.riskScore !== undefined && (
                          <Badge
                            variant={alert.riskScore >= 80 ? "critical" : alert.riskScore >= 60 ? "high" : "medium"}
                            className="mt-2"
                          >
                            Risk: {alert.riskScore}
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          {formatTimestamp(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contract Info */}
      <Card className="glass mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Monitored Contracts</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-400 space-y-2">
          <div>
            <strong className="text-gray-300">AuditRegistry:</strong>{" "}
            <a
              href={`${SUPPORTED_CHAINS.baseSepolia.explorer}/address/${CONTRACT_ADDRESSES.AUDIT_REGISTRY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {CONTRACT_ADDRESSES.AUDIT_REGISTRY}
            </a>{" "}
            (Base Sepolia)
          </div>
          <div>
            <strong className="text-gray-300">GuardNFT:</strong>{" "}
            <a
              href={`${SUPPORTED_CHAINS.baseSepolia.explorer}/address/${CONTRACT_ADDRESSES.GUARD_NFT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {CONTRACT_ADDRESSES.GUARD_NFT}
            </a>{" "}
            (Base Sepolia)
          </div>
          <div>
            <strong className="text-gray-300">Network:</strong> Base Sepolia Testnet (Chain ID: 84532)
          </div>
          <div className="pt-2 border-t border-white/10">
            All data is obtained directly from the blockchain using Basescan API. No mock data.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

