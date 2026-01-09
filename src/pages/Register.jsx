import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSignUp } from "@clerk/clerk-react";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import { AuthContext } from "../AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  // Clerk SignUp hook - only used for email verification (OTP)
  const { isLoaded, signUp } = useSignUp();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Create Clerk account and send verification email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isLoaded) {
      setError("Authentication service is loading. Please wait.");
      return;
    }

    setLoading(true);

    try {
      // Create Clerk signup for EMAIL VERIFICATION ONLY - no password stored in Clerk
      // Password will be stored only in MongoDB with bcrypt
      await signUp.create({
        emailAddress: formData.email,
        // Note: No password sent to Clerk - Clerk is only used for email OTP
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Move to verification step
      setVerificationStep(true);
    } catch (err) {
      console.error("Clerk signup error:", err);
      // Handle Clerk-specific errors
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        if (clerkError.code === "form_identifier_exists") {
          setError("This email is already registered. Try logging in.");
        } else if (clerkError.code === "form_password_pwned") {
          setError("This password is too common. Please choose a stronger password.");
        } else {
          setError(clerkError.longMessage || clerkError.message || "Signup failed");
        }
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create backend account after Clerk verification
  const createBackendAccount = async (clerkSignUp, retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password, // Password goes to backend only (bcrypt hashed)
          emailVerified: true,
          // Note: clerkUserId removed - Clerk is only used for email verification
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Note: No Clerk session activation - we use our own JWT for auth
        // Clerk was only used for email verification OTP
        
        // Store JWT and user data from our backend
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        navigate("/personalize");
      } else if (response.status === 409) {
        // User already exists - try to login instead
        console.log("User already exists, attempting login...");
        const loginResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        
        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("user", JSON.stringify(loginData.user));
          login(loginData.user);
          navigate("/personalize");
        } else {
          setError("Account exists but login failed. Try logging in manually.");
          setLoading(false);
        }
      } else if (response.status >= 500 && retryCount < maxRetries) {
        // Server error - retry with backoff
        console.log(`Backend error (attempt ${retryCount + 1}/${maxRetries}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return createBackendAccount(clerkSignUp, retryCount + 1);
      } else {
        setError(data.message || "Failed to create account in our system");
        setLoading(false);
      }
    } catch (err) {
      console.error("Backend registration error:", err);
      
      // Retry on network errors
      if (retryCount < maxRetries) {
        console.log(`Network error (attempt ${retryCount + 1}/${maxRetries}), retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return createBackendAccount(clerkSignUp, retryCount + 1);
      }
      
      setError("Failed to complete registration. Please try again.");
      setLoading(false);
    }
  };

  // Step 2: Verify email code and create backend account
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Always attempt verification with the code
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      
      console.log("Verification result:", result.status, result);

      // Check all possible completion states
      if (result.status === "complete") {
        // Perfect - fully verified, create backend account
        await createBackendAccount(result);
      } else if (result.status === "missing_requirements") {
        // Check if email is verified but missing other requirements (like phone)
        const emailVerified = result.verifications?.emailAddress?.status === "verified";
        if (emailVerified) {
          console.log("Email verified, proceeding despite missing other requirements");
          await createBackendAccount(result);
        } else {
          setError("Verification incomplete. Please check the code and try again.");
          setLoading(false);
        }
      } else {
        // Some other status
        console.log("Unexpected verification status:", result.status);
        setError(`Verification status: ${result.status}. Please try again.`);
        setLoading(false);
      }
    } catch (err) {
      console.error("Verification error:", err);
      
      // Handle specific Clerk errors
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        console.log("Clerk error code:", clerkError.code, clerkError);
        
        // If already verified, proceed to backend registration
        if (clerkError.code === "verification_already_verified" ||
            clerkError.code === "form_code_incorrect" ||
            clerkError.message?.toLowerCase().includes("already") ||
            clerkError.longMessage?.toLowerCase().includes("already")) {
          console.log("Email may be already verified, attempting backend registration...");
          
          // Try to create backend account with available data
          await createBackendAccount({
            createdUserId: signUp.id || signUp.createdUserId,
            createdSessionId: signUp.createdSessionId,
          });
          return;
        }
        
        setError(clerkError.longMessage || clerkError.message || "Verification failed");
      } else {
        setError(err.message || "Verification failed. Please try again.");
      }
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setError("");
      alert("Verification code resent! Check your email.");
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "3s" }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
           <Link to="/">
            <img
              src="https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/6.svg?updatedAt=1767677218473"
              alt="MEDHA logo"
              className="w-20 h-20 mx-auto mb-4 object-contain"
            />
           </Link>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
            {verificationStep ? "Verify Your Email" : "Join the Era of Intelligence"}
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            {verificationStep 
              ? `We sent a code to ${formData.email}`
              : "Create your free account today."
            }
          </p>
        </div>

        <Card className="shadow-2xl shadow-indigo-500/10 border-indigo-100 p-8">
          {!verificationStep ? (
            // Step 1: Registration Form
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
                  placeholder="Aryan Mehta"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
                  placeholder="student@university.edu"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Email Verification Notice */}
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="text-xs text-indigo-700 text-center leading-relaxed font-medium">
                  📧 We'll send a verification code to your email to confirm it's really you.
                </p>
              </div>

              {/* Email Consent Note */}
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                By creating an account, you agree to receive important updates, feature announcements, and occasional emails from Medha AI. We respect your inbox! 📬
              </p>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || !isLoaded}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
                >
                  {loading ? "Creating Account..." : "Continue with Email"}
                </Button>
              </div>
            </form>
          ) : (
            // Step 2: Email Verification Form
            <form onSubmit={handleVerifyEmail} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center">
                  {error}
                </div>
              )}

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-3xl">📧</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Enter the 6-digit code we sent to your email
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-center text-2xl font-bold tracking-[0.5em] placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
                >
                  Didn't receive the code? Resend
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setVerificationStep(false)}
                  className="text-sm text-slate-500 font-medium hover:text-slate-700"
                >
                  ← Back to registration
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-slate-600 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
