import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, X, ShieldQuestion } from "lucide-react";
import { auth } from "../../firebase/config";
import { getFriendlyAuthErrorMessage } from "../../firebase/authErrors";
import { useAuth } from "../../context/AuthContext";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ title: string; message: string; tip?: string } | null>(null);
  const { addActivityLog } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorInfo(null);
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(true);
      addActivityLog("Password Reset Requested", `Reset link dispatched to ${email.trim()}`, "security");
    } catch (err: any) {
      console.error("Password reset error:", err);
      const friendly = getFriendlyAuthErrorMessage(err?.code || err?.message || "");
      setErrorInfo(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldQuestion className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Reset Account Password</h3>
            <p className="text-xs text-slate-400">Receive a secure reset link from Firebase Auth</p>
          </div>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-emerald-200">Password Reset Email Dispatched</p>
                <p>
                  We have sent a secure password recovery link to <span className="font-mono text-white underline">{email}</span>.
                </p>
                <p className="text-emerald-400/80">
                  Please click the link in your email to choose a new password. If you don't see it, check your spam or junk folder.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-sm bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter the email address registered with your CyberCrime AI account. Firebase will send an official cryptographic password reset link.
            </p>

            {errorInfo && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-rose-200">{errorInfo.title}</p>
                  <p>{errorInfo.message}</p>
                  {errorInfo.tip && <p className="text-rose-400/80 italic text-[11px] mt-1">{errorInfo.tip}</p>}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@cybercrime.ai"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-1/2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-1.5"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
