"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, AlertTriangle, Truck, Package, Lock, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";

// Mock Analytical Datasets for NER
const accessibilityTrendData = [
  { day: "Mon", openPercentage: 86, forecast: 86 },
  { day: "Tue", openPercentage: 82, forecast: 82 },
  { day: "Wed", openPercentage: 74, forecast: 74 },
  { day: "Thu", openPercentage: 71, forecast: 71 },
  { day: "Fri", openPercentage: 78, forecast: 78 },
  { day: "Sat (Today)", openPercentage: 78, forecast: 78 },
  { day: "Sun (AI Est)", forecast: 69 },
  { day: "Mon (AI Est)", forecast: 73 },
];

const delayTrendByCorridor = [
  { corridor: "NH-13 (Arunachal)", avgDelayHours: 5.7, riskIndex: 84 },
  { corridor: "NH-15 (Assam North)", avgDelayHours: 2.8, riskIndex: 62 },
  { corridor: "NH-27 (East-West)", avgDelayHours: 0.8, riskIndex: 25 },
  { corridor: "NH-2 (Nagaland/Manipur)", avgDelayHours: 4.2, riskIndex: 68 },
  { corridor: "NH-6 (Meghalaya/Mizoram)", avgDelayHours: 1.5, riskIndex: 38 },
];

const disruptionsByType = [
  { type: "Landslide", count: 9, color: "#ef4444" },
  { type: "Heavy Rain / Slit", count: 6, color: "#f97316" },
  { type: "Embankment Scour", count: 4, color: "#f59e0b" },
  { type: "Bridge Inspection", count: 2, color: "#38bdf8" },
  { type: "Vehicle Stall", count: 2, color: "#94a3b8" },
];

const districtRiskLevels = [
  { district: "West Siang", score: 84 },
  { district: "West Kameng", score: 78 },
  { district: "Cachar", score: 71 },
  { district: "Ukhrul", score: 68 },
  { district: "Dhemaji", score: 62 },
  { district: "Champhai", score: 48 },
  { district: "East Khasi", score: 32 },
  { district: "Kamrup Metro", score: 18 },
];

export function AnalyticsView() {
  const { currentUser, login } = useApp();
  const isAdmin = currentUser.role === "Administrator" || currentUser.role === "Emergency Commander";

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
        <div className="w-full max-w-md p-8 rounded-2xl border border-slate-800 bg-slate-900/90 text-center shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-600/50 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-950/40">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
              ADMINISTRATOR ONLY
            </div>
            <h2 className="text-lg font-black text-white">
              Analytical Intelligence Restricted
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Analytical charts, corridor delay modeling, and multi-district disruption predictions are available exclusively to Administrator accounts.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-left space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Current Profile:</span>
              <span className="text-white font-medium">{currentUser.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current Role:</span>
              <span className="text-sky-400 font-semibold">{currentUser.role}</span>
            </div>
          </div>

          <button
            onClick={() => login("Administrator")}
            className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
          >
            SWITCH TO ADMINISTRATOR PROFILE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              REGIONAL LOGISTICS & DISRUPTION ANALYTICS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical Corroboration of Accessibility Indices, Freight Delays, and Predictive Hazard Trends
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Telemetry Window:</span>
          <span className="font-mono text-sky-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            Last 7 Days + 48h AI Model
          </span>
        </div>
      </div>

      {/* Grid: 4 Analytic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Chart 1: Road Accessibility Trend */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                Road Network Accessibility Trend (%)
              </h3>
              <p className="text-[11px] text-slate-400">
                Historical open corridor ratio & projected rainfall dip
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">Current: 78%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accessibilityTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="openPercentage"
                  name="Observed Accessibility %"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="AI Projected Risk Curve"
                  stroke="#38bdf8"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Average Delivery Delay by Corridor */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                Average Transit Delay by Arterial Corridor (Hours)
              </h3>
              <p className="text-[11px] text-slate-400">
                Corridor bottleneck latency comparison
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">NH-13 Peak: +5.7h</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayTrendByCorridor}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="corridor" stroke="#64748b" fontSize={10} interval={0} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="avgDelayHours" name="Delay (Hours)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Disruptions by Type */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                Active Disruptions by Hazard Classification
              </h3>
              <p className="text-[11px] text-slate-400">
                Primary causes of regional corridor impedance
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-red-400">23 Active Incidents</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disruptionsByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="type" type="category" stroke="#64748b" fontSize={10} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="count" name="Incidents" radius={[0, 4, 4, 0]}>
                  {disruptionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: District Risk Matrix */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                District Vulnerability & Disruption Probability
              </h3>
              <p className="text-[11px] text-slate-400">
                Combined index of precipitation, slope steepness & historical slides
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-red-400">West Siang: 84%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtRiskLevels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="district" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="score" name="Risk Score %" fill="#ef4444" radius={[4, 4, 0, 0]}>
                  {districtRiskLevels.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score > 70 ? "#ef4444" : entry.score > 40 ? "#f97316" : "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
