"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldAlert,
  KeyRound,
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
  ScanFace,
  ChevronRight,
  ShieldCheck,
  RotateCw,
} from "lucide-react";

export function IdentityVerificationModal() {
  const {
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    activatePrivilegedSession,
    setActiveTab,
    currentUser,
  } = useApp();

  // Multi-step flow: 'otp' | 'face' | 'success'
  const [step, setStep] = useState<"otp" | "face" | "success">("otp");
  const [otpValue, setOtpValue] = useState(["1", "2", "3", "4", "5", "6"]);
  const [otpError, setOtpError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  if (!isVerificationModalOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otpValue];
    newOtp[index] = val;
    setOtpValue(newOtp);

    // Auto-focus next field
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValue.join("");
    if (entered.length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }

    // Accepts 123456 or any 6-digit code for smooth SIH demo
    setOtpError("");
    setStep("face");
  };

  const handleStartFaceScan = () => {
    setIsScanning(true);
    setScanProgress(15);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setStep("success");
          activatePrivilegedSession();
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  const handleGoToEmergency = () => {
    setIsVerificationModalOpen(false);
    setActiveTab("emergency");
    setStep("otp");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsVerificationModalOpen(false);
            setStep("otp");
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800 text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> High-Privilege Protocol
          </div>
          <h3 className="text-lg font-black tracking-tight text-white">
            PRIVILEGED IDENTITY VERIFICATION
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Officer: <span className="text-white font-semibold">{currentUser.name}</span>
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between px-6 mb-6">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "otp"
                  ? "bg-sky-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              1
            </span>
            <span className="text-[11px] font-semibold text-slate-300">OTP Code</span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-800" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "face"
                  ? "bg-sky-600 text-white"
                  : step === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              2
            </span>
            <span className="text-[11px] font-semibold text-slate-300">Biometrics</span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-800" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "success" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-500"
              }`}
            >
              ✓
            </span>
            <span className="text-[11px] font-semibold text-slate-300">Active</span>
          </div>
        </div>

        {/* STEP 1: OTP SCREEN */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
              <KeyRound className="w-6 h-6 text-sky-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-200">
                Enter 6-digit Secure Authentication Code
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Issued to your registered NIC / Gov Disaster Comms device.
              </p>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2 my-4">
              {otpValue.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-mono font-bold text-white bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              ))}
            </div>

            {otpError && (
              <div className="text-xs text-red-400 text-center font-medium">
                {otpError}
              </div>
            )}

            {/* Discreet Demo Hint */}
            <div className="p-2 rounded bg-slate-900/50 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">
                💡 Demo OTP Hint: <span className="font-mono text-sky-400 font-bold">123456</span>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-900/30"
            >
              <span>Verify & Proceed to Biometrics</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: SIMULATED FACE VERIFICATION SCREEN */}
        {step === "face" && (
          <div className="space-y-4 text-center">
            <div className="text-xs font-semibold text-slate-300 mb-1">
              IDENTITY VERIFICATION
            </div>
            <p className="text-[11px] text-slate-400">
              Position your face inside the optical recognition frame.
            </p>

            {/* Camera Viewfinder Mock UI */}
            <div className="relative w-64 h-64 mx-auto rounded-2xl bg-slate-900 border-2 border-dashed border-sky-500/60 overflow-hidden flex flex-col items-center justify-center shadow-inner">
              {/* Corner Reticles */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-sky-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-sky-400" />

              {/* Laser Scanline */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] scan-laser z-10" />
              )}

              {/* Center Silhouette */}
              <div className="relative flex flex-col items-center justify-center text-slate-600">
                <ScanFace className={`w-28 h-28 ${isScanning ? "text-sky-400" : "text-slate-500"}`} />
                {isScanning ? (
                  <div className="mt-2 text-xs font-mono font-bold text-sky-300">
                    MATCHING FEATURES... {scanProgress}%
                  </div>
                ) : (
                  <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    [ OPTICAL CAMERA ACTIVE ]
                  </div>
                )}
              </div>
            </div>

            {/* Clear Simulation Notice */}
            <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40 text-[10px] text-amber-300/90 text-left">
              ⚠️ <strong>Notice:</strong> This is a simulated frontend demonstration only. No real biometric data is captured, analyzed, or stored.
            </div>

            {/* Verify Action Button */}
            <button
              onClick={handleStartFaceScan}
              disabled={isScanning}
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-900/40 disabled:opacity-60"
            >
              {isScanning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Biometric Vector...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>VERIFY IDENTITY</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === "success" && (
          <div className="text-center space-y-4 py-3">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-900/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-base font-black text-white">
                ✓ Identity Verified
              </h4>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                Privileged session activated successfully.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Authorized Officer:</span>
                <span className="text-white font-medium">{currentUser.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Privilege Level:</span>
                <span className="text-red-400 font-bold">EMERGENCY COMMANDER</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Security Token:</span>
                <span className="text-sky-400 font-mono">NER-DISASTER-OPS-8849</span>
              </div>
            </div>

            <button
              onClick={handleGoToEmergency}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-red-950/50"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>LAUNCH EMERGENCY COMMAND CENTER</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
