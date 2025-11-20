import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import LoginForm from "../components/Auth/LoginForm";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight" style={{ color: "var(--action-primary)" }}>
          Welcome Back
        </h2>
        <p className="text-center mb-8" style={{ color: "var(--text-secondary)" }}>
          Sign in to continue to MEDHA
        </p>

        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

        <div className="mt-6 text-center space-y-3">
          <Link to="/forgot-password" className="block font-medium" style={{ color: "var(--action-primary)" }}>
            Forgot your password?
          </Link>
          <div style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold" style={{ color: "var(--action-primary)" }}>
              Sign up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
