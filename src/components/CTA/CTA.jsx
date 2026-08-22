import { Box, Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import GlowButton from "../common/GlowButton";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      id="pricing"
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 15% 30%, rgba(255,255,255,0.12) 0, transparent 35%), radial-gradient(circle at 85% 70%, rgba(255,255,255,0.1) 0, transparent 35%)",
        }}
      />
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Stack alignItems="center" textAlign="center" spacing={4}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, color: "#fff" }}
            >
              Ready to Park Smarter?
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 480 }}>
              Join thousands of drivers and operators who've already made
              parking effortless with Parking Expert.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <GlowButton
                endIcon={<HiArrowRight />}
                onClick={() => navigate("/signup")}
                sx={{
                  background: "#fff",
                  color: "#1E3A8A",
                  "&:hover": { background: "#fff", boxShadow: "0 14px 40px rgba(0,0,0,0.25)" },
                }}
              >
                Get Started
              </GlowButton>
              <GlowButton
                variant="secondary"
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.5)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.16)" },
                }}
              >
                Contact Us
              </GlowButton>
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
