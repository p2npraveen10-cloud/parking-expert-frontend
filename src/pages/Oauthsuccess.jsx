import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Alert } from "@mui/material";
import api from "../serviceCalls/api";

const OAuthSuccess = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOAuthUser = async () => {
      try {
        const response = await api.get("auth/oauth-user", {
          });

        console.log("OAuth Response:", response.data);

        const {
          accessToken,
          firstName,
          lastName,
          email,
          contactNo,
          dateOfBirth,
          profile,
          companyName,
          companyEmail,
          companyContactNo,
          gstNumber,
          companyLogo,
        } = response.data;


        if (!accessToken) {
          throw new Error("Access token not found");
        }

        if (!email) {
          throw new Error("Email not found");
        }


        // A first-time Google user can be authenticated without having a
        // company yet. Keep that state explicit instead of making the UI
        // guess from undefined company fields.
        const hasCompany = Boolean(
          companyName ||
          companyEmail ||
          companyContactNo ||
          gstNumber ||
          companyLogo
        );

        const user = {
          firstName,
          lastName,
          emailId: email,
          contactNo,
          dateOfBirth,
          profile,

          // null means the authenticated user has no company yet.
          company: hasCompany
            ? {
                companyName: companyName || null,
                companyEmail: companyEmail || null,
                companyContactNo: companyContactNo || null,
                gstNumber: gstNumber || null,
                companyLogo: companyLogo || null,
              }
            : null,

          companyName: companyName || null,
          companyEmail: companyEmail || null,
          companyContactNo: companyContactNo || null,
          gstNumber: gstNumber || null,
          companyLogo: companyLogo || null,

          // Useful for UI/debugging; it does not control authorization.
          authProvider: "GOOGLE",
        };
        // Save token
        localStorage.setItem("token", accessToken);

        // Save user
        localStorage.setItem("user", JSON.stringify(user));

        if (cancelled) return;

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }

        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Google Login Failed"
        );

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      }
    };

    fetchOAuthUser();

    return () => {
      cancelled = true;
    };
  }, [navigate, onLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <CircularProgress />
          <p className="mt-4">Signing in...</p>
        </>
      )}
    </div>
  );
};

export default OAuthSuccess;