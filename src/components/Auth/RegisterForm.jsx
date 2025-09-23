import React, { useState } from "react";

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Replace with your API call:
      await onRegister(email, password); // Parent handler
    } catch (error) {
      setErrorMsg(error.message || "Registration failed!");
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
        Create your MEDHA Account
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

      <div className="mb-4">
        <label className="block text-blue-900 font-medium mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
          type="password"
          id="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-blue-900 font-medium mb-2" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
          type="password"
          id="confirmPassword"
          placeholder="••••••••"
          autoComplete="new-password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition ${
          loading ? "opacity-60 cursor-wait" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
};

export default RegisterForm;
