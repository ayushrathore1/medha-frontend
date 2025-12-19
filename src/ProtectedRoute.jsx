import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useTour } from "./context/TourContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { isTourActive } = useTour();

  // If user exists OR a tour is active, allow access
  if (user || isTourActive) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
