import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin, errorMsg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      setLocalError(error.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  // Use errorMsg from props (from parent Login.jsx) or local error state
  const displayError = errorMsg || localError;

  return (
    <div className="relative w-full">
      {/* Ambient gradient glow behind form - FULL WIDTH */}
      <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-violet-500/25 via-blue-600/20 to-purple-400/10 blur-3xl pointer-events-none -z-10" />

      {/* Glassy form */}
      <form
        className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl px-8 py-10 w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
          Sign in to MEDHA
        </h2>

        {/* Error message display */}
        {displayError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 font-medium text-center text-sm backdrop-blur">
            {displayError}
          </div>
        )}

        {/* Email input */}
        <div className="mb-4">
          <label
            className="block text-violet-300 font-semibold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className="w-full backdrop-blur bg-white/30 text-white border border-violet-500/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition placeholder-violet-300/70"
            type="email"
            id="email"
            placeholder="your@email.com"
            autoComplete="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Password input */}
        <div className="mb-6">
          <label
            className="block text-violet-300 font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full backdrop-blur bg-white/30 text-white border border-blue-500/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-blue-200/70"
            type="password"
            id="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Sign In button */}
        <button
          type="submit"
          className={`w-full backdrop-blur-xl bg-violet-500/90 text-white font-semibold py-3 rounded-2xl border border-violet-400/30 shadow-lg hover:bg-violet-600/90 hover:scale-[1.03] transition-all duration-150 ${
            loading ? "opacity-60 cursor-wait" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer links */}
        <div className="flex items-center justify-between mt-5">
          <button
            type="button"
            className="text-violet-300 font-semibold hover:underline text-sm hover:text-white transition"
            onClick={handleRegister}
            disabled={loading}
            style={{ background: "none", border: "none", cursor: loading ? "wait" : "pointer" }}
          >
            New User?
          </button>
          <button
            type="button"
            className="text-blue-300 font-medium hover:underline text-sm hover:text-white transition"
            onClick={handleForgotPassword}
            disabled={loading}
            style={{ background: "none", border: "none", cursor: loading ? "wait" : "pointer" }}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
