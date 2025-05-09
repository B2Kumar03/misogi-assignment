import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoutes({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Save the intended URL for redirect after login
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
}
