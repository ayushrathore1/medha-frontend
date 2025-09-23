import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import Loader from "../components/Common/Loader";

// Call backend login
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
  if (!response.ok) {
    throw new Error(data.message || "Invalid email or password");
  }
  // You may want to return the token for further use
  return data;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const userData = await loginApi(email, password);
      // Example: store token in localStorage for future API calls
      localStorage.setItem("token", userData.token);
      // Optionally: set auth context here
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      throw err; // Show error in LoginForm
    }
  };

  return (
    <div
      className="pt-20 px-4 sm:px-12 min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url(https://ik.imagekit.io/ayushrathore1/login-bg.png?updatedAt=1758343971513)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay for better form readability */}
      <div className="absolute inset-0 bg-blue-50 bg-opacity-90"></div>
      <div className="max-w-md w-full relative z-10">
        <LoginForm onLogin={handleLogin} />
        <div className="mt-4 text-center text-blue-800 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign up here
          </Link>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <Loader size={8} />
        </div>
      )}
    </div>
  );
};

export default Login;
