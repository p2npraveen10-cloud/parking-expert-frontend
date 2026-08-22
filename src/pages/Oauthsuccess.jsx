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
          withCredentials: true,
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


        const user = {
          firstName,
          lastName,
          emailId: email,   // normal login oda same format
          contactNo,
          dateOfBirth,
          profile,
          companyName,
          companyEmail,
          companyContactNo,
          gstNumber,
          companyLogo,
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