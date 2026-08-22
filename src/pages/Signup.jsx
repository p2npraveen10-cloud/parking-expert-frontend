import React, { useMemo, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { motion, AnimatePresence } from "framer-motion";
import { registerUser } from "../serviceCalls/apiCall";

const STEPS = ["Your details", "Company details", "Account security"];

const emptyForm = {
  firstName: "",
  lastName: "",
  emailId: "",
  contactNo: "",
  dateOfBirth: "",
  address: "",
  // profile: "",
  gender: "",
  companyName: "",
  companyDescription: "",
  companyAddress: "",
  companyEmail: "",
  companyContactNo: "",
  gstNumber: "",
  password: "",
};

// ---------------------------------------------------------------------------
// Ambient "occupancy grid" — a faint grid of parking bays where roughly half
// randomly cycle between empty and filled. Only opacity is animated
// (not background-color) so it stays GPU-cheap. Respects reduced-motion.
// ---------------------------------------------------------------------------
const ParkingGridBackground = ({ prefersReducedMotion }) => {
  const cells = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 3,
        willFill: Math.random() > 0.55,
      })),
    []
  );

  return (
    <div
      className="absolute inset-0 grid grid-cols-6 gap-3 p-10"
      style={{ gridTemplateRows: "repeat(8, 1fr)" }}
    >
      {cells.map((cell) => (
        <div
          key={cell.id}
          className="relative rounded-md border"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          {cell.willFill && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0.5 rounded-md"
              style={{ backgroundColor: "#60A5FA" }}
              animate={{ opacity: [0, 0, 0.4, 0.4, 0] }}
              transition={{
                duration: cell.duration * 2,
                repeat: Infinity,
                delay: cell.delay,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const Signup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(emptyForm);
  const [dobValue, setDobValue] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const handleDobChange = (newValue) => {
    setDobValue(newValue);
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: newValue && newValue.isValid() ? newValue.format("YYYY-MM-DD") : "",
    }));
    if (fieldErrors.dateOfBirth) {
      setFieldErrors((prev) => ({ ...prev, dateOfBirth: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[6-9]\d{9}$/;
  const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      if (!formData.firstName.trim()) errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.emailId.trim()) {
        errors.emailId = "Email is required";
      } else if (!emailPattern.test(formData.emailId)) {
        errors.emailId = "Enter a valid email address";
      }
      if (!formData.contactNo.trim()) {
        errors.contactNo = "Contact number is required";
      } else if (!phonePattern.test(formData.contactNo.trim())) {
        errors.contactNo = "Enter a valid 10-digit mobile number";
      }
      if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) errors.gender = "Please select a gender";
      if (!formData.address.trim()) errors.address = "Address is required";
      // if (!formData.profile.trim()) errors.profile = "Profile / role is required";
    }

    if (step === 1) {
      if (!formData.companyName.trim()) errors.companyName = "Company name is required";
      if (!formData.companyAddress.trim())
        errors.companyAddress = "Company address is required";
      if (!formData.companyEmail.trim()) {
        errors.companyEmail = "Company email is required";
      } else if (!emailPattern.test(formData.companyEmail)) {
        errors.companyEmail = "Enter a valid email address";
      }
      if (!formData.companyContactNo.trim()) {
        errors.companyContactNo = "Company contact number is required";
      } else if (!phonePattern.test(formData.companyContactNo.trim())) {
        errors.companyContactNo = "Enter a valid 10-digit mobile number";
      }
      if (formData.gstNumber.trim() && !gstPattern.test(formData.gstNumber.trim())) {
        errors.gstNumber = "Enter a valid 15-character GST number";
      }
    }

    if (step === 2) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password =
          "Include at least one uppercase letter, lowercase letter, and number";
      }
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (confirmPassword !== formData.password) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    setApiError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setApiError("");
    setFieldErrors({});
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setLoading(true);
    setApiError("");

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      emailId: formData.emailId.trim(),
      contactNo: formData.contactNo.trim(),
      dateOfBirth: formData.dateOfBirth,
      address: formData.address.trim(),
      // profile: formData.profile.trim(),
      password: formData.password,
      gender: formData.gender,
      companyName: formData.companyName.trim(),
      companyDescription: formData.companyDescription.trim(),
      companyAddress: formData.companyAddress.trim(),
      companyEmail: formData.companyEmail.trim(),
      companyContactNo: formData.companyContactNo.trim(),
      gstNumber: formData.gstNumber.trim(),
    };

    try {
      await registerUser(payload);
      window.location.href = "/login?registered=1";
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? "An account with this email already exists"
          : "Something went wrong. Please try again.");
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    window.location.href = "/login";
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      transition: "all 0.25s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563EB" },
      "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.14)" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#2563EB",
        borderWidth: "2px",
      },
    },
    "& .MuiInputBase-input": { paddingTop: "10px", paddingBottom: "10px" },
  };

  const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
  const fieldIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
        {/* LEFT — brand / ambient parking-lot panel (hidden on small screens) */}
        <div
          className="hidden md:flex md:w-[44%] relative flex-col justify-between overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(160deg, #2563EB 0%, #1E3A8A 45%, #1E1B4B 100%)",
          }}
        >
          <ParkingGridBackground prefersReducedMotion={prefersReducedMotion} />

          {/* sensor sweep */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-x-0 h-48 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(147,197,253,0.18), transparent)",
                mixBlendMode: "screen",
              }}
              initial={{ top: "-25%" }}
              animate={{ top: ["-25%", "125%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* soft glow circles, matching the reference screenshot */}
          <div
            className="absolute -top-24 right-0 w-96 h-96 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          />
          <div
            className="absolute bottom-0 -left-20 w-80 h-80 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />

          {/* subtle vignette so text stays readable over the grid */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 0% 0%, rgba(30,58,138,0.15), rgba(30,27,75,0.75))",
            }}
          />

          <div className="relative z-10 p-10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white">
                <LocalParkingIcon sx={{ color: "#2563EB", fontSize: 20 }} />
              </div>
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Parking Expert
              </span>
            </div>

            <div className="mt-16 max-w-sm">
              <h2
                className="text-white text-3xl font-bold leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Every spot,
                <br />
                accounted for.
              </h2>
              <p className="text-blue-100/80 mt-4 text-sm leading-relaxed">
                Set up your facility once — track occupancy, manage vehicles,
                and run reports from a single dashboard.
              </p>
            </div>
          </div>

          {/* step rail */}
          <div className="relative z-10 p-10">
            <div className="relative pl-6">
              <div
                className="absolute left-[3px] top-1 bottom-1 w-px"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 6px, transparent 6px, transparent 14px)",
                }}
              />
              {STEPS.map((label, i) => (
                <div key={label} className="relative flex items-center gap-3 py-2.5">
                  <span
                    className="absolute -left-[21px] w-2 h-2 rounded-full transition-colors"
                    style={{
                      backgroundColor: i <= activeStep ? "#93C5FD" : "rgba(255,255,255,0.2)",
                    }}
                  />
                  <span
                    className={`text-sm transition-colors ${
                      i === activeStep ? "text-white font-semibold" : "text-blue-200/60"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
          <div className="w-full max-w-xl mx-auto">
            {/* mobile-only logo + step label, since left panel is hidden */}
            <div className="md:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
                <LocalParkingIcon sx={{ color: "#fff", fontSize: 18 }} />
              </div>
              <span
                className="font-bold text-lg text-gray-800"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Parking Expert
              </span>
            </div>

            <h2
              className="text-3xl font-bold text-gray-800"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Create your account
            </h2>
            <p className="text-gray-500 mt-2 mb-2">
              Set up your profile and company in a few quick steps
            </p>
            <p className="md:hidden text-sm font-medium text-gray-400 mb-6">
              Step {activeStep + 1} of {STEPS.length} — {STEPS[activeStep]}
            </p>

            <div className="relative h-1 w-full bg-slate-100 rounded-full mb-8 overflow-hidden md:mt-8">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700"
                animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
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

            <form onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step0"
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, x: -30 }}
                    variants={stagger}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    <motion.div
                      variants={fieldIn}
                      className="md:col-span-2 flex items-center gap-2 text-gray-400 text-sm font-semibold uppercase tracking-wide"
                    >
                      <PersonOutlineIcon fontSize="small" /> Personal details
                    </motion.div>

                    <motion.div variants={fieldIn}>
                      <TextField
                        name="firstName"
                        label="First Name"
                        size="small"
                        fullWidth
                        value={formData.firstName}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.firstName)}
                        helperText={fieldErrors.firstName}
                        sx={textFieldSx}
                      />
                    </motion.div>
                    <motion.div variants={fieldIn}>
                      <TextField
                        name="lastName"
                        label="Last Name"
                        size="small"
                        fullWidth
                        value={formData.lastName}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.lastName)}
                        helperText={fieldErrors.lastName}
                        sx={textFieldSx}
                      />
                    </motion.div>

                    <motion.div variants={fieldIn}>
                      <TextField
                        name="emailId"
                        label="Email Address"
                        type="email"
                        size="small"
                        fullWidth
                        value={formData.emailId}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.emailId)}
                        helperText={fieldErrors.emailId}
                        sx={textFieldSx}
                      />
                    </motion.div>
                    <motion.div variants={fieldIn}>
                      <TextField
                        name="contactNo"
                        label="Contact Number"
                        size="small"
                        fullWidth
                        value={formData.contactNo}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.contactNo)}
                        helperText={fieldErrors.contactNo}
                        sx={textFieldSx}
                      />
                    </motion.div>

                    {/* Date of birth — modern single calendar picker */}
                    <motion.div variants={fieldIn}>
                      <DatePicker
                        label="Date of Birth"
                        value={dobValue}
                        onChange={handleDobChange}
                        maxDate={dayjs().subtract(18, "year")}
                        minDate={dayjs().subtract(100, "year")}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: Boolean(fieldErrors.dateOfBirth),
                            helperText: fieldErrors.dateOfBirth,
                            sx: textFieldSx,
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div variants={fieldIn}>
                      <TextField
                        name="gender"
                        label="Gender"
                        select
                        size="small"
                        fullWidth
                        value={formData.gender}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.gender)}
                        helperText={fieldErrors.gender}
                        sx={textFieldSx}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </motion.div>

                    {/* <motion.div variants={fieldIn}>
                      <TextField
                        name="profile"
                        label="Profile / Role"
                        size="small"
                        fullWidth
                        placeholder="e.g. Software Engineer"
                        value={formData.profile}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.profile)}
                        helperText={fieldErrors.profile}
                        sx={textFieldSx}
                      />
                    </motion.div> */}

                    <motion.div variants={fieldIn} className="md:col-span-2">
                      <TextField
                        name="address"
                        label="Address"
                        size="small"
                        fullWidth
                        multiline
                        minRows={2}
                        value={formData.address}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.address)}
                        helperText={fieldErrors.address}
                        sx={textFieldSx}
                      />
                    </motion.div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, x: -30 }}
                    variants={stagger}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    <motion.div
                      variants={fieldIn}
                      className="md:col-span-2 flex items-center gap-2 text-gray-400 text-sm font-semibold uppercase tracking-wide"
                    >
                      <BusinessOutlinedIcon fontSize="small" /> Company details
                    </motion.div>

                    <motion.div variants={fieldIn} className="md:col-span-2">
                      <TextField
                        name="companyName"
                        label="Company Name"
                        size="small"
                        fullWidth
                        value={formData.companyName}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.companyName)}
                        helperText={fieldErrors.companyName}
                        sx={textFieldSx}
                      />
                    </motion.div>

                    <motion.div variants={fieldIn} className="md:col-span-2">
                      <TextField
                        name="companyDescription"
                        label="Company Description"
                        size="small"
                        fullWidth
                        multiline
                        minRows={2}
                        value={formData.companyDescription}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.companyDescription)}
                        helperText={fieldErrors.companyDescription}
                        sx={textFieldSx}
                      />
                    </motion.div>

                    <motion.div variants={fieldIn} className="md:col-span-2">
                      <TextField
                        name="companyAddress"
                        label="Company Address"
                        size="small"
                        fullWidth
                        multiline
                        minRows={2}
                        value={formData.companyAddress}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.companyAddress)}
                        helperText={fieldErrors.companyAddress}
                        sx={textFieldSx}
                      />
                    </motion.div>

                    <motion.div variants={fieldIn}>
                      <TextField
                        name="companyEmail"
                        label="Company Email"
                        type="email"
                        size="small"
                        fullWidth
                        value={formData.companyEmail}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.companyEmail)}
                        helperText={fieldErrors.companyEmail}
                        sx={textFieldSx}
                      />
                    </motion.div>
                    <motion.div variants={fieldIn}>
                      <TextField
                        name="companyContactNo"
                        label="Company Contact Number"
                        size="small"
                        fullWidth
                        value={formData.companyContactNo}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.companyContactNo)}
                        helperText={fieldErrors.companyContactNo}
                        sx={textFieldSx}
                      />
                    </motion.div>

                    <motion.div variants={fieldIn} className="md:col-span-2">
                      <TextField
                        name="gstNumber"
                        label="GST Number (optional)"
                        size="small"
                        fullWidth
                        value={formData.gstNumber}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.gstNumber)}
                        helperText={fieldErrors.gstNumber}
                        sx={textFieldSx}
                      />
                    </motion.div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, x: -30 }}
                    variants={stagger}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 gap-5"
                  >
                    <motion.div
                      variants={fieldIn}
                      className="flex items-center gap-2 text-gray-400 text-sm font-semibold uppercase tracking-wide"
                    >
                      <LockOutlinedIcon fontSize="small" /> Account security
                    </motion.div>

                    <motion.div variants={fieldIn}>
                      <TextField
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        size="small"
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.password)}
                        helperText={fieldErrors.password || "At least 8 characters, with upper, lower & a number"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((p) => !p)}
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
                        sx={textFieldSx}
                      />
                    </motion.div>

                    <motion.div variants={fieldIn}>
                      <TextField
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirm ? "text" : "password"}
                        size="small"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (fieldErrors.confirmPassword) {
                            setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                          }
                        }}
                        error={Boolean(fieldErrors.confirmPassword)}
                        helperText={fieldErrors.confirmPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirm((p) => !p)}
                                edge="end"
                                size="small"
                                tabIndex={-1}
                              >
                                {showConfirm ? (
                                  <VisibilityOff fontSize="small" className="!text-gray-400" />
                                ) : (
                                  <Visibility fontSize="small" className="!text-gray-400" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={textFieldSx}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-10">
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={activeStep === 0 || loading}
                  startIcon={<ArrowBackIcon />}
                  className="!normal-case !rounded-xl !text-gray-600"
                  sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
                >
                  Back
                </Button>

                {activeStep < STEPS.length - 1 ? (
                  <motion.div whileHover={{ y: -3 }} whileTap={{ y: 0, scale: 0.98 }}>
                    <Button
                      type="button"
                      onClick={handleNext}
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      className="!bg-gradient-to-r !from-blue-600 !to-indigo-700 hover:!from-blue-500 hover:!to-indigo-600 !py-2 !px-6 !rounded-xl !font-semibold !normal-case !shadow-lg !shadow-blue-700/30"
                    >
                      Continue
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ y: loading ? 0 : -3 }} whileTap={{ y: 0, scale: 0.98 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      className="!bg-gradient-to-r !from-blue-600 !to-indigo-700 hover:!from-blue-500 hover:!to-indigo-600 !py-2 !px-6 !rounded-xl !font-semibold !normal-case !shadow-lg !shadow-blue-700/30 disabled:!opacity-70"
                    >
                      {loading ? (
                        <CircularProgress size={22} thickness={5} className="!text-white" />
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </form>

            <Divider className="!my-8" />

            <p className="text-center text-gray-500">
              Already have an account?
              <span
                onClick={handleGoToLogin}
                className="text-blue-700 font-bold ml-1 cursor-pointer hover:underline underline-offset-4"
              >
                Log In
              </span>
            </p>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Signup;