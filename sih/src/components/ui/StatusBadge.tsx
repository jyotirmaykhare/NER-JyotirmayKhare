import React from "react";
import { RoadStatus, BridgeCondition, VehicleStatus, IncidentSeverity } from "@/types";

interface StatusBadgeProps {
  status: RoadStatus | BridgeCondition | VehicleStatus | IncidentSeverity | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-semibold",
    lg: "text-sm px-3 py-1.5 font-bold",
  }[size];

  switch (status) {
    // Road Statuses
    case "accessible":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span>ACCESSIBLE</span>
        </span>
      );
    case "partial":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
          <span>PARTIAL</span>
        </span>
      );
    case "high_risk":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-orange-950/80 text-orange-300 border border-orange-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-400" aria-hidden="true" />
          <span>HIGH RISK</span>
        </span>
      );
    case "blocked":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-red-950/90 text-red-300 border border-red-700/70 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          <span>BLOCKED</span>
        </span>
      );
    case "emergency":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-blue-950/90 text-blue-300 border border-blue-600/70 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
          <span>EMERGENCY CORRIDOR</span>
        </span>
      );

    // Vehicle Statuses
    case "moving":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
          <span>MOVING</span>
        </span>
      );
    case "delayed":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
          <span>DELAYED</span>
        </span>
      );
    case "stopped":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-slate-800 text-slate-300 border border-slate-600 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" aria-hidden="true" />
          <span>STOPPED</span>
        </span>
      );

    // Severities
    case "Critical":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-red-950/90 text-red-300 border border-red-700/70 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          <span>CRITICAL</span>
        </span>
      );
    case "High":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-orange-950/80 text-orange-300 border border-orange-700/60 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-400" aria-hidden="true" />
          <span>HIGH</span>
        </span>
      );
    case "Medium":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
          <span>MEDIUM</span>
        </span>
      );
    case "Low":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-blue-950/80 text-blue-300 border border-blue-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
          <span>LOW</span>
        </span>
      );

    // Bridge Conditions
    case "stable":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span>STABLE</span>
        </span>
      );
    case "inspection_required":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
          <span>INSPECTION DUE</span>
        </span>
      );
    case "damaged":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-orange-950/80 text-orange-300 border border-orange-700/60 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-400" aria-hidden="true" />
          <span>DAMAGED</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider ${sizeClasses} ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
}
