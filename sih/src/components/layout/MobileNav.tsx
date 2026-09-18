"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Map,
  GitFork,
  AlertTriangle,
  Menu,
  X,
  Truck,
  Package,
  Activity,
  CloudRain,
  FileText,
  ShieldAlert,
  BarChart3,
  Lock,
} from "lucide-react";

export function MobileNav() {
  const {
    activeTab,
    setActiveTab,
    isPrivilegedVerified,
    activeEmergencySession,
    setIsVerificationModalOpen,
    t,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primaryTabs = [
    { id: "overview", label: "Home", icon: LayoutDashboard },
    { id: "map", label: "Map", icon: Map },
    { id: "routes", label: "Routes", icon: GitFork },
    { id: "field-reports", label: "Report", icon: FileText },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
  ];

  const secondaryTabs = [
    { id: "vehicles", label: t.vehicles, icon: Truck },
    { id: "shipments", label: t.shipments, icon: Package },
    { id: "accessibility", label: t.accessibility, icon: Activity },
    { id: "weather", label: t.weather, icon: CloudRain },
    { id: "analytics", label: t.analytics, icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Drawer / Sheet for Extra Options */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <div className="text-sm font-bold text-white">NER Platform Navigation</div>
                <div className="text-xs text-slate-400">All modules & tools</div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Emergency Operations Direct Link */}
            <div className="mb-3">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (!isPrivilegedVerified) {
                    setIsVerificationModalOpen(true);
                  } else {
                    setActiveTab("emergency");
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-bold transition-all ${
                  activeTab === "emergency" || activeEmergencySession
                    ? "bg-red-950 border-red-600 text-red-300"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-red-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <div className="text-left">
                    <div>Emergency Operations</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {isPrivilegedVerified ? "Authorized Active Session" : "Requires Biometric & OTP Verification"}
                    </div>
                  </div>
                </div>
                {!isPrivilegedVerified && <Lock className="w-4 h-4 text-slate-500" />}
              </button>
            </div>

            {/* Grid of Secondary Modules */}
            <div className="grid grid-cols-2 gap-2">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-semibold text-left transition-colors ${
                      isActive
                        ? "bg-sky-950/80 border-sky-600 text-sky-300"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Tab Bar (Mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 border-t border-slate-800 backdrop-blur-md px-2 py-1 flex items-center justify-around">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] rounded-lg transition-colors ${
                isActive ? "text-sky-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] text-slate-400 hover:text-slate-200"
        >
          <Menu className="w-5 h-5 text-slate-400" />
          <span className="text-[10px] tracking-tight mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
}
