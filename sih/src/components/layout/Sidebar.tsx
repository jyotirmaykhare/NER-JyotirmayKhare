"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Map,
  GitFork,
  Truck,
  Package,
  Activity,
  AlertTriangle,
  CloudRain,
  FileText,
  ShieldAlert,
  BarChart3,
  User,
  Lock,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    isPrivilegedVerified,
    activeEmergencySession,
    setIsVerificationModalOpen,
    currentUser,
    setIsGoogleMapsOpen,
    t,
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = currentUser.role === "Administrator" || currentUser.role === "Emergency Commander";

  const navItems = [
    { id: "overview", label: t.overview, icon: LayoutDashboard },
    { id: "map", label: t.liveMap, icon: Map },
    { id: "routes", label: t.routes, icon: GitFork },
    { id: "vehicles", label: t.vehicles, icon: Truck },
    { id: "shipments", label: t.shipments, icon: Package },
    { id: "accessibility", label: t.accessibility, icon: Activity },
    { id: "alerts", label: t.alerts, icon: AlertTriangle },
    { id: "weather", label: t.weather, icon: CloudRain },
    { id: "field-reports", label: t.fieldReports, icon: FileText },
  ];

  const bottomNavItems = [
    { id: "analytics", label: t.analytics, icon: BarChart3, adminOnly: true },
    { id: "profile", label: t.profile, icon: User },
  ];

  const handleEmergencyClick = () => {
    if (!isPrivilegedVerified) {
      setIsVerificationModalOpen(true);
    } else {
      setActiveTab("emergency");
    }
  };

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-200 z-20 shrink-0 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>NER LOGISTICS</span>
            </h1>
            <p className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
              INTELLIGENCE
            </p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-sky-950/80 text-sky-300 border border-sky-600/50 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-sky-400" : "text-slate-500"
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* Divider */}
        <div className="py-2">
          <div className="border-t border-slate-800/80" />
        </div>

        {/* Emergency Operations (Locked/Restricted) */}
        <div>
          <button
            onClick={handleEmergencyClick}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === "emergency"
                ? "bg-red-950 text-red-300 border border-red-600 shadow-md"
                : activeEmergencySession
                ? "bg-red-950/40 text-red-400 hover:bg-red-950/70 border border-red-900/50"
                : "text-slate-400 hover:text-red-400 hover:bg-slate-900/60"
            }`}
            title={isCollapsed ? "Emergency Operations" : undefined}
          >
            <div className="flex items-center gap-3 truncate">
              <ShieldAlert
                className={`w-4 h-4 shrink-0 ${
                  activeTab === "emergency" || activeEmergencySession
                    ? "text-red-400 animate-pulse"
                    : "text-slate-500"
                }`}
              />
              {!isCollapsed && (
                <span className="truncate tracking-wide">
                  {t.emergencyOps}
                </span>
              )}
            </div>

            {!isCollapsed && (
              <span className="shrink-0 ml-1">
                {isPrivilegedVerified ? (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    OPEN
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                )}
              </span>
            )}
          </button>
        </div>

        {/* Google Maps Amenities Quick Trigger */}
        <div>
          <button
            onClick={() => setIsGoogleMapsOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-900/40 transition-colors"
            title={isCollapsed ? "Google Maps Places" : undefined}
          >
            <MapPin className="w-4 h-4 shrink-0 text-emerald-400" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="truncate">Google Maps Places</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
                  API
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="py-2">
          <div className="border-t border-slate-800/80" />
        </div>

        {/* Secondary Navigation (Analytics & Profile) */}
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAnalyticsRestricted = item.id === "analytics" && !isAdmin;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-sky-950/80 text-sky-300 border border-sky-600/50 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-sky-400" : "text-slate-500"
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && isAnalyticsRestricted && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> ADMIN
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-400 bg-slate-950">
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold mb-1">
            <span>NER REGION</span>
            <span className="text-emerald-400">8 STATES</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Assam • Arunachal • Meghalaya • Manipur
          </div>
        </div>
      )}
    </aside>
  );
}
