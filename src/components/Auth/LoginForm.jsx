import React from "react";
import Button from "../Common/Button";

const LoginForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 flex items-center justify-center">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-2 text-sm font-bold text-slate-700">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
          placeholder="you@university.edu"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-slate-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          variant="primary"
          size="lg"
          fullWidth
          className="shadow-xl shadow-indigo-500/20"
        >
          Sign In
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
