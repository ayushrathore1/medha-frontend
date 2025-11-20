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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background is handled by MainLayout or global styles usually. 
          If this page is standalone, we might need a background wrapper.
          Assuming MainLayout wraps App, but Login might be a separate route.
          If Login is inside MainLayout, we are good.
          If not, we can add a simple background here or assume global body background.
      */}
      <div className="w-full flex flex-col items-center justify-center pt-24 px-6 z-10">
        <div className="max-w-md w-full">
          <LoginForm onLogin={handleLogin} errorMsg={errorMsg} loading={loading} />
        </div>
        {loading && <Loader fullScreen />}
      </div>
    </div>
  );
};

export default Login;
