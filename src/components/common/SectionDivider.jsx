import { Box } from "@mui/material";
import { motion } from "framer-motion";

/**
 * Signature divider: a soft blue wave with a dashed "lane marking" line
 * that draws itself in on scroll — a quiet nod to the product's subject
 * (parking lanes / road markings) instead of a generic decorative wave.
 *
 * @param {"light"|"dark"} tone - "light" sits on white/canvas backgrounds,
 *   "dark" sits on top of the primary gradient sections.
 * @param {boolean} flip - flips the wave vertically
 */
export default function SectionDivider({ tone = "light", flip = false }) {
  const waveFill = tone === "light" ? "#F5F8FF" : "#1E3A8A";
  const laneColor = tone === "light" ? "#2563EB" : "#FFFFFF";

  return (
    <Box
      component="div"
      sx={{
        width: "100%",
        lineHeight: 0,
        transform: flip ? "scaleY(-1)" : "none",
        position: "relative",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        width="100%"
        height="90"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <path
          d="M0,64 C 240,120 480,10 720,50 C 960,90 1200,20 1440,64 L1440,120 L0,120 Z"
          fill={waveFill}
        />
        <motion.path
          d="M0,64 C 240,120 480,10 720,50 C 960,90 1200,20 1440,64"
          fill="none"
          stroke={laneColor}
          strokeWidth="3"
          strokeDasharray="18 16"
          strokeLinecap="round"
          opacity={tone === "light" ? 0.35 : 0.45}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </svg>
    </Box>
  );
}
