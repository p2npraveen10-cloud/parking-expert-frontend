import { useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import {
  TbUsers,
  TbMapPin,
  TbTicket,
  TbActivity,
  TbParkingCircle,
  TbTrendingUp,
} from "react-icons/tb";
import useCountUp from "../../hooks/useCountUp";

const stats = [
  {
    key: "users",
    target: 10000,
    suffix: "+",
    label: "Happy Users",
    format: (v) => (v >= 1000 ? `${Math.floor(v / 1000)}K` : v),
    icon: TbUsers,
    support: "Trusting the platform daily",
    slot: "large",
    trend: "+18%",
    sparkline: [4, 6, 5, 8, 7, 9, 10, 12, 11, 14, 15],
  },
  {
    key: "zones",
    target: 500,
    suffix: "+",
    label: "Parking Zones",
    format: (v) => v,
    icon: TbMapPin,
    support: "Connected locations",
    slot: "medium",
    live: true,
  },
  {
    key: "bookings",
    target: 250000,
    suffix: "+",
    label: "Bookings",
    format: (v) => (v >= 1000 ? `${Math.floor(v / 1000)}K` : v),
    icon: TbTicket,
    support: "Daily booking activity",
    slot: "wideLeft",
    trend: "+12%",
    sparkline: [20, 35, 28, 40, 55, 48, 60, 58, 70, 66, 80],
  },
  {
    key: "uptime",
    target: 99,
    suffix: "%",
    label: "System Uptime",
    format: (v) => v,
    icon: TbActivity,
    support: "All systems normal",
    slot: "wideRight",
    progress: 99,
    live: true,
  },
];

const slotBox = {
  large: { top: "0%", left: "0%", width: "31.25%", height: "43.55%" },
  medium: { top: "0%", right: "0%", width: "23.96%", height: "29.03%" },
  wideLeft: { bottom: "0%", left: "0%", width: "37.5%", height: "30.65%" },
  wideRight: { bottom: "0%", right: "0%", width: "33.33%", height: "30.65%" },
};

const LINE_PATHS = [
  "M150,135 Q320,220 480,310",
  "M845,90 Q650,180 480,310",
  "M180,525 Q330,420 480,310",
  "M800,525 Q640,420 480,310",
];

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 36, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 170, damping: 22 },
  },
};

/* ----------------------------- Sparkline ----------------------------- */

function Sparkline({ data, width = 84, height = 28, color = "#2563EB" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const gradId = `sparkGrad-${color.replace("#", "")}`;
  const glowId = `sparkGlow-${color.replace("#", "")}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.polygon points={areaPoints} fill={`url(#${gradId})`} />
      <motion.polyline
        points={points}
        stroke={color}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ---------------------------- Trend badge ----------------------------- */

function TrendBadge({ value }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.2,
        py: 0.45,
        borderRadius: 999,
        background: "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(96,165,250,0.14))",
        border: "1px solid rgba(37,99,235,0.18)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      <TbTrendingUp size={13} color="#2563EB" />
      <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: "#2563EB", letterSpacing: "0.01em" }}>
        {value}
      </Typography>
    </Box>
  );
}

/* ---------------------------- Mini progress ---------------------------- */

function MiniProgress({ value = 99 }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: 7,
        borderRadius: 999,
        bgcolor: "rgba(37,99,235,0.08)",
        border: "1px solid rgba(37,99,235,0.10)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          height: "100%",
          borderRadius: 999,
          background: "linear-gradient(90deg, #2563EB, #3B82F6, #60A5FA)",
          boxShadow: "0 0 10px rgba(37,99,235,0.55)",
        }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </Box>
  );
}

/* ------------------------------ Pulse dot ------------------------------ */

function PulseDot() {
  return (
    <Box sx={{ position: "relative", width: 8, height: 8 }}>
      <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", bgcolor: "#22C55E" }} />
      <motion.div
        style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E" }}
        animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
    </Box>
  );
}

/* ------------------------- Decorative corner mark ------------------------ */

function CornerMark({ position = "top-right" }) {
  const placement =
    position === "top-right"
      ? { top: 14, right: 14 }
      : { bottom: 14, left: 14 };

  return (
    <Box
      sx={{
        position: "absolute",
        ...placement,
        width: 14,
        height: 14,
        zIndex: 2,
        opacity: 0.35,
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          background: "#2563EB",
        },
        "&::before": { top: 0, left: 0, width: "100%", height: "1.5px" },
        "&::after": { top: 0, left: 0, width: "1.5px", height: "100%" },
      }}
    />
  );
}

/* --------------------------- Card accent blobs -------------------------- */

function CardBlobs() {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: -36,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.35), transparent 70%)",
          filter: "blur(6px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -44,
          left: -28,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147,197,253,0.30), transparent 70%)",
          filter: "blur(8px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "55%",
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(219,234,254,0.45), transparent 70%)",
          filter: "blur(10px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ------------------------------- Ambience -------------------------------- */

function Ambience() {
  return (
    <Box className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* layered gradient wash */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 12% 18%, rgba(219,234,254,0.65), transparent 42%)," +
            "radial-gradient(circle at 88% 12%, rgba(191,219,254,0.55), transparent 42%)," +
            "radial-gradient(circle at 50% 95%, rgba(224,242,254,0.55), transparent 48%)",
        }}
      />

      {/* floating blurred circles */}
      <motion.div
        style={{
          position: "absolute",
          top: "6%",
          left: "8%",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.22), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ y: [0, 24, 0], x: [0, 14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "8%",
          right: "10%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.14), transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ y: [0, -20, 0], x: [0, -16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        style={{
          position: "absolute",
          top: "45%",
          right: "35%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147,197,253,0.18), transparent 70%)",
          filter: "blur(36px)",
        }}
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* fine grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#1E3A8A 1px, transparent 1px), linear-gradient(90deg, #1E3A8A 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* soft noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </Box>
  );
}

/* --------------------------- Connection lines ---------------------------- */

function ConnectionLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full hidden md:block"
      viewBox="0 0 960 620"
      preserveAspectRatio="none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {LINE_PATHS.map((d, i) => (
        <g key={i}>
          <motion.path
            d={d}
            stroke="url(#lineGlow)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2 + i * 0.1 }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------ Center core ------------------------------ */

function CenterCore() {
  return (
    <Box className="absolute" sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 3 }}>
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <Box sx={{ position: "relative", width: { xs: 160, md: 200 }, height: { xs: 160, md: 200 } }}>
          <motion.div
            className="absolute rounded-full border"
            style={{ inset: -28, borderColor: "rgba(59,130,246,0.25)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "conic-gradient(from 0deg, #60A5FA, #93C5FD, #60A5FA)", padding: 4 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <Box sx={{ width: "100%", height: "100%", borderRadius: "50%", background: "white" }} />
          </motion.div>

          <Box
            className="absolute inset-[12px] backdrop-blur-xl"
            sx={{
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.95)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.1), inset 0 0 30px rgba(59,130,246,0.15)",
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(59,130,246,0.15)",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  mx: "auto",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 8px 25px rgba(37,99,235,0.25)",
                }}
              >
                <TbParkingCircle size={32} color="white" />
              </Box>
              <Typography sx={{ mt: 1.5, fontWeight: 800, fontSize: "0.95rem", color: "#0F172A" }}>
                Smart Parking
              </Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

/* -------------------------------- Bento card ------------------------------ */

function BentoCard({ stat, index }) {
  const Icon = stat.icon;
  const { ref: countRef, value } = useCountUp(stat.target);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(-py * 10);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const isWide = stat.slot === "wideLeft" || stat.slot === "wideRight";

  return (
    <motion.div variants={cardVariant} className="absolute" style={{ ...slotBox[stat.slot], zIndex: 2 }}>
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.8 + index * 0.3, repeat: Infinity }}>
        <motion.div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY, transformPerspective: 1100, height: "100%" }}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="group relative"
        >
          {/* glowing border layer, revealed on hover */}
          <Box
            className="absolute -inset-[1.5px] rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            sx={{
              background: "linear-gradient(135deg, #2563EB, #60A5FA 45%, #93C5FD)",
              filter: "blur(3px)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <Box
            ref={countRef}
            className="transition-shadow duration-500"
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              overflow: "hidden",
              background:
                "linear-gradient(165deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 60%, rgba(239,246,255,0.7) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "24px",
              p: 3.5,
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), 0 18px 40px -14px rgba(37,99,235,0.22), 0 4px 10px rgba(15,23,42,0.05)",
              display: "flex",
              flexDirection: isWide ? "row" : "column",
              alignItems: isWide ? "center" : "flex-start",
              justifyContent: isWide ? "space-between" : "center",
              "&:hover": {
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.95), 0 30px 60px -16px rgba(37,99,235,0.32), 0 8px 20px rgba(15,23,42,0.08)",
              },
            }}
          >
            {/* top highlight line */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: "8%",
                right: "8%",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
                zIndex: 1,
              }}
            />

            <CardBlobs />
            <CornerMark position="top-right" />
            <CornerMark position="bottom-left" />

            <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1.2 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(15,23,42,0.18), 0 10px 22px rgba(37,99,235,0.35)",
                }}
              >
                <Icon size={26} color="#FFFFFF" />
              </Box>

              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography
                  sx={{
                    fontSize: stat.slot === "large" ? "2.75rem" : "2.05rem",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#0F172A",
                    lineHeight: 1,
                  }}
                >
                  {stat.format(value)}{stat.suffix}
                </Typography>
                {stat.trend && <TrendBadge value={stat.trend} />}
              </Box>

              <Typography sx={{ fontWeight: 700, fontSize: "1.02rem", color: "#334155" }}>
                {stat.label}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {stat.live && <PulseDot />}
                <Typography sx={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>
                  {stat.support}
                </Typography>
              </Box>
            </Box>

            {stat.slot === "large" && stat.sparkline && (
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Sparkline data={stat.sparkline} width={150} height={40} />
              </Box>
            )}
            {isWide && stat.sparkline && (
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Sparkline data={stat.sparkline} width={115} height={48} />
              </Box>
            )}
            {isWide && stat.progress && (
              <Box sx={{ position: "relative", zIndex: 1, pl: 3, width: 130 }}>
                <MiniProgress value={stat.progress} />
              </Box>
            )}
          </Box>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------- Mobile stat card ---------------------------- */

function MobileStatCard({ stat }) {
  const Icon = stat.icon;
  const { ref: countRef, value } = useCountUp(stat.target);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.99 }}
      style={{ width: "92%" }}
      className="group relative"
    >
      <Box
        ref={countRef}
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 60%, rgba(239,246,255,0.7) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "22px",
          p: 3.5,
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.95), 0 16px 34px -14px rgba(37,99,235,0.22), 0 4px 10px rgba(15,23,42,0.05)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "8%",
            right: "8%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
          }}
        />
        <CardBlobs />
        <CornerMark position="top-right" />

        <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 3 }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563EB, #3B82F6)",
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(15,23,42,0.18), 0 10px 22px rgba(37,99,235,0.35)",
              flexShrink: 0,
            }}
          >
            <Icon size={30} color="#FFFFFF" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography sx={{ fontSize: "1.95rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A" }}>
                {stat.format(value)}{stat.suffix}
              </Typography>
              {stat.trend && <TrendBadge value={stat.trend} />}
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#334155" }}>{stat.label}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              {stat.live && <PulseDot />}
              <Typography sx={{ color: "#94A3B8", fontSize: "0.85rem", fontWeight: 500 }}>
                {stat.support}
              </Typography>
            </Box>
          </Box>
        </Box>

        {stat.sparkline && (
          <Box sx={{ position: "relative", zIndex: 1, mt: 3 }}>
            <Sparkline data={stat.sparkline} width={270} height={38} />
          </Box>
        )}
        {stat.progress && (
          <Box sx={{ position: "relative", zIndex: 1, mt: 3 }}>
            <MiniProgress value={stat.progress} />
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

function MobileStack() {
  return (
    <Box className="flex md:hidden flex-col items-center" sx={{ gap: 4, mt: 2 }}>
      {stats.map((s) => (
        <MobileStatCard key={s.key} stat={s} />
      ))}
    </Box>
  );
}

/* ---------------------------------- Stats --------------------------------- */

export default function Stats() {
  const headingRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: headingRef, offset: ["start end", "end start"] });
  const underlineScale = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        background: "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 55%, #F1F5F9 100%)",
        overflow: "hidden",
      }}
    >
      <Ambience />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box ref={headingRef} sx={{ textAlign: "center", mb: { xs: 8, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Typography variant="overline" sx={{ color: "#64748B", fontWeight: 700, letterSpacing: "0.12em" }}>
              BY THE NUMBERS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.4rem", md: "3.3rem" },
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.15,
                mt: 1,
              }}
            >
              Trusted at a{" "}
              <Box component="span" sx={{ color: "#2563EB" }}>growing scale</Box>
            </Typography>
            <Typography sx={{ color: "#475569", maxWidth: 520, mx: "auto", mt: 2, fontSize: "1.1rem" }}>
              One connected network, live across every zone, booking, and driver on the platform.
            </Typography>
          </motion.div>
        </Box>

        <Box
          component={motion.div}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerStagger}
          className="relative hidden md:block mx-auto"
          sx={{ width: "100%", maxWidth: 960, height: 620, position: "relative" }}
        >
          <ConnectionLines />
          <CenterCore />
          {stats.map((s, i) => (
            <BentoCard key={s.key} stat={s} index={i} />
          ))}
        </Box>

        <MobileStack />
      </Container>
    </Box>
  );
}