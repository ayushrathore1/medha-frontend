import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Common/Card";
import LoginForm from "../components/Auth/LoginForm";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
        login(data.user);
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
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
           <Link to="/">
            <img
              src="https://ik.imagekit.io/ayushrathore1/logo.png?updatedAt=1758343718570"
              alt="MEDHA logo"
              className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg"
            />
           </Link>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Your personal knowledge archive awaits.
          </p>
        </div>

        <Card className="shadow-2xl shadow-indigo-500/10 border-indigo-100">
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4">
            <Link 
              to="/forgot-password" 
              className="block text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Forgot your password?
            </Link>
            <div className="text-slate-600 font-medium">
              New to MEDHA?{" "}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
