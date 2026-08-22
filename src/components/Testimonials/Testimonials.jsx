import { useRef, useState } from "react";
import { Box, Container, Typography, Card, Stack, Avatar, Divider } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { TbStarFilled, TbQuote } from "react-icons/tb";

// Each testimonial gets its own accent story instead of one repeated blue —
// distinct people, distinct color signatures, same underlying system.
const themes = {
  cobalt: {
    grad: "linear-gradient(135deg, #2563EB, #1E3A8A)",
    soft: "rgba(37,99,235,0.08)",
    glow: "rgba(37,99,235,0.35)",
    quote: "rgba(37,99,235,0.10)",
    text: "#1E3A8A",
  },
  violet: {
    grad: "linear-gradient(135deg, #8B5CF6, #4C1D95)",
    soft: "rgba(139,92,246,0.09)",
    glow: "rgba(139,92,246,0.35)",
    quote: "rgba(139,92,246,0.10)",
    text: "#5B21B6",
  },
  teal: {
    grad: "linear-gradient(135deg, #0EA5A0, #0F766E)",
    soft: "rgba(13,148,136,0.09)",
    glow: "rgba(13,148,136,0.32)",
    quote: "rgba(13,148,136,0.10)",
    text: "#0F766E",
  },
};

const testimonials = [
  {
    name: "Ananya Rao",
    role: "Daily Commuter",
    review:
      "I used to waste twenty minutes circling my office block. Now I reserve my spot before I even leave home.",
    initials: "AR",
    metric: "20 min saved / day",
    theme: "cobalt",
  },
  {
    name: "Marcus Chen",
    role: "Facility Manager, Skyline Mall",
    review:
      "The occupancy dashboard alone paid for itself — we finally know which levels fill up and when.",
    initials: "MC",
    metric: "31% faster turnover",
    theme: "violet",
  },
  {
    name: "Priya Nair",
    role: "Airport Traveler",
    review:
      "QR entry meant I drove straight from the highway to my slot without stopping once. Genuinely stress-free.",
    initials: "PN",
    metric: "0 stops, gate to slot",
    theme: "teal",
  },
];

const stats = [
  { value: "4.9/5", label: "average rating" },
  { value: "120K+", label: "reservations made" },
  { value: "98%", label: "on-time arrivals" },
];

function TiltCard({ children, delay }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springCfg = { stiffness: 150, damping: 18, mass: 0.6 };
  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);

  const rotateX = useTransform(sy, [0, 1], [9, -9]);
  const rotateY = useTransform(sx, [0, 1], [-10, 10]);
  const glareX = useTransform(sx, [0, 1], ["10%", "90%"]);
  const glareY = useTransform(sy, [0, 1], ["10%", "90%"]);

  const handleMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: "100%", perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          height: "100%",
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {children({ glareX, glareY })}
      </motion.div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        overflow: "hidden",
        background:
          "radial-gradient(120% 100% at 15% 0%, #EEF3FF 0%, #F6F8FF 45%, #FFFFFF 100%)",
      }}
    >
      {/* Ambient floating orbs for depth */}
      <Box
        component={motion.div}
        animate={{ y: [0, -22, 0], x: [0, 14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: -80,
          left: -100,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0) 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />
      <Box
        component={motion.div}
        animate={{ y: [0, 26, 0], x: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        sx={{
          position: "absolute",
          bottom: -120,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,58,138,0.14) 0%, rgba(30,58,138,0) 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 6 }}>
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box sx={{ width: 28, height: 2, background: "linear-gradient(90deg, transparent, #2563EB)" }} />
            <Typography
              variant="overline"
              sx={{ color: "#1E3A8A", fontWeight: 800, letterSpacing: "0.16em" }}
            >
              Testimonials
            </Typography>
            <Box sx={{ width: 28, height: 2, background: "linear-gradient(90deg, #2563EB, transparent)" }} />
          </Stack>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.1rem", md: "2.9rem" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#0F172A",
              maxWidth: 640,
            }}
          >
            Loved by drivers and{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #2563EB, #1E3A8A)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              operators
            </Box>{" "}
            alike
          </Typography>

          <Typography variant="body1" color="#475569" sx={{ maxWidth: 480 }}>
            Real feedback from the people who park with us every day — and the teams who run the lots behind the scenes.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 3.5, md: 4 },
            alignItems: "stretch",
          }}
        >
          {testimonials.map((t, i) => {
            const theme = themes[t.theme];
            return (
              <TiltCard key={t.name} delay={i * 0.12}>
                {({ glareX, glareY }) => (
                  <Card
                    sx={{
                      position: "relative",
                      height: "100%",
                      p: 4,
                      borderRadius: "24px",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.72)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.8)",
                      boxShadow: `0 30px 60px -25px ${theme.glow}, 0 2px 6px rgba(15,23,42,0.04)`,
                      transformStyle: "preserve-3d",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 5,
                        background: theme.grad,
                      },
                    }}
                  >
                    {/* Mouse-following glare, sits above content but ignores pointer events */}
                    <Box
                      component={motion.div}
                      style={{
                        left: glareX,
                        top: glareY,
                      }}
                      sx={{
                        position: "absolute",
                        width: 260,
                        height: 260,
                        marginLeft: "-130px",
                        marginTop: "-130px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
                        pointerEvents: "none",
                        mixBlendMode: "screen",
                      }}
                    />

                    {/* Background quote mark - structural, not decorative: signals "quote" before reading */}
                    <TbQuote
                      size={92}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 12,
                        color: theme.quote,
                        transform: "translateZ(0)",
                      }}
                    />

                    <Stack direction="row" spacing={0.4} sx={{ mb: 2.5, position: "relative" }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            display: "flex",
                          }}
                        >
                          <TbStarFilled size={17} color="#F59E0B" />
                        </Box>
                      ))}
                    </Stack>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        lineHeight: 1.75,
                        fontSize: "1.02rem",
                        color: "#1E293B",
                        position: "relative",
                        fontWeight: 450,
                      }}
                    >
                      {t.review}
                    </Typography>

                    <Divider sx={{ mb: 2.5, borderColor: "rgba(30,58,138,0.08)" }} />

                    <Stack direction="row" spacing={1.6} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.6} alignItems="center">
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            fontSize: "0.9rem",
                            background: theme.grad,
                            fontWeight: 700,
                            boxShadow: `0 6px 16px -4px ${theme.glow}`,
                          }}
                        >
                          {t.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="#0F172A">
                            {t.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t.role}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "inline-block",
                        mt: 2,
                        px: 1.4,
                        py: 0.5,
                        borderRadius: "999px",
                        fontWeight: 700,
                        color: theme.text,
                        background: theme.soft,
                      }}
                    >
                      {t.metric}
                    </Typography>
                  </Card>
                )}
              </TiltCard>
            );
          })}
        </Box>

        {/* Proof strip */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 3, sm: 0 }}
          divider={<Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(30,58,138,0.12)" }} />}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: { xs: 7, md: 9 } }}
        >
          {stats.map((s) => (
            <Box key={s.label} sx={{ px: { sm: 5 }, textAlign: "center" }}>
              <Typography sx={{ fontSize: "1.9rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
                {s.value}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, letterSpacing: "0.04em" }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}