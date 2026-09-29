import React, { useState, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Send,
} from "lucide-react";
import { auth } from "../../firebase/config";
import { getFriendlyAuthErrorMessage } from "../../firebase/authErrors";
import { useAuth } from "../../context/AuthContext";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onOpenProjectInfo: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onOpenProjectInfo,
}) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{
    title: string;
    message: string;
    tip?: string;
    isProviderConfigError?: boolean;
  } | null>(null);

  const { addActivityLog } = useAuth();

  // Password Strength Evaluation
  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (passwordCriteria.minLength) score += 1;
    if (passwordCriteria.hasUpper) score += 1;
    if (passwordCriteria.hasLower) score += 1;
    if (passwordCriteria.hasNumber) score += 1;
    if (passwordCriteria.hasSpecial) score += 1;
    return score;
  }, [passwordCriteria]);

  const strengthLabel = useMemo(() => {
    if (password.length === 0) return { label: "", color: "bg-slate-700" };
    if (strengthScore <= 2) return { label: "Weak", color: "bg-rose-500" };
    if (strengthScore <= 3) return { label: "Fair", color: "bg-amber-500" };
    if (strengthScore === 4) return { label: "Good", color: "bg-cyan-500" };
    return { label: "Bulletproof", color: "bg-emerald-500" };
  }, [strengthScore, password]);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInfo(null);

    if (!displayName.trim()) {
      setErrorInfo({
        title: "Name Required",
        message: "Please enter your name or operational callsign.",
      });
      return;
    }

    if (!email.trim()) {
      setErrorInfo({
        title: "Email Required",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (password.length < 6) {
      setErrorInfo({
        title: "Password Too Short",
        message: "Password must be at least 6 characters long.",
        tip: "A strong password contains at least 8 characters with numbers and symbols.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setErrorInfo({
        title: "Passwords Do Not Match",
        message: "The passwords entered in both fields must be identical.",
      });
      return;
    }

    if (!agreeTerms) {
      setErrorInfo({
        title: "Terms Consent Required",
        message: "Please acknowledge the security usage terms to proceed.",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // 2. Update Profile with Display Name
      await updateProfile(user, {
        displayName: displayName.trim(),
      });

      addActivityLog(
        "Account Created",
        `Registered user ${user.email} (${displayName.trim()})`,
        "success"
      );

      // 3. Immediately dispatch Email Verification
      try {
        await sendEmailVerification(user);
        addActivityLog(
          "Verification Email Sent",
          `Verification dispatch to ${user.email}`,
          "security"
        );
      } catch (verificationError: any) {
        console.warn("Initial email verification dispatch warning:", verificationError);
      }

      // The onAuthStateChanged in AuthContext will update user state automatically
    } catch (err: any) {
      console.error("Registration error:", err);
      const friendly = getFriendlyAuthErrorMessage(
        err?.code || err?.message || ""
      );
      setErrorInfo(friendly);
      addActivityLog(
        "Registration Failed",
        `${friendly.title}: ${err?.code || err?.message}`,
        "warning"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setErrorInfo(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const userCredential = await signInWithPopup(auth, provider);
      addActivityLog(
        "Google Account Registered",
        `Created/Signed in via Google: ${userCredential.user.email}`,
        "success"
      );
    } catch (err: any) {
      console.error("Google sign up error:", err);
      const friendly = getFriendlyAuthErrorMessage(
        err?.code || err?.message || ""
      );
      setErrorInfo(friendly);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Register with email verification &amp; secure credentials
          </p>
        </div>

        {/* Error Feedback */}
        {errorInfo && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-rose-200">{errorInfo.title}</p>
                <p className="text-rose-300/90 leading-relaxed">
                  {errorInfo.message}
                </p>
                {errorInfo.tip && (
                  <p className="text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 mt-2 text-[11px]">
                    💡 <span className="font-semibold">Tip:</span> {errorInfo.tip}
                  </p>
                )}
                {errorInfo.isProviderConfigError && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onOpenProjectInfo}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 underline"
                    >
                      <span>Enable Email/Password in Firebase Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name / Callsign
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Agent John Doe"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address (For Verification)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@cybercrime.ai"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              A secure verification link will be automatically sent to this address.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Create Strong Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Password strength:</span>
                  <span className={`font-semibold ${
                    strengthScore >= 4 ? "text-emerald-400" : strengthScore >= 3 ? "text-cyan-400" : "text-amber-400"
                  }`}>
                    {strengthLabel.label}
                  </span>
                </div>
                {/* 5-bar meter */}
                <div className="grid grid-cols-5 gap-1 h-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`h-full rounded-full transition-all duration-300 ${
                        lvl <= strengthScore ? strengthLabel.color : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>

                {/* Criteria badges */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px]">
                  <div className={`flex items-center space-x-1 ${passwordCriteria.minLength ? "text-emerald-400" : "text-slate-500"}`}>
                    {passwordCriteria.minLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordCriteria.hasUpper && passwordCriteria.hasLower ? "text-emerald-400" : "text-slate-500"}`}>
                    {passwordCriteria.hasUpper && passwordCriteria.hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>Upper &amp; lowercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordCriteria.hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                    {passwordCriteria.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>Includes number</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordCriteria.hasSpecial ? "text-emerald-400" : "text-slate-500"}`}>
                    {passwordCriteria.hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>Special character (!@#)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type your password"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? "border-emerald-500/80 focus:ring-emerald-500"
                      : "border-rose-500/80 focus:ring-rose-500"
                    : "border-slate-700/80 focus:ring-indigo-500"
                }`}
              />
              {confirmPassword.length > 0 && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  {passwordsMatch ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  )}
                </div>
              )}
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-[11px] text-rose-400 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="pt-1">
            <label className="flex items-start space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-xs text-slate-400 leading-snug">
                I agree to the CyberCrime AI security protocol and acknowledge that account activation requires email verification.
              </span>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-400 hover:via-purple-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Create Account &amp; Send Verification</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 font-medium tracking-wider">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Google OAuth Provider */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-slate-200 bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition flex items-center justify-center space-x-2.5 shadow-sm"
        >
          {googleLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </>
          )}
        </button>

        {/* Switch to Login */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Already have an existing account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition ml-1"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
