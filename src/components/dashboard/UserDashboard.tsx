import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  Mail,
  Key,
  Clock,
  Calendar,
  Settings,
  LogOut,
  Copy,
  Check,
  Activity,
  Trash2,
  Database,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { EmailVerificationCard } from "../auth/EmailVerificationCard";
import { SecuritySettingsModal } from "./SecuritySettingsModal";

interface UserDashboardProps {
  onOpenProjectInfo: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onOpenProjectInfo }) => {
  const { user, isEmailVerified, logout, activityLogs, clearActivityLogs } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  if (!user) return null;

  const copyUid = () => {
    if (user.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  // Compute security score
  const securityScore = isEmailVerified ? 100 : 65;

  // Format dates
  const creationTime = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently";

  const lastSignInTime = user.metadata.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Current Session";

  const providerId = user.providerData?.[0]?.providerId || "password";
  const providerLabel =
    providerId === "google.com"
      ? "Google Federated OAuth"
      : providerId === "password"
      ? "Firebase Email / Password"
      : providerId;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Welcome & Identity Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Bio */}
          <div className="flex items-start sm:items-center space-x-4">
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-slate-700 object-cover shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email
                    ? user.email.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center text-white ${
                  isEmailVerified ? "bg-emerald-500" : "bg-amber-500"
                }`}
                title={isEmailVerified ? "Verified User" : "Verification Pending"}
              >
                {isEmailVerified ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <span className="text-[10px] font-bold">!</span>
                )}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user.displayName || "Authorized User"}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isEmailVerified
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {isEmailVerified ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      Email Verified
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                      Verification Pending
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-mono flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400 inline" />
                <span>{user.email}</span>
              </p>

              <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-400">
                <span>UID:</span>
                <span className="font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-slate-300 select-all truncate max-w-[140px] sm:max-w-[200px]">
                  {user.uid}
                </span>
                <button
                  onClick={copyUid}
                  className="p-1 text-slate-400 hover:text-white transition"
                  title="Copy UID"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center space-x-2 shadow-sm"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Security Settings</span>
            </button>

            <button
              onClick={onOpenProjectInfo}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition flex items-center space-x-2 shadow-sm"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Firebase Details</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition flex items-center space-x-2 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Email Verification Action Card (when unverified) */}
      {!isEmailVerified && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <EmailVerificationCard />
        </div>
      )}

      {/* Main Grid: Security Metrics & Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Security Score & Authentication Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Account Security Posture</h3>
                  <p className="text-xs text-slate-400">CyberCrime AI Identity Defense Metric</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">{securityScore}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden mb-5">
              <div
                className={`h-full transition-all duration-700 rounded-full ${
                  securityScore >= 90
                    ? "bg-gradient-to-r from-cyan-400 to-emerald-400"
                    : "bg-gradient-to-r from-amber-500 to-amber-400"
                }`}
                style={{ width: `${securityScore}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">Email Verification</span>
                </div>
                {isEmailVerified ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Passed (+35)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Pending (+0)
                  </span>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300">Auth Method</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {providerId === "google.com" ? "OAuth 2.0" : "Scrypt Hash"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">Token Session</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  JWT Active (+30)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-300">Project Guard</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  cybercrimeai-cf3f6
                </span>
              </div>
            </div>
          </div>

          {/* Account Details Specs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-base mb-4 flex items-center space-x-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Identity &amp; Session Specifications</span>
            </h3>

            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-400">Primary Email</span>
                <span className="font-mono text-slate-200 font-semibold">{user.email}</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-400">Display Identity</span>
                <span className="text-slate-200 font-medium">{user.displayName || "Not assigned"}</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-400">Authentication Provider</span>
                <span className="text-cyan-300 font-medium">{providerLabel}</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-400">Verification Timestamp</span>
                <span className="text-slate-300 font-mono">
                  {isEmailVerified ? "Verified & Timestamped" : "Not yet verified"}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-400">Account Registration</span>
                <span className="text-slate-300 font-mono flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{creationTime}</span>
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-400">Last Authentication</span>
                <span className="text-slate-300 font-mono flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lastSignInTime}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Security Audit Log */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Security Activity</h3>
              </div>
              {activityLogs.length > 0 && (
                <button
                  onClick={clearActivityLogs}
                  className="text-[11px] text-slate-500 hover:text-rose-400 transition"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Cryptographic and session events tracked during your active session:
            </p>

            {/* Logs List */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {activityLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No activity events recorded yet.
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          log.type === "success"
                            ? "text-emerald-400"
                            : log.type === "security"
                            ? "text-cyan-400"
                            : log.type === "warning"
                            ? "text-amber-400"
                            : "text-slate-300"
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {log.timestamp}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-slate-400 text-[11px] leading-snug break-all">
                        {log.details}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings Modal */}
      <SecuritySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
