import React from "react";
import { Navigate } from "react-router-dom";

// Use your real auth check here
const ProtectedRoute = ({ children }) => {
  // Replace with actual auth logic/backend call. For example, check token in localStorage/cookies.
  const isAuth = Boolean(localStorage.getItem("user")); // example

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
