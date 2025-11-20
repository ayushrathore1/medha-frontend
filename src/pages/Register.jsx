import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed");
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
          Create Account
        </h2>
        <p className="text-center mb-8" style={{ color: "var(--text-secondary)" }}>
          Join MEDHA and start learning smarter
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl text-center font-semibold text-red-600 border-2 border-red-200" style={{ backgroundColor: "var(--bg-primary)" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
            size="large"
            fullWidth
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center" style={{ color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold" style={{ color: "var(--action-primary)" }}>
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
