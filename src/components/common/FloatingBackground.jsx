import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { PiCarProfileDuotone, PiSteeringWheelDuotone } from "react-icons/pi";
import { TbParkingCircle } from "react-icons/tb";
import { MdOutlineEvStation } from "react-icons/md";

/**
 * Soft floating gradient blobs + faint parking-related icons.
 * Purely decorative — aria-hidden, pointer-events disabled.
 */
export default function FloatingBackground({ variant = "default", icons = true }) {
  const blobBase = {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(70px)",
    pointerEvents: "none",
  };

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          ...blobBase,
          width: 480,
          height: 480,
          top: "-10%",
          left: "-8%",
          background: "radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0) 70%)",
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          ...blobBase,
          width: 420,
          height: 420,
          top: "10%",
          right: "-6%",
          background: "radial-gradient(circle, rgba(30,58,138,0.30) 0%, rgba(30,58,138,0) 70%)",
        }}
      />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          ...blobBase,
          width: 360,
          height: 360,
          bottom: "-8%",
          left: "20%",
          background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0) 70%)",
        }}
      />

      {icons && variant === "hero" && (
        <>
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: "18%", left: "6%", opacity: 0.16 }}
          >
            <PiCarProfileDuotone size={56} color="#1E3A8A" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            style={{ position: "absolute", top: "62%", left: "12%", opacity: 0.14 }}
          >
            <TbParkingCircle size={48} color="#2563EB" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            style={{ position: "absolute", top: "8%", right: "10%", opacity: 0.14 }}
          >
            <MdOutlineEvStation size={50} color="#1E3A8A" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            style={{ position: "absolute", bottom: "14%", right: "6%", opacity: 0.14 }}
          >
            <PiSteeringWheelDuotone size={46} color="#2563EB" />
          </motion.div>
        </>
      )}
    </Box>
  );
}
