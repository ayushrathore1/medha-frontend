import React, { useState } from "react";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

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
    </div>
  );
};

export default ForgotPassword;
