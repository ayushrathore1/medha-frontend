import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Adjust path as needed

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If user exists (logged in), render children, else redirect to login
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
