import { Box, Container, Grid, Typography, Stack, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { TbStarFilled, TbCarGarage, TbThumbUp } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import GlowButton from "../common/GlowButton";
import FloatingBackground from "../common/FloatingBackground";
import HeroDashboardMockup from "./HeroDashboardMockup";

const stats = [
  { icon: <TbStarFilled color="#2563EB" />, label: "10K+ Users" },
  { icon: <TbCarGarage color="#2563EB" />, label: "500+ Parking Areas" },
  { icon: <TbThumbUp color="#2563EB" />, label: "98% Satisfaction" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function Hero() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: "relative",
        pt: { xs: 16, md: 20 },
        pb: { xs: 10, md: 14 },
        overflow: "hidden",
        background: "linear-gradient(180deg, #F5F8FF 0%, #EFF3FF 100%)",
      }}
    >
      <FloatingBackground variant="hero" />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 8, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <Typography
                variant="overline"
                sx={{
                  color: "#1E3A8A",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  bgcolor: "rgba(37,99,235,0.08)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  display: "inline-block",
                  mb: 2,
                }}
              >
                Effortless urban parking
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.6rem", sm: "3.2rem", md: "3.8rem" },
                  lineHeight: 1.08,
                  color: "#0F172A",
                  mb: 3,
                }}
              >
                Smart Parking
                <br />
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Made Smarter.
                </Box>
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
              <Typography
                variant="h6"
                sx={{ color: "#475569", fontWeight: 400, mb: 4, maxWidth: 480, lineHeight: 1.6 }}
              >
                Find nearby parking slots, reserve instantly, manage bookings
                and park without stress.
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 5 }}>
                <GlowButton
                  endIcon={<HiArrowRight />}
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </GlowButton>
                <GlowButton variant="secondary" onClick={() => scrollTo("#features")}>
                  Explore Features
                </GlowButton>
              </Stack>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 4 }}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", sm: "block" } }}
                  />
                }
              >
                {stats.map((s) => (
                  <Stack key={s.label} direction="row" spacing={1} alignItems="center">
                    {s.icon}
                    <Typography variant="body2" fontWeight={700} color="#0F172A">
                      {s.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <HeroDashboardMockup />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
