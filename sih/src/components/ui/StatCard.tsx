import React, { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral" | "danger" | "safe";
  trendText?: string;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

export function StatCard({
  label,
  value,
  subValue,
  icon,
  trend,
  trendText,
  onClick,
  className = "",
  active = false,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-between p-3.5 rounded-lg border transition-all ${
        onClick ? "cursor-pointer hover:border-slate-500 hover:bg-slate-900/60" : ""
      } ${
        active
          ? "border-sky-500 bg-sky-950/20 shadow-sm"
          : "border-slate-800 bg-slate-950/60 text-slate-100"
      } ${className}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-white">{value}</span>
          {subValue && (
            <span className="text-xs font-medium text-slate-400 truncate">{subValue}</span>
          )}
        </div>
        {trendText && (
          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                trend === "danger"
                  ? "bg-red-400"
                  : trend === "safe"
                  ? "bg-emerald-400"
                  : "bg-amber-400"
              }`}
            />
            <span
              className={
                trend === "danger"
                  ? "text-red-400"
                  : trend === "safe"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }
            >
              {trendText}
            </span>
          </div>
        )}
      </div>
      {icon && (
        <div className="ml-3 p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-400 shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}
