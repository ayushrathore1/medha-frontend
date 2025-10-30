import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

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
    <form
      onSubmit={handleSubmit}
      className="bg-[#18163a]/95 shadow-2xl border border-violet-400/15 rounded-3xl p-10 flex flex-col gap-6 max-w-md w-full mx-auto backdrop-blur-xl"
    >
      <h2 className="text-3xl font-extrabold text-center mb-1 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
        Create Account
      </h2>
      <div>
        <label className="block font-bold mb-1 text-violet-300">
          Full Name
        </label>
        <input
          className="border border-violet-400/20 rounded-xl px-4 py-3 w-full bg-[#18163a]/80 text-white font-medium placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none shadow"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          autoComplete="name"
        />
      </div>
      <div>
        <label className="block font-bold mb-1 text-blue-300">Email</label>
        <input
          className="border border-violet-400/20 rounded-xl px-4 py-3 w-full bg-[#18163a]/80 text-white font-medium placeholder-blue-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none shadow"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block font-bold mb-1 text-blue-300">Password</label>
        <input
          className="border border-violet-400/20 rounded-xl px-4 py-3 w-full bg-[#18163a]/80 text-white font-medium placeholder-blue-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none shadow"
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
        <div className="text-red-400 font-bold text-center mb-1 animate-pulse">
          {errorMsg}
        </div>
      )}
      <button
        type="submit"
        className="bg-gradient-to-r from-violet-600 to-blue-600 font-bold text-lg py-3 rounded-xl text-white shadow-xl hover:scale-[1.04] transition-all focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
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
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-10 flex items-center justify-center relative font-inter overflow-hidden">
      {/* Glassy ambient blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/3 w-2/6 h-60 bg-gradient-to-tr from-violet-500/25 to-blue-400/15 rounded-full blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-60 bg-gradient-to-l from-blue-400/18 to-fuchsia-400/9 rounded-full blur-2xl opacity-18 animate-blob animation-delay-2000"></div>
        <style>{`
          @keyframes blob { 0% {transform: scale(1) translate(0,0);} 33% {transform: scale(1.08) translate(34px,-20px);} 66% {transform: scale(0.93) translate(-16px,15px);} 100% {transform: scale(1) translate(0,0);} }
          .animate-blob { animation: blob 14s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
      <div className="max-w-md w-full z-10">
        <RegisterForm onRegister={handleRegister} />
        <div className="mt-6 text-center text-violet-300 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all">
          <div className="text-xl font-bold text-white px-10 py-7 bg-[#18163a]/95 rounded-3xl shadow-2xl border border-violet-400/20">
            Registering your account...
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
