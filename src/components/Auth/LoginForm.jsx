import React, { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      // Replace with your API call:
      await onLogin(email, password); // Parent handler
    } catch (error) {
      setErrorMsg(error.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white rounded-xl shadow-md px-8 py-10 max-w-md w-full mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        Sign in to MEDHA
      </h2>

      {errorMsg && (
        <div className="mb-4 text-red-500 text-center text-sm">{errorMsg}</div>
      )}

      <div className="mb-4">
        <label className="block text-blue-900 font-medium mb-2" htmlFor="email">
          Email Address
        </label>
        <input
          className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
          type="email"
          id="email"
          placeholder="your@email.com"
          autoComplete="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-blue-900 font-medium mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
          type="password"
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition ${
          loading ? "opacity-60 cursor-wait" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
