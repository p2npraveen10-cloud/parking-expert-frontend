import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Wrap login/signup/forgot-password so an already-logged-in user gets
 * bounced straight to the dashboard instead of seeing the login form again.
 *   <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
 */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const hasValidToken = Boolean(token) && token !== "undefined" && token !== "null";

  if (hasValidToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;