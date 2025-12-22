import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

/**
 * ForgotPassword - Now uses Clerk for password reset
 * Clerk handles email sending and password reset flow
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isLoaded, signIn } = useSignIn();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("email"); // email, code, newPassword, success
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 1: Request password reset code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    
    if (!isLoaded) {
      setError("Service is loading. Please wait.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Start the password reset flow with Clerk
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      
      setStep("code");
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        if (clerkError.code === "form_identifier_not_found") {
          setError("No account found with this email address.");
        } else {
          setError(clerkError.longMessage || clerkError.message || "Failed to send reset code");
        }
      } else {
        setError(err.message || "Failed to send reset code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code and set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Attempt to reset password with the code
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        setStep("success");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError("Password reset incomplete. Please try again.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        if (clerkError.code === "form_code_incorrect") {
          setError("Invalid verification code. Please check and try again.");
        } else if (clerkError.code === "form_password_pwned") {
          setError("This password is too common. Please choose a stronger password.");
        } else {
          setError(clerkError.longMessage || clerkError.message || "Failed to reset password");
        }
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setError("");
      alert("Reset code resent! Check your email.");
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <Card className="max-w-md w-full shadow-2xl shadow-indigo-500/10 border-indigo-100 p-8">
        {step === "email" && (
          <form onSubmit={handleRequestCode}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Forgot Password
              </h2>
              <p className="text-slate-500 mt-2">
                Enter your email and we'll send you a code to reset your password.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center mb-4">
                {error}
              </div>
            )}

            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium mb-4 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Button
              type="submit"
              disabled={loading || !isLoaded}
              loading={loading}
              fullWidth
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
            >
              Send Reset Code
            </Button>
            
            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={handleResetPassword}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-3xl">📧</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Check Your Email
              </h2>
              <p className="text-slate-500 mt-2">
                We sent a code to <strong>{email}</strong>
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-center text-2xl font-bold tracking-[0.5em] placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="000000"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              loading={loading}
              fullWidth
              className="mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
            >
              Reset Password
            </Button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
              >
                Didn't receive the code? Resend
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-slate-500 font-medium hover:text-slate-700"
              >
                ← Use different email
              </button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">
              Password Reset!
            </h2>
            <p className="text-slate-500">
              Your password has been successfully reset.
            </p>
            <p className="text-slate-400 text-sm mt-4">
              Redirecting to login...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
