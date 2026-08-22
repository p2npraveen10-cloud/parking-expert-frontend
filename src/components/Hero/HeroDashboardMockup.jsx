import { useRef } from "react";
import { Box, Card, Stack, Typography, LinearProgress, Avatar, Chip } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TbCircleCheckFilled, TbTrendingUp } from "react-icons/tb";
import { FaCarSide } from "react-icons/fa";

/**
 * Premium floating "product preview" built entirely from MUI cards.
 * Tilts subtly toward the mouse cursor (parallax) for a tactile,
 * awwwards-style depth effect.
 */
export default function HeroDashboardMockup() {
  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <Box
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{ perspective: 1400, width: "100%", position: "relative" }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
      >
        {/* Main glass panel */}
        <Card
          sx={{
            p: 3,
            borderRadius: "24px",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 30px 70px -20px rgba(30,58,138,0.35)",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
              Downtown Plaza Lot
            </Typography>
            <Chip
              size="small"
              label="Live"
              sx={{ bgcolor: "rgba(37,99,235,0.1)", color: "#1E3A8A", fontWeight: 700 }}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
            <Card sx={{ flex: 1, p: 2, borderRadius: "18px", boxShadow: "none", border: "1px solid rgba(15,23,42,0.06)" }}>
              <Typography variant="caption" color="text.secondary">Slots Available</Typography>
              <Typography variant="h5" fontWeight={800} color="#1E3A8A">128 / 200</Typography>
            </Card>
            <Card sx={{ flex: 1, p: 2, borderRadius: "18px", boxShadow: "none", border: "1px solid rgba(15,23,42,0.06)" }}>
              <Typography variant="caption" color="text.secondary">Today's Bookings</Typography>
              <Stack direction="row" alignItems="baseline" spacing={0.5}>
                <Typography variant="h5" fontWeight={800} color="#0F172A">342</Typography>
                <Typography variant="caption" color="success.main" fontWeight={700}>+12%</Typography>
              </Stack>
            </Card>
          </Stack>

          <Box sx={{ mb: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">Occupancy</Typography>
              <Typography variant="caption" fontWeight={700} color="#1E3A8A">64%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={64}
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: "rgba(37,99,235,0.1)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #2563EB, #1E3A8A)",
                },
              }}
            />
          </Box>

          {/* Chart placeholder */}
          <Box
            sx={{
              height: 90,
              borderRadius: "16px",
              background: "linear-gradient(180deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.01) 100%)",
              border: "1px solid rgba(15,23,42,0.05)",
              display: "flex",
              alignItems: "flex-end",
              gap: 0.7,
              p: 1.5,
              mb: 2.5,
            }}
          >
            {[40, 65, 50, 80, 60, 95, 70, 55, 85, 45].map((h, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: "4px",
                  background: "linear-gradient(180deg, #2563EB, #1E3A8A)",
                  opacity: 0.85,
                }}
              />
            ))}
          </Box>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: "rgba(37,99,235,0.12)", width: 32, height: 32 }}>
              <TbCircleCheckFilled color="#2563EB" size={18} />
            </Avatar>
            <Box>
              <Typography variant="caption" fontWeight={700} color="#0F172A">Slot A-14 reserved</Typography>
              <Typography variant="caption" display="block" color="text.secondary">Just now · Live activity</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Floating revenue card */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: -28, right: -24, transformStyle: "preserve-3d", transform: "translateZ(60px)" }}
        >
          <Card
            sx={{
              p: 2,
              borderRadius: "18px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 20px 45px -12px rgba(30,58,138,0.3)",
              minWidth: 150,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(16,185,129,0.12)", width: 30, height: 30 }}>
                <TbTrendingUp color="#10B981" size={16} />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">Revenue</Typography>
                <Typography variant="subtitle2" fontWeight={800}>$18,240</Typography>
              </Box>
            </Stack>
          </Card>
        </motion.div>

        {/* Floating car / entry card */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          style={{ position: "absolute", bottom: -20, left: -28, transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
        >
          <Card
            sx={{
              p: 1.75,
              borderRadius: "16px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 20px 45px -12px rgba(30,58,138,0.3)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(37,99,235,0.12)", width: 30, height: 30 }}>
                <FaCarSide color="#2563EB" size={15} />
              </Avatar>
              <Typography variant="caption" fontWeight={700}>TN-09-AX-4471 entered</Typography>
            </Stack>
          </Card>
        </motion.div>
      </motion.div>
    </Box>
  );
}
