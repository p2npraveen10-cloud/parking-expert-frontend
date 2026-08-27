import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const hasValidToken = Boolean(token) && token !== "undefined" && token !== "null";

  if (hasValidToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;