import React from "react";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

/**
 * Small inline spinner — use inside buttons, cards, or next to text.
 *   <LoadingSpinner size={18} />
 */
export const LoadingSpinner = ({ size = 24, thickness = 4.5, color = "inherit" }) => (
  <CircularProgress size={size} thickness={thickness} sx={{ color }} />
);

/**
 * Full-screen loading overlay — use as the Suspense fallback for
 * lazy-loaded routes, or during any blocking full-page operation.
 *   <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}>...} />
 */
export const PageLoader = ({ label = "Loading..." }) => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-700"
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-gray-500 text-sm font-medium tracking-wide"
    >
      {label}
    </motion.p>
  </div>
);

/**
 * Thin fixed top-of-page progress bar — good for "navigating between
 * routes" or background API calls that shouldn't block the whole UI.
 *   {isFetching && <TopProgressBar />}
 */
export const TopProgressBar = () => (
  <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-blue-100 overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: "40%" }}
    />
  </div>
);

export default LoadingSpinner;