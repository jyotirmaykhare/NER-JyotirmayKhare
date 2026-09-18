"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  User,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Building,
  Mail,
  LogOut,
  RotateCw,
} from "lucide-react";

export function ProfileView() {
  const {
    currentUser,
    isPrivilegedVerified,
    activeEmergencySession,
    setIsVerificationModalOpen,
    setIsLoginModalOpen,
    logout,
  } = useApp();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-6 overflow-y-auto space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-400" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              OFFICER PROFILE & SECURITY CREDENTIALS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Personnel Directory, Multimodal Clearance & Privileged Verification
          </p>
        </div>

        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold"
        >
          Switch Demo Profile
        </button>
      </div>

      {/* Main Profile Identity Card */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-6">
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-950 border border-sky-600/50 flex items-center justify-center text-xl font-black text-white shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">{currentUser.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.organization}</span>
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.email}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
              Account Status
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700 text-xs font-bold uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ACTIVE OFFICIAL</span>
            </div>
          </div>
        </div>

        {/* Security & Privileged Access Status (from prompt specification) */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                SECURITY PRIVILEGE MATRIX
              </span>
            </div>
            {isPrivilegedVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-bold uppercase">
                <Shield className="w-3 h-3" /> VERIFIED PRIVILEGED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold uppercase">
                <Lock className="w-3 h-3" /> LOCKED / RESTRICTED
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                ROLE ASSIGNMENT
              </span>
              <div className="font-bold text-white">{currentUser.role}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                IDENTITY STATUS
              </span>
              <div
                className={`font-bold ${
                  isPrivilegedVerified ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {isPrivilegedVerified ? "Biometrically Confirmed" : "Verification Required"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                PRIVILEGED EMERGENCY OPS
              </span>
              <div
                className={`font-bold ${
                  isPrivilegedVerified ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isPrivilegedVerified ? "Unlocked & Active" : "Locked"}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {!isPrivilegedVerified ? (
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-950/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>[ VERIFY IDENTITY FOR EMERGENCY PRIVILEGES ]</span>
              </button>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Your identity is verified. Full emergency control center access is unlocked.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System & Compliance Disclaimers */}
        <div className="text-[11px] text-slate-500 space-y-1">
          <div>
            <strong>Access Compliance:</strong> Sessions are monitored and logged to the central emergency audit register.
          </div>
          <div>
            <strong>Technical Note:</strong> In this frontend prototype, biometric and OTP flows are simulated client-side for SIH demonstration.
          </div>
        </div>
      </div>
    </div>
  );
}
