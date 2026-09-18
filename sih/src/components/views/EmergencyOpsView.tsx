"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import MapContainer from "@/components/map/MapContainer";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ShieldAlert,
  Lock,
  Radio,
  Send,
  AlertTriangle,
  Truck,
  LifeBuoy,
  PhoneCall,
  Flame,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
  Shield,
  Activity,
} from "lucide-react";

export function EmergencyOpsView() {
  const {
    isPrivilegedVerified,
    activeEmergencySession,
    setIsVerificationModalOpen,
    endEmergencySession,
    emergencyResources,
    deployResource,
    emergencyBroadcasts,
    sendBroadcast,
    auditLogs,
    currentUser,
    focusOnLocation,
  } = useApp();

  // Selected sub-tab in Emergency Operations
  const [activeSubTab, setActiveSubTab] = useState<
    "map" | "routes" | "deploy" | "broadcast" | "audit"
  >("map");

  // End Session Confirmation Modal
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Resource Deployment Form State
  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    emergencyResources[0]?.id || ""
  );
  const [targetSector, setTargetSector] = useState("NH-13 West Siang Mudslide Bypass");

  // Broadcast Form State
  const [broadcastTarget, setBroadcastTarget] = useState("All Freight Drivers & Convoy Pilots");
  const [broadcastPriority, setBroadcastPriority] = useState<"CRITICAL" | "HIGH" | "NORMAL">("CRITICAL");
  const [broadcastMessage, setBroadcastMessage] = useState(
    "IMMEDIATE DIVERSION: NH-13 Km 48 impassable due to severe mudslip. Divert all emergency supply trucks to Pangin South Bypass. Speed limit 30 km/h."
  );
  const [broadcastChannels, setBroadcastChannels] = useState<string[]>([
    "Dashboard",
    "Mobile App",
    "Field Units",
    "SMS Integration Ready",
  ]);

  // Emergency Route Planner Selected Scenario
  const [selectedScenario, setSelectedScenario] = useState<
    "Medical Evacuation" | "Essential Supplies" | "Rescue Operation" | "Civilian Evacuation"
  >("Medical Evacuation");

  // IF USER IS NOT PRIVILEGED: SHOW STRICT RESTRICTED SCREEN
  if (!isPrivilegedVerified || !activeEmergencySession) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
        <div className="w-full max-w-lg p-8 rounded-2xl border border-red-900/60 bg-slate-900/90 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border-2 border-red-600 flex items-center justify-center text-red-500 mx-auto shadow-lg shadow-red-950/60">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-1">
              Restricted Access Level 4
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              EMERGENCY OPERATIONS COMMAND
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              &ldquo;Emergency operations are available only to authorized personnel.&rdquo;
              Access to live evacuation routes, NDRF asset dispatch, and regional alert broadcasts requires privileged identity verification.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-left space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Current User:</span>
              <span className="text-white font-medium">{currentUser.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Role:</span>
              <span className="text-sky-400 font-medium">{currentUser.role}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Biometric Status:</span>
              <span className="text-amber-400 font-bold">Unverified</span>
            </div>
          </div>

          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-red-950/60 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>VERIFY IDENTITY & ACTIVATE EMERGENCY SESSION</span>
          </button>
        </div>
      </div>
    );
  }

  // PRIVILEGED EMERGENCY COMMAND CENTER INTERFACE
  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId) return;
    deployResource(selectedResourceId, targetSector);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    sendBroadcast(broadcastTarget, broadcastMessage, broadcastPriority, broadcastChannels);
  };

  const toggleChannel = (channel: string) => {
    setBroadcastChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  // Emergency Resource Counts
  const ambulanceCount = {
    available: emergencyResources.filter((r) => r.type === "Ambulance" && r.status === "Available").length,
    deployed: emergencyResources.filter((r) => r.type === "Ambulance" && r.status === "Deployed").length,
    standby: emergencyResources.filter((r) => r.type === "Ambulance" && r.status === "Standby").length,
  };

  const rescueTeamCount = {
    available: emergencyResources.filter((r) => r.type === "Rescue Team" && r.status === "Available").length,
    deployed: emergencyResources.filter((r) => r.type === "Rescue Team" && r.status === "Deployed").length,
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-4">
      {/* High-Priority Emergency Active Header */}
      <div className="p-4 rounded-xl border border-red-600 bg-red-950/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                🚨 EMERGENCY OPERATIONS ACTIVE
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/80 text-red-200 border border-red-500 font-bold uppercase">
                DEFCON-2 DISASTER STATUS
              </span>
            </div>
            <div className="text-xs text-red-300 font-semibold mt-0.5">
              Assam & Arunachal Multi-Hazard Response • Incident Commander: {currentUser.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-nav switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveSubTab("map")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                activeSubTab === "map" ? "bg-red-600 text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              GIS Map
            </button>
            <button
              onClick={() => setActiveSubTab("routes")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                activeSubTab === "routes" ? "bg-red-600 text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              Evac Routes
            </button>
            <button
              onClick={() => setActiveSubTab("deploy")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                activeSubTab === "deploy" ? "bg-red-600 text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              Deploy Assets
            </button>
            <button
              onClick={() => setActiveSubTab("broadcast")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                activeSubTab === "broadcast" ? "bg-red-600 text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              Broadcast
            </button>
            <button
              onClick={() => setActiveSubTab("audit")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                activeSubTab === "audit" ? "bg-red-600 text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              Audit Log
            </button>
          </div>

          <button
            onClick={() => setShowEndConfirm(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-red-400 border border-red-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">END SESSION</span>
          </button>
        </div>
      </div>

      {/* Compact Emergency Metrics Bar (from prompt specification:
          Affected Districts, Blocked Roads, At-Risk Vehicles, Critical Incidents, Emergency Supplies, Available Resources) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatCard
          label="Affected Districts"
          value="7"
          subValue="Assam & Arun"
          trend="danger"
          trendText="West Siang Focus"
          icon={<Flame className="w-4 h-4 text-red-400" />}
        />
        <StatCard
          label="Blocked Roads"
          value="14"
          subValue="Corridors"
          trend="danger"
          trendText="NH-13 Mudslide"
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
        />
        <StatCard
          label="At-Risk Vehicles"
          value="18"
          subValue="In Sector"
          trend="danger"
          trendText="Rerouting Active"
          icon={<Truck className="w-4 h-4 text-amber-400" />}
        />
        <StatCard
          label="Critical Incidents"
          value="6"
          subValue="Active Ops"
          trend="danger"
          trendText="4 Landslides, 2 Scours"
          icon={<ShieldAlert className="w-4 h-4 text-orange-400" />}
        />
        <StatCard
          label="Emergency Supplies"
          value="92%"
          subValue="Readiness"
          trend="safe"
          trendText="Rations & IV fluids"
          icon={<LifeBuoy className="w-4 h-4 text-emerald-400" />}
        />
        <StatCard
          label="Available Resources"
          value="42"
          subValue="Units Ready"
          trend="safe"
          trendText="NDRF / BRO / Boats"
          icon={<Shield className="w-4 h-4 text-sky-400" />}
        />
      </div>

      {/* TAB 1: LARGE EMERGENCY GIS MAP */}
      {activeSubTab === "map" && (
        <div className="space-y-3 flex-1 flex flex-col">
          <div className="flex items-center justify-between text-xs">
            <div className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Full Tactical Emergency GIS Matrix</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Showing Blocked roads (Red dashed), Emergency Green Corridors, Evacuation routes, NDRF units & Hospitals
            </div>
          </div>

          <div className="flex-1 min-h-[500px] w-full">
            <MapContainer height="h-[520px]" isEmergencyMode={true} />
          </div>
        </div>
      )}

      {/* TAB 2: EMERGENCY ROUTE PLANNER */}
      {activeSubTab === "routes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
              <h2 className="text-xs font-black uppercase text-sky-400 tracking-wider">
                Select Mission Scenario
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    "Medical Evacuation",
                    "Essential Supplies",
                    "Rescue Operation",
                    "Civilian Evacuation",
                  ] as const
                ).map((scen) => (
                  <button
                    key={scen}
                    onClick={() => setSelectedScenario(scen)}
                    className={`p-2.5 rounded-lg border font-bold text-left transition-all ${
                      selectedScenario === scen
                        ? "bg-red-950 border-red-600 text-red-300 shadow-md"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {scen}
                  </button>
                ))}
              </div>

              {/* Operational recommendation display */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="p-3.5 rounded-lg border border-emerald-700/60 bg-emerald-950/30 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                      PRIMARY EMERGENCY ROUTE
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-900 text-emerald-300">
                      OPTIMAL
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">ETA</span>
                      <strong className="text-white text-xs">1h 42m</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Risk</span>
                      <strong className="text-emerald-400 text-xs">21%</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Accessibility</span>
                      <strong className="text-emerald-400 text-xs">94%</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800/80">
                    <strong className="text-emerald-400 font-semibold">Operational basis: </strong>
                    &ldquo;Safest currently accessible route. Utilizes reinforced military culvert and avoids low-lying river scouring zone.&rdquo;
                  </div>

                  <button
                    onClick={() => focusOnLocation(27.35, 92.24, 9, "Primary Emergency Route")}
                    className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Plot Primary Route On Map
                  </button>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 uppercase text-[11px]">
                      SECONDARY ALTERNATIVE ROUTE
                    </span>
                    <span className="text-slate-500 text-[10px]">Backup Only</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                    <span>ETA: <strong className="text-amber-300">2h 15m</strong></span>
                    <span>Risk: <strong className="text-orange-400">37%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col min-h-[440px]">
            <MapContainer height="h-[460px]" isEmergencyMode={true} />
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY RESOURCE DEPLOYMENT */}
      {activeSubTab === "deploy" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 space-y-4">
            {/* Resource Counts Summary (from prompt: Available, Deployed, Standby) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">AMBULANCES</span>
                  <span className="text-[10px] text-sky-400">Medical Fleet</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono mt-2">
                  <span className="text-emerald-400 font-bold">Avail: {ambulanceCount.available}</span>
                  <span className="text-amber-400 font-bold">Deploy: {ambulanceCount.deployed}</span>
                  <span className="text-slate-400">Standby: {ambulanceCount.standby}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">RESCUE SQUADS</span>
                  <span className="text-[10px] text-red-400">NDRF / SDRF</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono mt-2">
                  <span className="text-emerald-400 font-bold">Avail: {rescueTeamCount.available}</span>
                  <span className="text-amber-400 font-bold">Deploy: {rescueTeamCount.deployed}</span>
                </div>
              </div>
            </div>

            {/* Deployment Action Form (SELECT RESOURCE -> ASSIGN -> DEPLOY) */}
            <form onSubmit={handleDeploy} className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3 text-xs">
              <h2 className="text-xs font-black uppercase text-white tracking-wider">
                Deploy Emergency Resource
              </h2>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 text-[11px]">
                  [ 1. SELECT RESOURCE ]
                </label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-sky-500"
                >
                  {emergencyResources.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.unitName} ({res.type}) — {res.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 text-[11px]">
                  [ 2. ASSIGN TARGET SECTOR / INCIDENT ]
                </label>
                <input
                  type="text"
                  required
                  value={targetSector}
                  onChange={(e) => setTargetSector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  placeholder="e.g. NH-13 West Siang Mudslide Bypass"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
              >
                [ 3. DEPLOY RESOURCE ]
              </button>
            </form>
          </div>

          {/* Active Resources Table */}
          <div className="lg:col-span-7 space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Field Asset Roster ({emergencyResources.length})
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Base Location</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {emergencyResources.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-semibold text-white">{res.unitName}</td>
                      <td className="p-2.5 text-sky-400">{res.type}</td>
                      <td className="p-2.5 text-slate-400">{res.location}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            res.status === "Deployed"
                              ? "bg-amber-950 text-amber-300 border border-amber-700"
                              : "bg-emerald-950 text-emerald-300 border border-emerald-700"
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EMERGENCY BROADCAST */}
      {activeSubTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <form
            onSubmit={handleSendBroadcast}
            className="lg:col-span-6 p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <span>EMERGENCY DISASTER BROADCAST SYSTEM</span>
              </h2>
              <span className="text-[10px] text-slate-400">Protocol CAP-IN v1.2</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                Target Audience Group
              </label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-sky-500"
              >
                <option value="All Freight Drivers & Convoy Pilots">All Freight Drivers & Convoy Pilots</option>
                <option value="District Disaster Management Officers (DDMO)">District Disaster Officers (DDMO)</option>
                <option value="NDRF & SDRF First Responder Units">NDRF & SDRF First Responder Units</option>
                <option value="Commercial Multi-Axle Fleet Operators">Commercial Multi-Axle Fleet Operators</option>
                <option value="General Public Across Affected Zone">General Public Across Affected Zone</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["CRITICAL", "HIGH", "NORMAL"] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setBroadcastPriority(p)}
                    className={`py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wider cursor-pointer ${
                      broadcastPriority === p
                        ? p === "CRITICAL"
                          ? "bg-red-600 text-white border-red-500"
                          : p === "HIGH"
                          ? "bg-amber-600 text-white border-amber-500"
                          : "bg-sky-600 text-white border-sky-500"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                Broadcast Message
              </label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                Dissemination Channels
              </label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {["Dashboard", "Mobile App", "Field Units", "SMS Integration Ready"].map((ch) => (
                  <label
                    key={ch}
                    className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={broadcastChannels.includes(ch)}
                      onChange={() => toggleChannel(ch)}
                      className="accent-sky-500"
                    />
                    <span>{ch}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
            >
              SEND EMERGENCY BROADCAST
            </button>
          </form>

          {/* Broadcast Dispatch History */}
          <div className="lg:col-span-6 space-y-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Dispatched Broadcast Log
            </h2>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {emergencyBroadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 font-semibold">{bc.timestamp}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bc.priority === "CRITICAL"
                          ? "bg-red-950 text-red-300 border border-red-700"
                          : "bg-amber-950 text-amber-300 border border-amber-700"
                      }`}
                    >
                      {bc.priority}
                    </span>
                  </div>

                  <p className="text-white font-medium bg-slate-950 p-2.5 rounded border border-slate-800/80">
                    &ldquo;{bc.message}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Target: <strong className="text-slate-200">{bc.targetGroup}</strong></span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ✓ Delivered: {bc.deliveredCount} / {bc.recipientsCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeSubTab === "audit" && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Operational Security Audit Log
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Officer</th>
                  <th className="p-3">Action Executed</th>
                  <th className="p-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-sans font-semibold text-white">{log.officer}</td>
                    <td className="p-3 font-sans text-slate-200">{log.action}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* End Emergency Session Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <div>
              <h3 className="text-base font-black text-white">End Emergency Session?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to end the emergency session and return to standard monitoring mode?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowEndConfirm(false);
                  endEmergencySession();
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                END SESSION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
