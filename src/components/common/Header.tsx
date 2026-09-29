import React from "react";
import { Shield, ShieldAlert, ShieldCheck, Database, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onOpenProjectInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProjectInfo }) => {
  const { user, isEmailVerified, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-500 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">
                CyberCrime <span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Auth Guard
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Firebase Secure Identity &amp; Verification
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Project Info Button */}
          <button
            onClick={onOpenProjectInfo}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition"
            title="View Firebase Project Configuration"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Project:</span>
            <span className="font-mono text-cyan-300">cybercrimeai-cf3f6</span>
          </button>

          {/* User state */}
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-slate-800">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-medium text-slate-200 truncate max-w-[160px]">
                  {user.displayName || user.email?.split("@")[0] || "User"}
                </span>
                <span className="flex items-center text-[10px] space-x-1">
                  {isEmailVerified ? (
                    <span className="text-emerald-400 flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-0.5 inline" /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center">
                      <ShieldAlert className="w-3 h-3 mr-0.5 inline" /> Unverified
                    </span>
                  )}
                </span>
              </div>

              {/* Avatar */}
              <div className="relative">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User Avatar"}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : user.email
                      ? user.email.charAt(0).toUpperCase()
                      : <UserIcon className="w-4 h-4 text-white" />}
                  </div>
                )}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                    isEmailVerified ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  title={isEmailVerified ? "Email Verified" : "Email Pending Verification"}
                />
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition flex items-center space-x-1"
                title="Sign out of your session"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
