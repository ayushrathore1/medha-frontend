import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Register API call with backend integration (returns token too)
const registerApi = async (name, email, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  // Return full response (includes token!)
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
      className="bg-white/80 shadow-xl border border-blue-100 rounded-2xl p-8 flex flex-col gap-4 max-w-md w-full mx-auto"
    >
      <h2 className="text-blue-700 text-3xl font-bold mb-2 text-center">
        Create Account
      </h2>
      <div>
        <label className="block font-semibold mb-1 text-blue-900">
          Full Name
        </label>
        <input
          className="border border-blue-300 rounded-lg px-4 py-3 w-full text-blue-900 bg-white shadow-sm focus:outline-none focus:border-blue-500"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          autoComplete="name"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-blue-900">Email</label>
        <input
          className="border border-blue-300 rounded-lg px-4 py-3 w-full text-blue-900 bg-white shadow-sm focus:outline-none focus:border-blue-500"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-blue-900">
          Password
        </label>
        <input
          className="border border-blue-300 rounded-lg px-4 py-3 w-full text-blue-900 bg-white shadow-sm focus:outline-none focus:border-blue-500"
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
        <div className="text-red-500 text-center mb-2">{errorMsg}</div>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-blue-700 shadow transition"
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

  const handleRegister = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await registerApi(name, email, password);
      localStorage.setItem("token", data.token); // Store the JWT after signup
      navigate("/dashboard"); // Or navigate wherever you want after signup
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20 pb-10 flex items-center justify-center">
      <div className="max-w-md w-full">
        <RegisterForm onRegister={handleRegister} />
        <div className="mt-5 text-center text-blue-800 text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 transition-all">
          <div className="text-blue-700 text-lg font-semibold px-10 py-6 bg-white rounded-2xl shadow-2xl border border-blue-100">
            Registering your account...
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
