import React, { useState } from "react";
import {
  Database,
  ExternalLink,
  X,
  Copy,
  Check,
  ShieldAlert,
  Server,
  Key,
  Globe,
  MailCheck,
} from "lucide-react";
import { firebaseConfig } from "../../firebase/config";

interface FirebaseProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseProjectModal: React.FC<FirebaseProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentDomain = typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Firebase Project Configuration
            </h3>
            <p className="text-xs text-slate-400">
              Connected to project: <span className="font-mono text-cyan-300 font-semibold">{firebaseConfig.projectId}</span>
            </p>
          </div>
        </div>

        {/* Setup Verification Checklist / Advice */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
              <MailCheck className="w-4 h-4" />
              <span>Firebase Authentication &amp; Email Verification Checklist</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Firebase handles cryptographic user management, password hashing (scrypt), session token minting, and SMTP email verification dispatching.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-200 block">Sign-in Providers</span>
                  <span className="text-slate-400">Enable Email/Password and Google in Firebase Console.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <span className="font-semibold text-slate-200 block">Email Templates</span>
                  <span className="text-slate-400">Customize verification &amp; reset sender name &amp; subject in Console.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-200 block">Authorized Domains</span>
                  <span className="text-slate-400 font-mono text-[10px] break-all">{currentDomain || "localhost"}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <div>
                  <span className="font-semibold text-slate-200 block">Email Verification</span>
                  <span className="text-slate-400">Sent instantly on register or requested from profile.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links to Firebase Console */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition"
            >
              <span>Manage Sign-in Methods</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/users`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 hover:border-indigo-500/40 transition"
            >
              <span>View Registered Users</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/emails`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 hover:border-purple-500/40 transition"
            >
              <span>Email Templates</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Configuration Values Inspector */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Active Firebase Config Parameters
            </h4>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 font-mono text-xs">
              {Object.entries(firebaseConfig).map(([key, val]) => (
                <div key={key} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-slate-500">{key}:</span>
                    <span className="text-slate-200 truncate">{String(val)}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(String(val), key)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                    title="Copy value"
                  >
                    {copiedKey === key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
