import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";

import LocalParkingIcon from "@mui/icons-material/LocalParking";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import { loginUser, getGoogleOAuthRedirectUrl } from '../serviceCalls/apiCall';



const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="m6.3 14.7 6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.1 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.6C41.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
    />
  </svg>
);

const Login = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear the error for this field as soon as the user edits it
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const validate = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------------------------------------------------
  // Email / password login
  // -------------------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe,
      });
      const {
        accessToken,
        expiresIn,
        firstName,
        lastName,
        emailId,
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
        // Guard against ever again silently storing "undefined" as the token
        throw new Error("Login response did not include an access token");
      }

      const user = {
        firstName,
        lastName,
        emailId,
        contactNo,
        dateOfBirth,
        profile,
        companyName,
        companyEmail,
        companyContactNo,
        gstNumber,
        companyLogo,
      };
      localStorage.setItem("token", accessToken);
      if (expiresIn) {
        localStorage.setItem(
          "tokenExpiresAt",
          String(Date.now() + expiresIn * 1000)
        );
      }
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(
        "Login Successful",
        `Welcome back, ${firstName}!`
      );
      if (onLoginSuccess) {
        onLoginSuccess(user);
      } else {
          navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err.message ||
        (err.status === 401
          ? "Incorrect email or password"
          : "Something went wrong. Please try again.");
          console.log(err);
      setApiError(message);

      // toast.error(
      //   "Login Failed",
      //   message
      // );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Google OAuth login
  // -------------------------------------------------------------------------
  const handleGoogleLogin = async () => {
    setApiError("");
    setGoogleLoading(true);

    try {
      toast.info(
        "Redirecting",
        "Redirecting to Google Sign-In..."
      );

      window.location.href = getGoogleOAuthRedirectUrl();

    } catch (err) {
      toast.error(
        "Google Login Failed",
        "Please try again."
      );
      setApiError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password";
  };

  const handleCreateAccount = () => {
    window.location.href = "/signup";
  };

  return (
    <div
      className="
      min-h-screen 
      flex 
      bg-slate-100
      overflow-hidden
    "
    >
      {/* LEFT SIDE */}

      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="
        hidden
        lg:flex
        w-1/2
        relative
        bg-gradient-to-br
        from-blue-700
        via-blue-800
        to-indigo-950
        text-white
        items-center
        px-20
        overflow-hidden
        "
      >
        {/* Floating shapes */}

        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            rotate: [0, 20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
          absolute
          w-96
          h-96
          rounded-full
          bg-white/10
          -top-32
          -right-20
          "
        />

        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
          absolute
          w-80
          h-80
          rounded-full
          bg-blue-400/20
          bottom-10
          -left-20
          "
        />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
            flex
            items-center
            gap-4
            mb-10
            "
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 12 }}
              className="
              bg-white
              text-blue-700
              p-4
              rounded-2xl
              shadow-xl
              cursor-pointer
              "
            >
              <LocalParkingIcon fontSize="large" />
            </motion.div>

            <h1
              className="
            text-4xl
            font-extrabold
            tracking-tight
            "
            >
              Parking Expert
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="
          text-5xl
          font-bold
          leading-[1.15]
          "
          >
            Smart Parking
            <br />
            Made Simple
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="
          mt-7
          text-lg
          text-blue-100
          max-w-lg
          leading-relaxed
          "
          >
            A powerful vehicle parking management platform that helps you
            manage slots, track vehicles, and improve parking operations.
          </motion.p>

          <div
            className="
          flex
          gap-5
          mt-12
          "
          >
            <FeatureCard icon={<DirectionsCarIcon />} text="Vehicle Tracking" />

            <FeatureCard icon={<SecurityIcon />} text="Secure System" />
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE */}

      <div
        className="
      w-full
      lg:w-1/2
      flex
      items-center
      justify-center
      p-6
      "
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 40,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
          bg-white
          rounded-3xl
          shadow-2xl
          w-full
          max-w-md
          p-8
          md:p-10
          "
        >
          {/* LOGO */}

          <div
            className="
          flex
          justify-center
          mb-8
          lg:hidden
          "
          >
            <div
              className="
            flex
            items-center
            gap-2
            text-blue-700
            "
            >
              <LocalParkingIcon fontSize="large" />

              <h1
                className="
              text-3xl
              font-bold
              "
              >
                Parking Expert
              </h1>
            </div>
          </div>

          <h2
            className="
          text-3xl
          font-bold
          text-gray-800
          "
          >
            Welcome Back 👋
          </h2>

          <p
            className="
          text-gray-500
          mt-2
          mb-8
          "
          >
            Login to access your parking dashboard
          </p>

          <motion.div
            whileHover={{ y: googleLoading ? 0 : -3 }}
            whileTap={{ y: 0, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button
              fullWidth
              variant="outlined"
              disabled={googleLoading}
              onClick={handleGoogleLogin}
              startIcon={
                googleLoading ? (
                  <CircularProgress size={18} thickness={5} />
                ) : (
                  <GoogleLogo />
                )
              }
              className="
              !py-2
              !min-h-[42px]
              !rounded-xl
              !border-gray-300
              !text-gray-700
              !font-semibold
              !normal-case
              !transition-all
              !duration-300
              hover:!border-blue-300
              hover:!shadow-[0_8px_20px_-8px_rgba(29,78,216,0.35)]
              hover:!bg-blue-50/40
              "
            >
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </Button>
          </motion.div>

          <div
            className="
          flex
          items-center
          gap-3
          my-7
          "
          >
            <Divider className="flex-1" />

            <span
              className="
            text-sm
            text-gray-400
            "
            >
              OR
            </span>

            <Divider className="flex-1" />
          </div>

          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                <Alert severity="error" className="!rounded-xl">
                  {apiError}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              variant="outlined"
              size="small"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" className="!text-gray-400" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  transition: "all 0.25s ease",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1d4ed8",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 4px rgba(29, 78, 216, 0.12)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1d4ed8",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": {
                  paddingTop: "10px",
                  paddingBottom: "10px",
                },
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              size="small"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" className="!text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" className="!text-gray-400" />
                      ) : (
                        <Visibility fontSize="small" className="!text-gray-400" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  transition: "all 0.25s ease",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1d4ed8",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 4px rgba(29, 78, 216, 0.12)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1d4ed8",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": {
                  paddingTop: "10px",
                  paddingBottom: "10px",
                },
              }}
            />

            <div
              className="
            flex
            justify-between
            items-center
            "
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
              />

              <button
                type="button"
                onClick={handleForgotPassword}
                className="
              relative
              text-blue-700
              text-sm
              font-semibold
              transition-colors
              duration-200
              hover:text-indigo-700
              after:content-['']
              after:absolute
              after:left-0
              after:-bottom-0.5
              after:h-[1.5px]
              after:w-0
              after:bg-indigo-700
              after:transition-all
              after:duration-300
              hover:after:w-full
              "
              >
                Forgot password?
              </button>
            </div>

            <motion.div
              whileHover={{ y: loading ? 0 : -3 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="pt-1 group"
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={
                  !loading && (
                    <ArrowForwardIcon className="!transition-transform !duration-300 group-hover:!translate-x-1" />
                  )
                }
                className="
              !bg-gradient-to-r
              !from-blue-600
              !to-indigo-700
              hover:!from-blue-500
              hover:!to-indigo-600
              !py-2
              !min-h-[42px]
              !rounded-xl
              !text-base
              !font-semibold
              !normal-case
              !shadow-lg
              !shadow-blue-700/30
              !transition-all
              !duration-300
              hover:!shadow-xl
              hover:!shadow-blue-600/50
              disabled:!opacity-70
              "
              >
                {loading ? (
                  <CircularProgress size={22} thickness={5} className="!text-white" />
                ) : (
                  "Login"
                )}
              </Button>
            </motion.div>
          </form>

          <p
            className="
          text-center
          mt-8
          text-gray-500
          "
          >
            Don't have an account?
            <span
              onClick={handleCreateAccount}
              className="
            relative
            text-blue-700
            font-bold
            ml-1
            cursor-pointer
            transition-colors
            duration-200
            hover:text-indigo-700
            after:content-['']
            after:absolute
            after:left-0
            after:-bottom-0.5
            after:h-[1.5px]
            after:w-0
            after:bg-indigo-700
            after:transition-all
            after:duration-300
            hover:after:w-full
            "
            >
              Create Account
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, text }) => (
  <motion.div
    whileHover={{
      y: -5,
      backgroundColor: "rgba(255,255,255,0.16)",
      borderColor: "rgba(255,255,255,0.35)",
    }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    className="
bg-white/10
backdrop-blur-md
rounded-2xl
px-5
py-4
flex
items-center
gap-3
border
border-white/20
cursor-pointer
"
  >
    <motion.div whileHover={{ rotate: 12, scale: 1.15 }}>{icon}</motion.div>

    <p className="font-medium">{text}</p>
  </motion.div>
);

export default Login;