import React, { useState } from "react";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import { LoadingSpinner } from "../components/Loading/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import api from "../serviceCalls/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // step: "email" | "otp" | "reset" | "done"
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("auth/forgot-password", { email });
      toast.success("OTP sent", "Check your email for the verification code");
      setStep("otp");
    } catch (err) {
      toast.error(
        "Something went wrong",
        err.response?.data?.message || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("auth/verify-otp", { email, otp });
      toast.success("OTP verified", "Now set your new password");
      setStep("reset");
    } catch (err) {
      toast.error(
        "Invalid or expired OTP",
        err.response?.data?.message || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", "Please make sure both passwords match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password too short", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset", "You can now log in with your new password");
      setStep("done");
    } catch (err) {
      toast.error(
        "Something went wrong",
        err.response?.data?.message || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await api.post("auth/forgot-password", { email });
      toast.success("OTP resent", "Check your email for the new code");
    } catch (err) {
      toast.error(
        "Something went wrong",
        err.response?.data?.message || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {step === "email" && (
        <>
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 mt-2 mb-8">
            Enter your email and we'll send you a verification code
          </p>

          <form onSubmit={handleSendOtp} className="space-y-5">
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" className="!text-gray-400" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <motion.div whileHover={{ y: loading ? 0 : -3 }} whileTap={{ scale: 0.98 }} className="group">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={!loading && <ArrowForwardIcon className="group-hover:!translate-x-1 !transition-transform" />}
                className="
                !bg-gradient-to-r !from-blue-600 !to-indigo-700
                !py-2 !min-h-[42px] !rounded-xl !font-semibold !normal-case
                !shadow-lg !shadow-blue-700/30
                "
              >
                {loading ? <LoadingSpinner size={22} color="#fff" /> : "Send OTP"}
              </Button>
            </motion.div>

            <p className="text-center text-gray-500">
              Remembered it?
              <span
                onClick={() => navigate("/login")}
                className="text-blue-700 font-bold ml-1 cursor-pointer hover:underline underline-offset-4"
              >
                Back to login
              </span>
            </p>
          </form>
        </>
      )}

      {step === "otp" && (
        <>
          <h2 className="text-3xl font-bold text-gray-800">Verify Code</h2>
          <p className="text-gray-500 mt-2 mb-8">
            Enter the OTP sent to <span className="font-semibold">{email}</span>
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <TextField
              fullWidth
              label="Enter OTP"
              type="text"
              size="small"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              inputProps={{ maxLength: 6, style: { letterSpacing: "0.5em", textAlign: "center" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" className="!text-gray-400" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <motion.div whileHover={{ y: loading ? 0 : -3 }} whileTap={{ scale: 0.98 }} className="group">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || otp.length < 4}
                endIcon={!loading && <ArrowForwardIcon className="group-hover:!translate-x-1 !transition-transform" />}
                className="
                !bg-gradient-to-r !from-blue-600 !to-indigo-700
                !py-2 !min-h-[42px] !rounded-xl !font-semibold !normal-case
                !shadow-lg !shadow-blue-700/30
                "
              >
                {loading ? <LoadingSpinner size={22} color="#fff" /> : "Verify OTP"}
              </Button>
            </motion.div>

            <p className="text-center text-gray-500">
              Didn't get the code?
              <span
                onClick={!loading ? handleResendOtp : undefined}
                className="text-blue-700 font-bold ml-1 cursor-pointer hover:underline underline-offset-4"
              >
                Resend OTP
              </span>
            </p>

            <p className="text-center text-gray-500">
              <span
                onClick={() => setStep("email")}
                className="text-gray-500 font-semibold cursor-pointer hover:underline underline-offset-4"
              >
                Change email
              </span>
            </p>
          </form>
        </>
      )}

      {step === "reset" && (
        <>
          <h2 className="text-3xl font-bold text-gray-800">Set New Password</h2>
          <p className="text-gray-500 mt-2 mb-8">
            Choose a strong new password for your account
          </p>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              size="small"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" className="!text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? (
                        <VisibilityOffIcon fontSize="small" className="!text-gray-400" />
                      ) : (
                        <VisibilityIcon fontSize="small" className="!text-gray-400" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" className="!text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                      {showConfirmPassword ? (
                        <VisibilityOffIcon fontSize="small" className="!text-gray-400" />
                      ) : (
                        <VisibilityIcon fontSize="small" className="!text-gray-400" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <motion.div whileHover={{ y: loading ? 0 : -3 }} whileTap={{ scale: 0.98 }} className="group">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={!loading && <ArrowForwardIcon className="group-hover:!translate-x-1 !transition-transform" />}
                className="
                !bg-gradient-to-r !from-blue-600 !to-indigo-700
                !py-2 !min-h-[42px] !rounded-xl !font-semibold !normal-case
                !shadow-lg !shadow-blue-700/30
                "
              >
                {loading ? <LoadingSpinner size={22} color="#fff" /> : "Reset Password"}
              </Button>
            </motion.div>
          </form>
        </>
      )}

      {step === "done" && (
        <div className="text-center py-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">All set!</h2>
          <p className="text-gray-600">
            Your password has been reset successfully.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 text-blue-700 font-semibold hover:underline underline-offset-4"
          >
            Back to login
          </button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;