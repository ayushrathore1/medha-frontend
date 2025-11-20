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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="p-4 rounded-xl text-center font-semibold text-red-600 border-2 border-red-200"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          {error}
        </div>
      )}

      <div>
        <label
          className="block mb-2 font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <label
          className="block mb-2 font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
