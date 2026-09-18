import React from "react";

interface RiskIndicatorProps {
  score: number; // 0 - 100
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function RiskIndicator({ score, size = "md", showLabel = true }: RiskIndicatorProps) {
  let color = "bg-emerald-500 text-emerald-400";
  let label = "LOW";
  let border = "border-emerald-500/30";

  if (score >= 75) {
    color = "bg-red-500 text-red-400";
    label = "CRITICAL";
    border = "border-red-500/40";
  } else if (score >= 50) {
    color = "bg-orange-500 text-orange-400";
    label = "HIGH";
    border = "border-orange-500/30";
  } else if (score >= 30) {
    color = "bg-amber-500 text-amber-400";
    label = "MODERATE";
    border = "border-amber-500/30";
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Disruption Probability:</span>
          <span className={`font-bold ${color.split(" ")[1]} flex items-center gap-1.5`}>
            <span>{score}%</span>
            <span className={`px-1.5 py-0.2 text-[10px] rounded border ${border} font-bold tracking-wider`}>
              {label}
            </span>
          </span>
        </div>
      )}
      <div className={`w-full rounded-full bg-slate-800 overflow-hidden ${size === "sm" ? "h-1.5" : "h-2"}`}>
        <div
          className={`h-full transition-all duration-500 ${color.split(" ")[0]}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}
