import { Button } from "@mui/material";
import { motion } from "framer-motion";

const MotionButton = motion.create(Button);

/**
 * Primary gradient button with a soft glow that intensifies on hover,
 * and outlined variant for secondary actions.
 */
export default function GlowButton({ children, variant = "primary", size = "large", ...props }) {
  const isPrimary = variant === "primary";

  return (
    <MotionButton
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      size={size}
      disableElevation
      sx={
        isPrimary
          ? {
              background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
              color: "#fff",
              boxShadow: "0 8px 30px rgba(37, 99, 235, 0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
                boxShadow: "0 14px 40px rgba(37, 99, 235, 0.55)",
              },
            }
          : {
              color: "#1E3A8A",
              borderColor: "rgba(37, 99, 235, 0.35)",
              border: "1.5px solid",
              backgroundColor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(6px)",
              "&:hover": {
                borderColor: "#2563EB",
                backgroundColor: "rgba(37,99,235,0.06)",
              },
            }
      }
      {...props}
    >
      {children}
    </MotionButton>
  );
}
