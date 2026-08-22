import { useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { TbSearch, TbMapPin, TbTicket, TbCar } from "react-icons/tb";

const steps = [
  {
    key: "search",
    icon: TbSearch,
    title: "Search Parking",
    desc: "Enter your destination and browse nearby available lots instantly.",
  },
  {
    key: "select",
    icon: TbMapPin,
    title: "Choose Slot",
    desc: "Pick the exact slot that fits your schedule, budget and vehicle.",
  },
  {
    key: "book",
    icon: TbTicket,
    title: "Book Instantly",
    desc: "Confirm and pay securely — your reservation is locked in seconds.",
  },
  {
    key: "park",
    icon: TbCar,
    title: "Park Easily",
    desc: "Scan your QR code at the gate and pull straight into your spot.",
  },
];

/* Desktop road path — designed with 4 gentle humps roughly under the 4 cards */
const ROAD_D =
  "M 20 150 C 200 30, 340 270, 560 150 C 720 40, 860 260, 1040 150 C 1110 100, 1150 150, 1180 150";
const ROAD_VIEW_W = 1200;
const ROAD_VIEW_H = 300;

const cardXPercent = [4, 34, 64, 90];
const cardYSide = [1, -1, 1, -1]; // below / above alternation

/* ---------------- Icon interactions ---------------- */

function StepIcon({ type, size = 30 }) {
  if (type === "search") {
    return (
      <Box sx={{ position: "relative", width: size + 20, height: size + 20, display: "grid", placeItems: "center" }}>
        {[0, 1].map((r) => (
          <motion.span
            key={r}
            className="absolute rounded-full border"
            style={{ borderColor: "rgba(255,255,255,0.6)", width: size, height: size }}
            animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: r * 1.1 }}
          />
        ))}
        <motion.div whileHover={{ scale: 1.25, rotate: 20 }} transition={{ type: "spring", stiffness: 300 }}>
          <TbSearch size={size} />
        </motion.div>
      </Box>
    );
  }

  if (type === "select") {
    return (
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.25, rotate: -10 }}
      >
        <TbMapPin size={size} />
      </motion.div>
    );
  }

  if (type === "book") {
    return (
      <motion.div
        animate={{
          filter: [
            "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
            "drop-shadow(0 0 12px rgba(255,255,255,0.95))",
            "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.25, rotate: 8 }}
      >
        <TbTicket size={size} />
      </motion.div>
    );
  }

  // park
  return (
    <motion.div
      animate={{ x: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.25, rotate: 6 }}
    >
      <TbCar size={size} />
    </motion.div>
  );
}

/* ---------------- Glass card with 3D tilt ---------------- */

function StepCard({ step, index }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 14);
  }
  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ scale: 1.05 }}
      className="w-[190px] md:w-[240px]"
    >
      <div
        className="rounded-[22px] p-[1.5px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(147,169,242,0.4), rgba(37,99,235,0.6))",
        }}
      >
        <Box
          className="backdrop-blur-xl"
          sx={{
            borderRadius: "21px",
            bgcolor: "rgba(255,255,255,0.55)",
            p: 2.5,
            boxShadow: "0 12px 34px rgba(15,23,42,0.14)",
          }}
        >
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "16px",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              mb: 1.5,
              background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
              boxShadow: "0 10px 24px rgba(37,99,235,0.4)",
            }}
          >
            <StepIcon type={step.key} size={26} />
          </Box>
          <Typography variant="caption" sx={{ color: "#2563EB", fontWeight: 800, letterSpacing: "0.08em" }}>
            STEP {index + 1}
          </Typography>
          <Typography variant="subtitle1" fontWeight={800} color="#0F172A" sx={{ mt: 0.25 }}>
            {step.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
            {step.desc}
          </Typography>
        </Box>
      </div>
    </motion.div>
  );
}

/* ---------------- Background ambience ---------------- */

function Ambience() {
  return (
    <Box className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#1E3A8A 1px, transparent 1px), linear-gradient(90deg, #1E3A8A 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />
      <motion.div
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.16), transparent 70%)", filter: "blur(10px)" }}
        animate={{ y: [0, 30, 0], x: [0, 18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 -right-28 w-[460px] h-[460px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(30,58,138,0.12), transparent 70%)", filter: "blur(10px)" }}
        animate={{ y: [0, -22, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`pin-${i}`}
          className="absolute text-blue-500/25"
          style={{ top: `${(i * 29) % 90}%`, left: `${(i * 41) % 90}%` }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        >
          <TbMapPin size={18} />
        </motion.div>
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.span
          key={`dot-${i}`}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: "rgba(37,99,235,0.35)", top: `${(i * 37) % 100}%`, left: `${(i * 53) % 100}%` }}
          animate={{ opacity: [0.15, 0.8, 0.15], y: [0, -12, 0] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
        />
      ))}
    </Box>
  );
}

/* ---------------- Desktop road + traveling car ---------------- */

function DesktopJourney() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const carX = useMotionValue(20);
  const carY = useMotionValue(150);
  const carRotate = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(progress, "change", (v) => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const clamped = Math.max(0, Math.min(1, v));
    const point = path.getPointAtLength(clamped * total);
    const point2 = path.getPointAtLength(Math.min(clamped * total + 2, total));
    carX.set(point.x);
    carY.set(point.y);
    carRotate.set((Math.atan2(point2.y - point.y, point2.x - point.x) * 180) / Math.PI);
  });

  const carLeft = useTransform(carX, (x) => `${(x / ROAD_VIEW_W) * 100}%`);
  const carTop = useTransform(carY, (y) => `${(y / ROAD_VIEW_H) * 100}%`);
  const carTransform = useTransform([carRotate], ([r]) => `translate(-50%,-50%) rotate(${r}deg)`);

  return (
    <Box ref={containerRef} className="relative hidden md:block" sx={{ height: 420, mt: 4 }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${ROAD_VIEW_W} ${ROAD_VIEW_H}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="roadGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#93A9F2" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
        <path d={ROAD_D} stroke="rgba(37,99,235,0.12)" strokeWidth="10" strokeLinecap="round" />
        <motion.path
          ref={pathRef}
          d={ROAD_D}
          stroke="url(#roadGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
      </svg>

      <motion.div
        className="absolute z-10 text-[#1E3A8A]"
        style={{ left: carLeft, top: carTop, transform: carTransform }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
            boxShadow: "0 8px 22px rgba(37,99,235,0.55)",
          }}
        >
          <TbCar size={24} />
        </Box>
      </motion.div>

      {steps.map((step, i) => (
        <Box
          key={step.key}
          className="absolute"
          sx={{
            left: `${cardXPercent[i]}%`,
            top: cardYSide[i] === -1 ? "6%" : "62%",
          }}
        >
          <StepCard step={step} index={i} />
        </Box>
      ))}
    </Box>
  );
}

/* ---------------- Mobile vertical journey ---------------- */

function MobileJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.3"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const carTop = useTransform(scrollYProgress, [0, 1], ["2%", "96%"]);

  return (
    <Box ref={containerRef} className="relative flex md:hidden flex-col items-center" sx={{ mt: 6, pl: 1 }}>
      <Box
        className="absolute left-1/2"
        sx={{
          top: 0,
          bottom: 0,
          width: 3,
          transform: "translateX(-50%)",
          borderRadius: 999,
          bgcolor: "rgba(37,99,235,0.14)",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            scaleY: lineScale,
            transformOrigin: "top",
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, #93A9F2, #2563EB, #1E3A8A)",
          }}
        />
      </Box>

      <motion.div className="absolute left-1/2 z-10" style={{ top: carTop, x: "-50%", y: "-50%" }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
            boxShadow: "0 8px 20px rgba(37,99,235,0.55)",
          }}
        >
          <TbCar size={20} />
        </Box>
      </motion.div>

      <Box className="flex flex-col items-center w-full" sx={{ gap: 6, py: 4 }}>
        {steps.map((step, i) => (
          <Box
            key={step.key}
            sx={{ alignSelf: i % 2 === 0 ? "flex-start" : "flex-end", ml: i % 2 === 0 ? "8%" : 0, mr: i % 2 === 1 ? "8%" : 0 }}
          >
            <StepCard step={step} index={i} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ---------------- Main Section ---------------- */

export default function HowItWorks() {
  const headingRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: headingRef, offset: ["start end", "end start"] });
  const underlineScale = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <Box component="section" id="how-it-works" sx={{ position: "relative", py: { xs: 10, md: 14 }, bgcolor: "#FFFFFF", overflow: "hidden" }}>
      <Ambience />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box ref={headingRef} sx={{ textAlign: "center", mb: { xs: 6, md: 4 } }}>
          <motion.div initial={{ opacity: 0, y: -24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>
            <Typography variant="overline" sx={{ color: "#1E3A8A", fontWeight: 800, letterSpacing: "0.14em" }}>
              How it Works
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.2rem" }, fontWeight: 800, color: "#0F172A", lineHeight: 1.15 }}>
              Your journey to a{" "}
              <Box component="span" sx={{ backgroundImage: "linear-gradient(90deg, #2563EB, #1E3A8A)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                stress-free
              </Box>{" "}
              park
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <motion.div style={{ scaleX: underlineScale, transformOrigin: "left", height: 3, width: 130, borderRadius: 999, background: "linear-gradient(90deg, #2563EB, #93A9F2)" }} />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 520, mx: "auto", mt: 2, fontSize: "1.05rem" }}>
              Follow the road from search to parked — four steps, one seamless ride.
            </Typography>
          </motion.div>
        </Box>

        <DesktopJourney />
        <MobileJourney />
      </Container>
    </Box>
  );
}