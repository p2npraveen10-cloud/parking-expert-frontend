import React from "react";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, text }) => (
  <motion.div
    whileHover={{
      y: -5,
      backgroundColor: "rgba(255,255,255,0.16)",
      borderColor: "rgba(255,255,255,0.35)",
    }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center gap-3 border border-white/20 cursor-pointer"
  >
    <motion.div whileHover={{ rotate: 12, scale: 1.15 }}>{icon}</motion.div>
    <p className="font-medium">{text}</p>
  </motion.div>
);

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-100 overflow-hidden">
      {/* LEFT SIDE — shared branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white items-center px-20 overflow-hidden"
      >
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -15, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-96 h-96 rounded-full bg-white/10 -top-32 -right-20"
        />
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-80 h-80 rounded-full bg-blue-400/20 bottom-10 -left-20"
        />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 12 }}
              className="bg-white text-blue-700 p-4 rounded-2xl shadow-xl cursor-pointer"
            >
              <LocalParkingIcon fontSize="large" />
            </motion.div>
            <h1 className="text-4xl font-extrabold tracking-tight">Parking Expert</h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl font-bold leading-[1.15]"
          >
            Smart Parking
            <br />
            Made Simple
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-7 text-lg text-blue-100 max-w-lg leading-relaxed"
          >
            A powerful vehicle parking management platform that helps you
            manage slots, track vehicles, and improve parking operations.
          </motion.p>

          <div className="flex gap-5 mt-12">
            <FeatureCard icon={<DirectionsCarIcon />} text="Vehicle Tracking" />
            <FeatureCard icon={<SecurityIcon />} text="Secure System" />
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE — page-specific card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10"
        >
          {/* Mobile-only logo, since the branded panel is hidden below lg */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex items-center gap-2 text-blue-700">
              <LocalParkingIcon fontSize="large" />
              <h1 className="text-3xl font-bold">Parking Expert</h1>
            </div>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;