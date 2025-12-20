import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import { AuthContext } from "../AuthContext";

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
  const { login } = useContext(AuthContext);

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
        login(data.user);
        navigate("/personalize");
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
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "3s" }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
           <Link to="/">
            <img
              src="https://ik.imagekit.io/ayushrathore1/logo.png?updatedAt=1758343718570"
              alt="MEDHA logo"
              className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg"
            />
           </Link>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
            Join the Era of Intelligence
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Create your free account today.
          </p>
        </div>

        <Card className="shadow-2xl shadow-indigo-500/10 border-indigo-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
                placeholder="Aryan Mehta"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
                placeholder="student@university.edu"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary" // Assuming primary is now the gradient or indigo solid from previous step
                size="lg"
                fullWidth
                className="shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-slate-600 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
