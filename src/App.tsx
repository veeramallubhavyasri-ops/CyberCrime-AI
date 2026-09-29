import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Header } from "./components/common/Header";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { EmailVerificationBanner } from "./components/auth/EmailVerificationBanner";
import { UserDashboard } from "./components/dashboard/UserDashboard";
import { FirebaseProjectModal } from "./components/dashboard/FirebaseProjectModal";
import {
  ShieldCheck,
  MailCheck,
  Lock,
  Zap,
  CheckCircle,
  Database,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { firebaseConfig } from "./firebase/config";

const MainContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-200">Initializing CyberCrime AI Auth...</p>
          <p className="text-xs text-slate-500 font-mono">Connecting to Firebase {firebaseConfig.projectId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <Header onOpenProjectInfo={() => setIsProjectInfoOpen(true)} />

      {/* Email Verification Banner when authenticated but unverified */}
      {user && <EmailVerificationBanner />}

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {user ? (
          /* Authenticated Dashboard View */
          <UserDashboard onOpenProjectInfo={() => setIsProjectInfoOpen(true)} />
        ) : (
          /* Guest Auth Portal View */
          <div className="space-y-12">
            {/* Hero Branding */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Zero-Trust Firebase Authentication &amp; Email Verification</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Secure User Management for{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  CyberCrime AI
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Production-grade identity gateway powered by Firebase Auth. Register with instant automated email verification, password strength auditing, and session protection.
              </p>
            </div>

            {/* Auth Form Container with Switcher */}
            <div className="max-w-md mx-auto">
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl mb-6 shadow-inner">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center space-x-2 ${
                    authMode === "login"
                      ? "bg-slate-800 text-white shadow-md border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center space-x-2 ${
                    authMode === "register"
                      ? "bg-slate-800 text-white shadow-md border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <MailCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Register &amp; Verify</span>
                </button>
              </div>

              {/* Form Render */}
              {authMode === "login" ? (
                <LoginForm
                  onSwitchToRegister={() => setAuthMode("register")}
                  onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() => setAuthMode("login")}
                  onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
                />
              )}
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto pt-6 border-t border-slate-900">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <MailCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white text-sm">Automated Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cryptographic verification links dispatched immediately on registration to confirm genuine email ownership.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white text-sm">Password Hardening</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Multi-tier password evaluation and real-time strength auditing ensuring compliance with zero-trust policies.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white text-sm">Live Firebase Session</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connected to project <span className="font-mono text-cyan-300">cybercrimeai-cf3f6</span> with real-time reload status checking.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CyberCrime AI Security Systems. Protected by Firebase Authentication.</p>
          <button
            onClick={() => setIsProjectInfoOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 transition flex items-center space-x-1"
          >
            <span>Firebase Config (cybercrimeai-cf3f6)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </footer>

      {/* Firebase Project Info Modal */}
      <FirebaseProjectModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
