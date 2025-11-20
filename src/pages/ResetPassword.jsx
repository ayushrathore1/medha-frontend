import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
=======
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e

const resetPasswordApi = async (token, password) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }
  );
  const data = await res.json();
  return { ok: res.ok, message: data.message };
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get("token");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const { ok, message } = await resetPasswordApi(token, password);
    setMsg(message);
    setLoading(false);
    if (ok) setTimeout(() => navigate("/login"), 1500);
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-extrabold text-center mb-6 tracking-tight" style={{ color: "var(--action-primary)" }}>
            Reset Password
          </h2>
          <input
            type="password"
            className="border-2 rounded-xl px-5 py-3 w-full mb-6 font-medium focus:outline-none focus:ring-2 transition-all duration-150"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
            placeholder="New Password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            fullWidth
          >
            Reset Password
          </Button>
          {msg && (
            <div
              className={`text-center mt-6 font-semibold ${
                msg.toLowerCase().includes("success")
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {msg}
            </div>
          )}
        </form>
      </Card>
=======
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] font-inter relative overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/3 w-2/5 h-64 bg-gradient-to-tr from-violet-400/30 to-blue-400/11 rounded-full blur-2xl opacity-20 animate-blob" />
        <div className="absolute bottom-2 right-1/4 w-96 h-40 bg-gradient-to-l from-blue-400/13 to-violet-400/8 rounded-full blur-2xl opacity-18 animate-blob animation-delay-2000" />
        <style>{`
          @keyframes blob { 0% {transform: scale(1) translate(0,0);} 33% {transform: scale(1.09) translate(26px,-23px);} 66% {transform: scale(0.95) translate(-16px,17px);} 100% {transform: scale(1) translate(0,0);} }
          .animate-blob { animation: blob 14s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-[#18163a]/95 backdrop-blur-2xl border border-violet-400/15 shadow-2xl rounded-3xl px-8 py-12 max-w-md w-full mx-auto z-10"
      >
        <h2 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
          Reset Password
        </h2>
        <input
          type="password"
          className="border border-violet-400/20 rounded-xl px-5 py-3 w-full mb-7 bg-[#18163a]/80 text-white font-medium placeholder-blue-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all duration-150"
          placeholder="New Password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold py-3 rounded-xl w-full shadow-xl hover:scale-[1.04] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {msg && (
          <div
            className={`text-center mt-6 font-semibold ${
              msg.toLowerCase().includes("success")
                ? "text-emerald-400"
                : "text-red-400"
            } animate-pulse`}
          >
            {msg}
          </div>
        )}
      </form>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
    </div>
  );
};

export default ResetPassword;
