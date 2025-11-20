import React, { useState } from "react";
<<<<<<< HEAD
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
=======
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e

const forgotPasswordApi = async (email) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );
  const data = await res.json();
  return data.message;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const message = await forgotPasswordApi(email);
      setMsg(message);
    } catch {
      setMsg("Unable to send reset link. Please try again.");
    }
    setLoading(false);
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-extrabold text-center mb-5 tracking-tight" style={{ color: "var(--action-primary)" }}>
            Forgot Password
          </h2>
          <input
            type="email"
            className="border-2 rounded-xl px-5 py-3 w-full mb-6 font-medium focus:outline-none focus:ring-2 transition-all duration-150"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            fullWidth
          >
            Send Reset Link
          </Button>
          {msg && (
            <div className="text-center font-semibold mt-5" style={{ color: "var(--accent-primary)" }}>
              {msg}
            </div>
          )}
        </form>
      </Card>
=======
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] font-inter">
      <form
        onSubmit={handleSubmit}
        className="bg-[#18163a]/90 backdrop-blur-2xl border border-violet-400/15 shadow-2xl rounded-3xl px-7 py-12 max-w-md w-full mx-auto"
      >
        <h2 className="text-2xl font-extrabold text-center mb-5 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
          Forgot Password
        </h2>
        <input
          type="email"
          className="border border-violet-400/30 rounded-xl px-5 py-3 w-full mb-7 bg-white/10 backdrop-blur-xl font-medium text-white placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all duration-150"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold py-3 rounded-xl w-full shadow-xl hover:scale-[1.04] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {msg && (
          <div className="text-center text-emerald-400 font-semibold mt-5">
            {msg}
          </div>
        )}
      </form>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
    </div>
  );
};

export default ForgotPassword;
