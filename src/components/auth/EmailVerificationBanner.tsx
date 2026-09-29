import React, { useState, useEffect } from "react";
import { Mail, RefreshCw, Send, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const EmailVerificationBanner: React.FC = () => {
  const { user, isEmailVerified, reloadUser, sendVerification, addActivityLog } = useAuth();
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

  if (!user || isEmailVerified) {
    return null;
  }

  const handleCheckStatus = async () => {
    setChecking(true);
    setFeedback(null);
    try {
      const verified = await reloadUser();
      if (verified) {
        setFeedback({
          type: "success",
          message: "Email verified successfully! All security restrictions lifted.",
        });
      } else {
        setFeedback({
          type: "warning",
          message: "Verification link not clicked yet. Please click the link in your email inbox, then check again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "warning",
        message: "Failed to query verification status. Please retry shortly.",
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
        message: `Fresh verification email dispatched to ${user.email}. Check your inbox!`,
      });
    } catch (err: any) {
      console.error("Resend verification error:", err);
      setFeedback({
        type: "warning",
        message: err.message?.includes("too-many-requests")
          ? "Please wait a moment before requesting another email."
          : "Failed to dispatch verification email. Try again shortly.",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-slate-900 border-b border-amber-500/40 text-amber-200 px-4 py-3 sm:px-6 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left message */}
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-amber-100">
                Action Required: Verify Email Address
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono">
                Unverified
              </span>
            </div>
            <p className="text-xs text-amber-300/80 mt-0.5">
              A verification email has been dispatched to{" "}
              <span className="font-mono font-medium text-amber-100">{user.email}</span>. Click the link inside to verify.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Check Reload */}
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
            <span>{checking ? "Checking..." : "I've Clicked It (Verify Now)"}</span>
          </button>

          {/* Resend */}
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 disabled:opacity-50 transition flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending..." : "Resend Link"}
            </span>
          </button>
        </div>
      </div>

      {/* Dynamic Feedback toast */}
      {feedback && (
        <div
          className={`max-w-7xl mx-auto mt-2 p-2.5 rounded-lg text-xs flex items-center space-x-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40"
              : "bg-amber-500/20 text-amber-200 border border-amber-500/40"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
};
