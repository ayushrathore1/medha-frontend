import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import Loader from "../components/Common/Loader";

const registerApi = async (name, email, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
};

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await onRegister(name, email, password);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 md:p-10 !bg-white/60 !backdrop-blur-xl border-[var(--accent-secondary)]/20 shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-[var(--text-primary)] tracking-tight">
        Create Account
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[var(--text-secondary)] font-bold mb-2 text-sm uppercase tracking-wide">
            Full Name
          </label>
          <input
            className="w-full bg-white/50 text-[var(--text-primary)] border border-[var(--accent-secondary)]/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)] focus:border-transparent transition placeholder-gray-400 font-medium"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-[var(--text-secondary)] font-bold mb-2 text-sm uppercase tracking-wide">Email</label>
          <input
            className="w-full bg-white/50 text-[var(--text-primary)] border border-[var(--accent-secondary)]/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)] focus:border-transparent transition placeholder-gray-400 font-medium"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-[var(--text-secondary)] font-bold mb-2 text-sm uppercase tracking-wide">Password</label>
          <input
            className="w-full bg-white/50 text-[var(--text-primary)] border border-[var(--accent-secondary)]/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)] focus:border-transparent transition placeholder-gray-400 font-medium"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </div>
        {errorMsg && (
          <div className="text-red-500 font-bold text-center mb-1 animate-pulse text-sm bg-red-50 p-2 rounded-lg border border-red-100">
            {errorMsg}
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          size="large"
          className="w-full mt-4 shadow-lg hover:shadow-xl"
          loading={loading}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Card>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleRegister = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await registerApi(name, email, password);
      localStorage.setItem("token", data.token);
      login(data);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center relative overflow-hidden">
      <div className="max-w-md w-full z-10 px-4">
        <RegisterForm onRegister={handleRegister} />
        <div className="mt-6 text-center text-[var(--text-secondary)] font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[var(--action-primary)] hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
      {loading && <Loader fullScreen />}
    </div>
  );
};

export default Register;
