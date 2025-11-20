import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import Card from "../Common/Card";

const LoginForm = ({ onLogin, loading, errorMsg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      <Card className="w-full max-w-md p-8 md:p-10 !bg-white/60 !backdrop-blur-xl border-[var(--accent-secondary)]/20 shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-[var(--text-primary)] tracking-tight">
          Sign in to <span className="text-[var(--action-primary)]">MEDHA</span>
        </h2>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-500 font-medium text-center text-sm border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-[var(--text-secondary)] font-bold mb-2 text-sm uppercase tracking-wide"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full bg-white/50 text-[var(--text-primary)] border border-[var(--accent-secondary)]/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)] focus:border-transparent transition placeholder-gray-400 font-medium"
              type="email"
              id="email"
              placeholder="your@email.com"
              autoComplete="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-[var(--text-secondary)] font-bold mb-2 text-sm uppercase tracking-wide"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full bg-white/50 text-[var(--text-primary)] border border-[var(--accent-secondary)]/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)] focus:border-transparent transition placeholder-gray-400 font-medium"
              type="password"
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full mt-4 shadow-lg hover:shadow-xl"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--accent-secondary)]/10">
            <button
              type="button"
              className="text-[var(--text-secondary)] font-semibold hover:text-[var(--action-primary)] text-sm transition"
              onClick={handleRegister}
              disabled={loading}
            >
              Create Account
            </button>
            <button
              type="button"
              className="text-[var(--text-secondary)] font-semibold hover:text-[var(--action-primary)] text-sm transition"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
