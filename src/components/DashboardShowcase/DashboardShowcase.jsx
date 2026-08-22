import { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, Stack, LinearProgress, Tooltip } from "@mui/material";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  TbCash,
  TbCalendarStats,
  TbMap2,
  TbChartPie,
  TbChartLine,
  TbTicket,
  TbCarGarage,
  TbCircleCheck,
  TbParkingCircle,
  TbTrendingUp,
  TbChartBar,
  TbActivity,
} from "react-icons/tb";

/* ============================================================
   BACKGROUND
============================================================ */

const blobs = [
  { size: 460, top: "-10%", left: "-8%", color: "rgba(255,255,255,0.10)", dur: 13 },
  { size: 380, top: "55%", left: "82%", color: "rgba(147,169,242,0.16)", dur: 15 },
  { size: 320, top: "78%", left: "8%", color: "rgba(255,255,255,0.08)", dur: 11 },
];

const particles = Array.from({ length: 22 }, (_, i) => ({
  top: `${(i * 37) % 100}%`,
  left: `${(i * 53) % 100}%`,
  delay: i * 0.25,
  dur: 4 + (i % 5),
}));

function AnimatedBackground() {
  return (
    <Box className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
            filter: "blur(14px)",
          }}
          animate={{ y: [0, 26, 0], x: [0, 16, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <Box
        className="absolute inset-0"
        sx={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.10), transparent 45%), radial-gradient(circle at 75% 65%, rgba(255,255,255,0.08), transparent 45%)",
        }}
      />

      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: 3, height: 3, top: p.top, left: p.left, background: "rgba(255,255,255,0.55)" }}
          animate={{ opacity: [0.15, 0.9, 0.15], y: [0, -14, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </Box>
  );
}

/* ============================================================
   FLOATING NOTIFICATION BUBBLE
============================================================ */

function NotificationBubble({ icon: Icon, title, subtitle, accent = "#2563EB", sx = {}, delay = 0, floatDelay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "absolute", zIndex: 5, ...sx }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        whileHover={{ scale: 1.06 }}
      >
        <Box
          className="backdrop-blur-xl"
          sx={{
            borderRadius: "16px",
            bgcolor: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.18)",
            px: 1.75,
            py: 1.25,
            maxWidth: 210,
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                background: `linear-gradient(135deg, ${accent}, #1E3A8A)`,
              }}
            >
              <Icon size={16} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
                {title}
              </Typography>
              <Typography sx={{ fontSize: "0.66rem", color: "text.secondary" }}>{subtitle}</Typography>
            </Box>
          </Stack>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   CARD SHELL (shared gradient border + glass wrapper)
============================================================ */

function CardShell({ children, radius = 20, hover = { y: -4, scale: 1.02 } }) {
  return (
    <motion.div whileHover={hover} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="h-full">
      <div
        className="p-[1.5px] h-full"
        style={{
          borderRadius: radius + 1,
          background: "linear-gradient(135deg, rgba(37,99,235,0.5), rgba(147,169,242,0.15))",
        }}
      >
        <Box
          className="backdrop-blur-xl h-full"
          sx={{
            borderRadius: `${radius}px`,
            bgcolor: "rgba(255,255,255,0.92)",
            p: 2.25,
            boxShadow: "0 8px 26px rgba(15,23,42,0.08)",
            transition: "box-shadow .3s ease",
            "&:hover": { boxShadow: "0 18px 40px rgba(37,99,235,0.2)" },
          }}
        >
          {children}
        </Box>
      </div>
    </motion.div>
  );
}

/* ============================================================
   REVENUE CARD (count-up + sparkline)
============================================================ */

function useCountUp(target, active, duration = 1.4) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

const sparkPoints = "0,26 14,20 28,23 42,12 56,16 70,6 84,10 98,2";

function RevenueCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useCountUp(84920, inView);

  return (
    <div ref={ref}>
      <CardShell hover={{ y: -4, rotate: -1, scale: 1.02 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", background: "rgba(16,185,129,0.12)" }}>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
                <TbCash color="#10B981" size={17} />
              </motion.div>
            </Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              Revenue
            </Typography>
          </Stack>
          <TbTrendingUp color="#10B981" size={16} />
        </Stack>

        <Typography variant="h5" fontWeight={800} color="#0F172A">
          ${value.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="success.main" fontWeight={700}>
          +18.2% this month
        </Typography>

        <Box sx={{ mt: 1.25 }}>
          <svg viewBox="0 0 100 30" width="100%" height="30" preserveAspectRatio="none">
            <motion.polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparkPoints}
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </svg>
        </Box>
      </CardShell>
    </div>
  );
}

/* ============================================================
   BOOKING CARD
============================================================ */

function BookingCard() {
  const quickStats = [
    { label: "Active lots", value: "12" },
    { label: "Avg. session", value: "2.4h" },
  ];

  return (
    <CardShell hover={{ y: -4, rotate: 1, scale: 1.02 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", background: "rgba(37,99,235,0.12)" }}>
          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <TbCalendarStats color="#2563EB" size={17} />
          </motion.div>
        </Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary">
          Today's Bookings
        </Typography>
      </Stack>

      <Typography variant="h5" fontWeight={800} color="#0F172A" sx={{ mb: 1.5 }}>
        1,204
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 1.75 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={0.6} alignItems="center">
            <TbParkingCircle size={14} color="#2563EB" />
            <Typography variant="caption" color="text.secondary">Occupancy</Typography>
          </Stack>
          <Typography variant="caption" fontWeight={700} color="#0F172A">78%</Typography>
        </Stack>
        <Box sx={{ borderRadius: 999, overflow: "hidden" }}>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          >
            <LinearProgress
              variant="determinate"
              value={78}
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: "rgba(37,99,235,0.1)",
                "& .MuiLinearProgress-bar": { borderRadius: 999, background: "linear-gradient(90deg, #2563EB, #1E3A8A)" },
              }}
            />
          </motion.div>
        </Box>
      </Stack>

      <Stack direction="row" spacing={2}>
        {quickStats.map((s) => (
          <Box key={s.label}>
            <Typography variant="body2" fontWeight={800} color="#0F172A">{s.value}</Typography>
            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
          </Box>
        ))}
      </Stack>
    </CardShell>
  );
}

/* ============================================================
   HEATMAP
============================================================ */

const heatCells = Array.from({ length: 42 }, (_, i) => {
  const seed = Math.sin(i * 12.9898) * 43758.5453;
  return Math.abs(seed - Math.floor(seed));
});

function Heatmap() {
  const [hovered, setHovered] = useState(null);

  return (
    <CardShell hover={{ y: -4, scale: 1.01 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", background: "rgba(37,99,235,0.12)" }}>
          <TbMap2 color="#2563EB" size={17} />
        </Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary">
          Parking Heatmap
        </Typography>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 0.55 }}>
        {heatCells.map((v, i) => (
          <Tooltip key={i} title={`${Math.round(v * 100)}% occupied`} arrow>
            <motion.div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.012 }}
              whileHover={{ scale: 1.35, zIndex: 2 }}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 3,
                background: `rgba(37,99,235,${0.15 + v * 0.75})`,
                boxShadow: hovered === i ? "0 0 8px rgba(37,99,235,0.7)" : "none",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </CardShell>
  );
}

/* ============================================================
   VEHICLE CHART (pie)
============================================================ */

const slices = [
  { label: "Sedans", value: 45, color: "#2563EB" },
  { label: "SUVs", value: 27, color: "#1E3A8A" },
  { label: "Two-wheelers", value: 18, color: "#93A9F2" },
  { label: "EVs", value: 10, color: "#DCE6FF" },
];

function VehicleChart() {
  const [active, setActive] = useState(null);

  let cumulative = 0;
  const gradientStops = slices
    .map((s) => {
      const start = cumulative;
      cumulative += s.value;
      return `${s.color} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <CardShell hover={{ y: -4, rotate: -1, scale: 1.02 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", background: "rgba(37,99,235,0.12)" }}>
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
            <TbChartPie color="#2563EB" size={17} />
          </motion.div>
        </Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary">
          Vehicle Types
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2.5}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 96, height: 96, borderRadius: "50%", background: `conic-gradient(${gradientStops})`, flexShrink: 0 }}
        />
        <Stack spacing={0.75}>
          {slices.map((s) => (
            <motion.div
              key={s.label}
              onMouseEnter={() => setActive(s.label)}
              onMouseLeave={() => setActive(null)}
              animate={{ x: active === s.label ? 4 : 0 }}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            >
              <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: s.color }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: active === s.label ? 700 : 400 }}>
                {s.label} · {s.value}%
              </Typography>
            </motion.div>
          ))}
        </Stack>
      </Stack>
    </CardShell>
  );
}

/* ============================================================
   PEAK HOURS (mini bar chart)
============================================================ */

const peakHours = [
  { label: "6a", v: 18 },
  { label: "9a", v: 52 },
  { label: "12p", v: 88 },
  { label: "3p", v: 74 },
  { label: "6p", v: 100 },
  { label: "9p", v: 40 },
];

function PeakHoursCard() {
  const [hovered, setHovered] = useState(null);
  return (
    <CardShell hover={{ y: -4, scale: 1.02 }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1.75 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", background: "rgba(37,99,235,0.12)" }}>
            <TbChartBar color="#2563EB" size={17} />
          </Box>
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            Peak Hours
          </Typography>
        </Stack>
        <Typography variant="caption" fontWeight={800} color="#0F172A">6PM</Typography>
      </Stack>

      <Stack direction="row" spacing={1.25} alignItems="flex-end" sx={{ height: 78 }}>
        {peakHours.map((h, i) => (
          <Stack key={h.label} spacing={0.75} alignItems="center" sx={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
            <Box
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              sx={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end" }}
            >
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transformOrigin: "bottom",
                  width: "100%",
                  height: `${h.v}%`,
                  borderRadius: 6,
                  background: hovered === i ? "linear-gradient(180deg, #2563EB, #1E3A8A)" : "rgba(37,99,235,0.35)",
                  boxShadow: hovered === i ? "0 0 12px rgba(37,99,235,0.5)" : "none",
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ fontSize: "0.62rem", color: "text.secondary" }}>{h.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </CardShell>
  );
}

/* ============================================================
   BOOKING TREND (mini 7-day bars + KPI chip)
============================================================ */

const bookingTrend = [
  { label: "M", v: 58 },
  { label: "T", v: 68 },
  { label: "W", v: 54 },
  { label: "T", v: 80 },
  { label: "F", v: 92 },
  { label: "S", v: 70 },
  { label: "S", v: 86 },
];

function BookingTrendCard() {
  return (
    <CardShell hover={{ y: -4, scale: 1.02 }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1.75 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", background: "rgba(16,185,129,0.12)" }}>
            <TbActivity color="#10B981" size={17} />
          </Box>
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            Booking Trend
          </Typography>
        </Stack>
        <Box
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 999,
            bgcolor: "rgba(16,185,129,0.12)",
          }}
        >
          <Typography variant="caption" fontWeight={800} color="#10B981">+9.4%</Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.1} alignItems="flex-end" sx={{ height: 78 }}>
        {bookingTrend.map((d, i) => (
          <Stack key={i} spacing={0.75} alignItems="center" sx={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
            <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end" }}>
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transformOrigin: "bottom",
                  width: "100%",
                  height: `${d.v}%`,
                  borderRadius: 6,
                  background: i === bookingTrend.length - 2
                    ? "linear-gradient(180deg, #10B981, #059669)"
                    : "rgba(16,185,129,0.3)",
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ fontSize: "0.62rem", color: "text.secondary" }}>{d.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </CardShell>
  );
}

/* ============================================================
   TREND CHART (line + area, hover tooltip)
============================================================ */

const points = [
  [0, 92], [80, 68], [160, 80], [240, 42],
  [320, 58], [400, 26], [480, 44], [560, 14], [640, 30],
];
const CHART_W = 640, CHART_H = 120;
const linePath = `M ${points.map((p) => p.join(",")).join(" L ")}`;
const areaPath = `${linePath} L ${CHART_W},${CHART_H} L 0,${CHART_H} Z`;

function TrendChart() {
  const [hoverIdx, setHoverIdx] = useState(null);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 220, damping: 20 }} className="h-full">
      <div
        className="rounded-[22px] p-[1.5px] h-full"
        style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.5), rgba(147,169,242,0.15))" }}
      >
        <Box
          className="backdrop-blur-xl h-full"
          sx={{
            borderRadius: "21px",
            bgcolor: "rgba(255,255,255,0.92)",
            p: 3,
            boxShadow: "0 8px 26px rgba(15,23,42,0.08)",
            transition: "box-shadow .3s ease",
            "&:hover": { boxShadow: "0 18px 44px rgba(37,99,235,0.2)" },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", background: "rgba(37,99,235,0.12)" }}>
                <TbChartLine color="#2563EB" size={17} />
              </Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                Weekly Occupancy Trend
              </Typography>
            </Stack>
            <Typography variant="caption" fontWeight={800} color="#10B981">+12.4%</Typography>
          </Stack>

          <Box sx={{ position: "relative", height: 150 }}>
            <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="0" x2={CHART_W} y1={(CHART_H / 3) * i} y2={(CHART_H / 3) * i} stroke="rgba(15,23,42,0.06)" strokeWidth="1" />
              ))}

              <motion.path
                d={areaPath}
                fill="url(#areaFill)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
              <motion.path
                d={linePath}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />

              {points.map(([x, y], i) => (
                <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                  <circle cx={x} cy={y} r="10" fill="transparent" style={{ cursor: "pointer" }} />
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={hoverIdx === i ? 5.5 : 3.5}
                    fill="#fff"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    animate={{ r: hoverIdx === i ? 5.5 : 3.5 }}
                    transition={{ duration: 0.2 }}
                  />
                  {hoverIdx === i && (
                    <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                      <rect x={x - 22} y={y - 32} width="44" height="20" rx="6" fill="#0F172A" />
                      <text x={x} y={y - 18} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">
                        {Math.round(100 - y / 1.2)}%
                      </text>
                    </motion.g>
                  )}
                </g>
              ))}
            </svg>
          </Box>
        </Box>
      </div>
    </motion.div>
  );
}

/* ============================================================
   LIVE ACTIVITY FEED
============================================================ */

const activity = [
  { icon: TbTicket, text: "New booking confirmed · Lot 4B", time: "Just now", color: "#2563EB" },
  { icon: TbCarGarage, text: "Vehicle entered · Slot A-12", time: "2m ago", color: "#10B981" },
  { icon: TbCash, text: "Payment received · $42.00", time: "6m ago", color: "#2563EB" },
  { icon: TbCircleCheck, text: "Slot released · Downtown Lot", time: "11m ago", color: "#1E3A8A" },
  { icon: TbParkingCircle, text: "New booking · Riverside Lot", time: "16m ago", color: "#2563EB" },
];

function LiveActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <div
        className="rounded-[22px] p-[1.5px] h-full"
        style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.5), rgba(147,169,242,0.15))" }}
      >
        <Box
          className="backdrop-blur-xl"
          sx={{
            borderRadius: "21px",
            bgcolor: "rgba(255,255,255,0.92)",
            p: 3,
            boxShadow: "0 8px 26px rgba(15,23,42,0.08)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
            <Typography variant="body2" fontWeight={800} color="#0F172A">
              Recent Bookings · Live Activity
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ px: 1.1, py: 0.35, borderRadius: 999, bgcolor: "rgba(16,185,129,0.12)" }}>
              <motion.span
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <Typography variant="caption" fontWeight={700} color="#10B981">Live</Typography>
            </Stack>
          </Stack>

          <Stack spacing={0.5} sx={{ flex: 1, justifyContent: "space-between" }}>
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.12 }}
                  whileHover={{ x: 4 }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      py: 1.1,
                      borderBottom: i !== activity.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none",
                    }}
                  >
                    <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", background: `${a.color}1A`, flexShrink: 0 }}>
                      <Icon size={16} color={a.color} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} color="#0F172A" noWrap>{a.text}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>{a.time}</Typography>
                  </Stack>
                </motion.div>
              );
            })}
          </Stack>
        </Box>
      </div>
    </motion.div>
  );
}

/* ============================================================
   BENTO GRID PRIMITIVES
   12-column grid · 8px spacing system · 24px gap · 32px outer pad
============================================================ */

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

const MotionBox = motion(Box);

/** Positions a card on the 12-col / row-tracked bento grid. Collapses to a
 *  single stacked column below the md breakpoint. */
function BentoItem({ col, row, children }) {
  return (
    <MotionBox
      variants={item}
      sx={{
        gridColumn: { xs: "1 / -1", md: col },
        gridRow: { xs: "auto", md: row },
        minWidth: 0,
      }}
    >
      {children}
    </MotionBox>
  );
}

/* ============================================================
   DASHBOARD WINDOW
============================================================ */

function DashboardWindow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div
          className="rounded-[32px] p-[2px]"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(147,169,242,0.35), rgba(37,99,235,0.5))" }}
        >
          <Box
            className="backdrop-blur-2xl relative overflow-hidden"
            sx={{
              borderRadius: "31px",
              bgcolor: "rgba(255,255,255,0.14)",
              boxShadow: "0 30px 80px rgba(15,23,42,0.35), 0 0 60px rgba(37,99,235,0.25)",
              p: { xs: 2.5, md: 4 },
            }}
          >
            <Box className="pointer-events-none absolute inset-0" sx={{ background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), transparent 60%)" }} />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              style={{ position: "relative", zIndex: 1 }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
                  gridAutoRows: { xs: "auto", md: "minmax(184px, auto)" },
                  gap: 3,
                }}
              >
                {/* Row 1–2 · Revenue (left) + dominant Weekly Analytics chart (right, tall) */}
                <BentoItem col="1 / 4" row="1 / 2"><RevenueCard /></BentoItem>
                <BentoItem col="4 / 13" row="1 / 3"><TrendChart /></BentoItem>
                <BentoItem col="1 / 4" row="2 / 3"><BookingCard /></BentoItem>

                {/* Row 3–4 · Heatmap / Live Activity (tall) / Vehicle Types */}
                <BentoItem col="1 / 5" row="3 / 4"><Heatmap /></BentoItem>
                <BentoItem col="5 / 9" row="3 / 5"><LiveActivity /></BentoItem>
                <BentoItem col="9 / 13" row="3 / 4"><VehicleChart /></BentoItem>

                {/* Row 4 · Peak Hours / Booking Trend */}
                <BentoItem col="1 / 5" row="4 / 5"><PeakHoursCard /></BentoItem>
                <BentoItem col="9 / 13" row="4 / 5"><BookingTrendCard /></BentoItem>
              </Box>
            </motion.div>
          </Box>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   MAIN SECTION
============================================================ */

export default function DashboardShowcase() {
  const headingRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: headingRef, offset: ["start end", "end start"] });
  const underlineScale = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <AnimatedBackground />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box ref={headingRef} sx={{ textAlign: "center", mb: { xs: 8, md: 6 } }}>
          <motion.div initial={{ opacity: 0, y: -24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
            <Typography variant="overline" sx={{ color: "#BFD3FF", fontWeight: 800, letterSpacing: "0.14em" }}>
              Operator Dashboard
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.2rem" }, fontWeight: 800, color: "#fff", lineHeight: 1.15 }}>
              Powerful{" "}
              <Box component="span" sx={{ backgroundImage: "linear-gradient(90deg, #BFD3FF, #fff)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                analytics
              </Box>
              , beautifully organized.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <motion.div style={{ scaleX: underlineScale, transformOrigin: "left", height: 3, width: 130, borderRadius: 999, background: "linear-gradient(90deg, #fff, #BFD3FF)" }} />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 560, mx: "auto", mt: 2 }}>
              Manage every parking lot, vehicle, booking and revenue from one intelligent dashboard.
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ position: "relative" }}>
          <DashboardWindow />

          <NotificationBubble
            icon={TbTicket}
            title="QR Booking Success"
            subtitle="Slot A-12 confirmed"
            sx={{ top: "-6%", left: "-4%", display: { xs: "none", lg: "block" } }}
            delay={0.6}
            floatDelay={0}
          />
          <NotificationBubble
            icon={TbCarGarage}
            title="Vehicle Entered"
            subtitle="Downtown Lot · Gate 2"
            sx={{ top: "14%", right: "-5%", display: { xs: "none", lg: "block" } }}
            delay={0.8}
            floatDelay={0.6}
          />
          <NotificationBubble
            icon={TbCash}
            title="Revenue Increased"
            subtitle="+18.2% this month"
            sx={{ bottom: "16%", left: "-6%", display: { xs: "none", lg: "block" } }}
            delay={1.0}
            floatDelay={1.1}
          />
          <NotificationBubble
            icon={TbParkingCircle}
            title="Slot Available"
            subtitle="Lot 4B · Level 2"
            sx={{ bottom: "-4%", right: "-4%", display: { xs: "none", lg: "block" } }}
            delay={1.2}
            floatDelay={1.7}
          />
        </Box>
      </Container>
    </Box>
  );
}