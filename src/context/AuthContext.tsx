import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { auth, initAnalytics } from "../firebase/config";

export interface ActivityLogItem {
  id: string;
  action: string;
  details?: string;
  timestamp: string;
  type: "success" | "info" | "warning" | "security";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  reloadUser: () => Promise<boolean>;
  sendVerification: () => Promise<void>;
  logout: () => Promise<void>;
  activityLogs: ActivityLogItem[];
  addActivityLog: (action: string, details?: string, type?: ActivityLogItem["type"]) => void;
  clearActivityLogs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_LOGS_KEY = "cybercrimeai_auth_logs";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addActivityLog = (
    action: string,
    details?: string,
    type: ActivityLogItem["type"] = "info"
  ) => {
    const newLog: ActivityLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      details,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      type,
    };
    setActivityLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 49)];
      try {
        localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save auth log:", e);
      }
      return updated;
    });
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    try {
      localStorage.removeItem(STORAGE_LOGS_KEY);
    } catch (e) {
      console.warn("Could not clear auth logs:", e);
    }
  };

  useEffect(() => {
    // Initialize analytics when app starts
    initAnalytics();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Log sign-in if first load
        addActivityLog(
          "Auth Session Active",
          currentUser.email ? `Logged in as ${currentUser.email}` : "Anonymous or custom sign-in",
          "info"
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Reload current user to check if email was verified in another tab or mailbox
  const reloadUser = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      await reload(auth.currentUser);
      const updated = auth.currentUser;
      setUser({ ...updated }); // trigger re-render with fresh reference
      if (updated.emailVerified) {
        addActivityLog(
          "Email Verified Confirmed",
          `Email ${updated.email} is officially verified!`,
          "success"
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to reload user state:", err);
      return false;
    }
  };

  const sendVerification = async () => {
    if (!auth.currentUser) throw new Error("No active user session found.");
    await sendEmailVerification(auth.currentUser);
    addActivityLog(
      "Verification Email Dispatched",
      `Verification link sent to ${auth.currentUser.email}`,
      "security"
    );
  };

  const logout = async () => {
    const userEmail = auth.currentUser?.email;
    await signOut(auth);
    setUser(null);
    addActivityLog("User Logged Out", userEmail ? `Signed out ${userEmail}` : "User session ended", "info");
  };

  const isEmailVerified = !!user?.emailVerified;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isEmailVerified,
        reloadUser,
        sendVerification,
        logout,
        activityLogs,
        addActivityLog,
        clearActivityLogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
