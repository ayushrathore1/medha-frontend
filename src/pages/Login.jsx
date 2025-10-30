import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Common/Loader";
import { AuthContext } from "../AuthContext";
import LoginForm from "../components/Auth/LoginForm";

const loginApi = async (email, password) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Invalid email or password");
  return data;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const userData = await loginApi(email, password);
      localStorage.setItem("token", userData.token);
      login(userData);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#0a0a0a] font-inter overflow-hidden">
      {/* Ambient glass gradient blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-2/6 h-72 bg-gradient-to-br from-violet-500/30 to-blue-400/15 rounded-full blur-2xl opacity-35 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-60 bg-gradient-to-l from-blue-400/25 to-fuchsia-400/12 rounded-full blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <style>{`
          @keyframes blob {
            0% { transform: scale(1) translate(0,0);}
            33% { transform: scale(1.08) translate(34px,-20px);}
            66% { transform: scale(0.93) translate(-16px,15px);}
            100% { transform: scale(1) translate(0,0);}
          }
          .animate-blob { animation: blob 14s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
      <div className="w-full flex flex-col items-center justify-center pt-24 px-6">
        <div className="max-w-md w-full z-10">
          <LoginForm onLogin={handleLogin} errorMsg={errorMsg} />
        </div>
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <Loader size={10} colorClass="border-violet-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
