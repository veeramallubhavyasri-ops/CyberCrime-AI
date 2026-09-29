import React, { useState, useEffect } from "react";
import {
  Mail,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Inbox,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const EmailVerificationCard: React.FC = () => {
  const { user, isEmailVerified, reloadUser, sendVerification } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "warning"; message: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!user) return null;

  const handleCheckStatus = async () => {
    setChecking(true);
    setFeedback(null);
    try {
      const verified = await reloadUser();
      if (verified) {
        setFeedback({
          type: "success",
          message: "Congratulations! Your email is verified. Your account is now fully authorized.",
        });
      } else {
        setFeedback({
          type: "warning",
          message: "Email is not marked verified yet. Please open the link in your inbox and try again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "warning",
        message: "Could not query verification status. Please check your internet connection.",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setFeedback(null);
    try {
      await sendVerification();
      setCooldown(60);
      setFeedback({
        type: "success",
        message: `Fresh verification email has been dispatched to ${user.email}.`,
      });
    } catch (err: any) {
      console.error("Resend error:", err);
      setFeedback({
        type: "warning",
        message: err.message?.includes("too-many-requests")
          ? "Rate limit reached. Please wait a minute before requesting another email."
          : "Failed to dispatch verification email. Try again in a moment.",
      });
    } finally {
      setResending(false);
    }
  };

  if (isEmailVerified) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 text-emerald-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Account Identity Verified</h4>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Email <span className="font-mono text-emerald-200 font-semibold">{user.email}</span> has been authenticated and cryptographically verified by Firebase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start space-x-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white">Email Verification Required</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Pending
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            To secure the CyberCrime AI infrastructure, please confirm you own{" "}
            <span className="font-mono text-cyan-300 font-semibold">{user.email}</span>.
          </p>
        </div>
      </div>

      {/* Checklist Guide */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-5 space-y-3">
        <div className="text-xs font-semibold text-slate-200 flex items-center space-x-2">
          <Inbox className="w-4 h-4 text-cyan-400" />
          <span>Verification Instructions</span>
        </div>

        <ol className="text-xs text-slate-400 space-y-2.5 pl-5 list-decimal marker:text-cyan-400 marker:font-bold">
          <li>
            Open your email client and look for a message from{" "}
            <span className="font-mono text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              noreply@cybercrimeai-cf3f6.firebaseapp.com
            </span>
          </li>
          <li>
            If you don't see it in your Inbox, please check your{" "}
            <span className="text-amber-300 font-medium">Spam, Junk, or Promotions folder</span>.
          </li>
          <li>
            Click the secure link inside the email titled{" "}
            <span className="italic text-slate-300">"Verify your email for cybercrimeai-cf3f6"</span>.
          </li>
          <li>
            After clicking the link in your email, return to this tab and click the button below to confirm.
          </li>
        </ol>
      </div>

      {/* Status feedback message */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-start space-x-2.5 mb-5 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30"
              : "bg-amber-500/10 text-amber-200 border border-amber-500/30"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{feedback.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Check Status */}
        <button
          onClick={handleCheckStatus}
          disabled={checking}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white disabled:opacity-50 transition shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
          <span>{checking ? "Checking Firebase..." : "Check Verification Status"}</span>
        </button>

        {/* Resend Verification */}
        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-50 transition flex items-center justify-center space-x-2"
        >
          {cooldown > 0 ? (
            <>
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Resend in {cooldown}s</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-cyan-400" />
              <span>{resending ? "Sending Link..." : "Resend Verification Link"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
