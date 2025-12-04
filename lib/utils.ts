import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/50";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/50";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "low":
      return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/50";
  }
}

export function getRiskScoreColor(score: number): string {
  if (score >= 80) return "text-red-400";
  if (score >= 60) return "text-orange-400";
  if (score >= 40) return "text-yellow-400";
  return "text-green-400";
}

export function formatTimestamp(timestamp: number | bigint): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  // If timestamp is in seconds (blockchain), convert to milliseconds
  const date = ts < 10000000000 ? new Date(ts * 1000) : new Date(ts);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

