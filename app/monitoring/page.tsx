"use client";

import React from "react";
import { Activity, Bell, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MonitoringPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">Real-Time Monitoring</span>
        </h1>
        <p className="text-muted-foreground">
          24/7 surveillance of your deployed smart contracts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Real-time transactions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="glass p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <div>
                      <div className="text-sm">Normal transaction detected</div>
                      <div className="text-xs text-muted-foreground">Contract 0x1234...5678</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">2m ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-400" />
              Alerts
            </CardTitle>
            <CardDescription>Security notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="glass p-3 rounded-lg border-l-4 border-orange-400">
                <div className="text-sm font-semibold">Unusual Activity</div>
                <div className="text-xs text-muted-foreground mt-1">
                  High frequency calls detected on 0xabcd...ef01
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

