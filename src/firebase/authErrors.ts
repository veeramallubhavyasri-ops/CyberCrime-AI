/**
 * Helper to map Firebase Auth error codes to user-friendly messages
 */
export function getFriendlyAuthErrorMessage(errorCodeOrMessage: string): {
  title: string;
  message: string;
  tip?: string;
  isProviderConfigError?: boolean;
} {
  const code = errorCodeOrMessage.toLowerCase();

  if (code.includes("auth/email-already-in-use")) {
    return {
      title: "Account Already Exists",
      message: "An account with this email address is already registered.",
      tip: "Try signing in instead, or use 'Forgot password' if you cannot access your account.",
    };
  }

  if (code.includes("auth/invalid-email")) {
    return {
      title: "Invalid Email Address",
      message: "Please enter a valid, well-formed email address (e.g. name@domain.com).",
    };
  }

  if (code.includes("auth/user-not-found")) {
    return {
      title: "User Not Found",
      message: "No user found with this email address.",
      tip: "Please check for typos or click 'Create Account' to register.",
    };
  }

  if (code.includes("auth/wrong-password") || code.includes("auth/invalid-credential") || code.includes("auth/invalid-login-credentials")) {
    return {
      title: "Invalid Credentials",
      message: "The email or password you entered is incorrect.",
      tip: "Double-check your password caps lock or click 'Forgot password' to reset it.",
    };
  }

  if (code.includes("auth/weak-password")) {
    return {
      title: "Password Too Weak",
      message: "Firebase requires passwords to be at least 6 characters.",
      tip: "Use a combination of uppercase letters, numbers, and special symbols for better security.",
    };
  }

  if (code.includes("auth/user-disabled")) {
    return {
      title: "Account Suspended",
      message: "This user account has been disabled by an administrator.",
      tip: "Contact support or your system administrator for assistance.",
    };
  }

  if (code.includes("auth/too-many-requests")) {
    return {
      title: "Access Temporarily Blocked",
      message: "Too many unsuccessful login attempts. Access to this account has been temporarily blocked for security.",
      tip: "Please wait a few minutes before trying again or reset your password.",
    };
  }

  if (code.includes("auth/network-request-failed")) {
    return {
      title: "Network Connection Error",
      message: "Could not reach Firebase servers. Please verify your internet connection.",
    };
  }

  if (code.includes("auth/operation-not-allowed")) {
    return {
      title: "Email/Password Provider Not Enabled in Firebase",
      message: "Email & Password authentication has not been enabled yet in the Firebase Console for project 'cybercrimeai-cf3f6'.",
      tip: "Go to Firebase Console -> Authentication -> Sign-in method -> Click 'Email/Password' and switch 'Enable' to ON.",
      isProviderConfigError: true,
    };
  }

  if (code.includes("auth/unauthorized-domain")) {
    return {
      title: "Current Domain Not Authorized",
      message: "This web domain is not yet on the authorized domains list in Firebase Auth.",
      tip: "Add the current preview domain to Firebase Console -> Authentication -> Settings -> Authorized Domains.",
      isProviderConfigError: true,
    };
  }

  if (code.includes("auth/popup-closed-by-user")) {
    return {
      title: "Sign-In Cancelled",
      message: "The authentication popup was closed before completing the sign-in process.",
    };
  }

  if (code.includes("auth/requires-recent-login")) {
    return {
      title: "Recent Authentication Required",
      message: "This sensitive security action requires you to have signed in recently.",
      tip: "Please log out and log back in, then retry this action.",
    };
  }

  return {
    title: "Authentication Error",
    message: errorCodeOrMessage.replace(/^Firebase:\s*/, "").replace(/\(auth\/[^)]+\)\.?/, "").trim() || "An unexpected authentication error occurred.",
    tip: "If this continues, check your Firebase console settings or network connection.",
  };
}
