import { Box, Container, Typography, Card, Stack } from "@mui/material";
import { motion } from "framer-motion";
import {
  TbMapPin,
  TbQrcode,
  TbActivity,
  TbCalendarEvent,
  TbShieldLock,
  TbChartInfographic,
} from "react-icons/tb";
import SectionDivider from "../common/SectionDivider";
import FloatingBackground from "../common/FloatingBackground";

const features = [
  {
    icon: <TbMapPin size={28} />,
    title: "Real-Time Parking",
    desc: "See live availability across every connected lot the moment a spot opens up.",
  },
  {
    icon: <TbQrcode size={28} />,
    title: "QR Code Entry",
    desc: "Skip the ticket booth — scan and enter in seconds with a contactless QR pass.",
  },
  {
    icon: <TbActivity size={28} />,
    title: "Live Slot Tracking",
    desc: "Track your reserved slot on a live map from the moment you book to arrival.",
  },
  {
    icon: <TbCalendarEvent size={28} />,
    title: "Online Booking",
    desc: "Reserve a spot in advance for today or weeks ahead, in just a couple of taps.",
  },
  {
    icon: <TbShieldLock size={28} />,
    title: "Secure Payment",
    desc: "Pay safely with encrypted checkout and instant digital receipts every time.",
  },
  {
    icon: <TbChartInfographic size={28} />,
    title: "Analytics Dashboard",
    desc: "Operators get real-time occupancy, revenue and usage insights at a glance.",
  },
];

// Parent controls stagger timing; children just declare hidden/show states.
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Features() {
  return (
    <Box
      component="section"
      id="features"
      sx={{
        position: "relative",
        bgcolor: "#F5F8FF",
        pt: { xs: 8, sm: 9, md: 10 },
        overflow: "hidden",
      }}
    >
      <FloatingBackground icons={false} />

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, pb: { xs: 8, sm: 9, md: 10 } }}
      >
        {/* Section header */}
        <Stack
          alignItems="center"
          textAlign="center"
          spacing={2}
          sx={{ mb: { xs: 6, md: 7.5 } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "#1E3A8A",
                fontWeight: 800,
                letterSpacing: "0.12em",
              }}
            >
              Features
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.9rem", sm: "2.2rem", md: "2.6rem" },
                lineHeight: 1.2,
                color: "#0F172A",
              }}
            >
              Everything parking needs, built in
            </Typography>

            {/* Animated underline accent */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  height: 4,
                  width: 64,
                  borderRadius: 999,
                  transformOrigin: "center",
                  background: "linear-gradient(90deg, #2563EB, #1E3A8A)",
                }}
              />
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 560, px: { xs: 1, sm: 0 } }}
            >
              A complete toolkit for drivers and operators — from the moment a
              search starts to the moment the gate lifts.
            </Typography>
          </motion.div>
        </Stack>

        {/* Feature cards — true CSS grid so every card (both rows, all columns)
            shares the exact same height, not just cards within a single row. */}
        <Box
          component={motion.div}
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gridAutoRows: "1fr",
            gap: { xs: 3, sm: 3, md: 4 },
          }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ height: "100%" }}
            >
              <Card
                sx={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: { xs: 3, md: 3.5 },
                  borderRadius: "22px",
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(15,23,42,0.06)",
                  boxShadow: "0 4px 20px rgba(15,23,42,0.05)",
                  transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                  overflow: "hidden",
                  "&:hover": {
                    boxShadow: "0 28px 60px -18px rgba(37,99,235,0.4)",
                    borderColor: "rgba(37,99,235,0.2)",
                  },
                  "&:hover .glow-ring": { opacity: 1 },
                  "&:hover .feature-icon": {
                    transform: "rotate(-6deg) scale(1.08)",
                    boxShadow: "0 14px 30px rgba(37,99,235,0.5)",
                  },
                }}
              >
                {/* Animated glowing gradient border, revealed on hover */}
                <Box
                  className="glow-ring"
                  aria-hidden
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    padding: "1.5px",
                    background:
                      "linear-gradient(135deg, #2563EB, #1E3A8A, #60A5FA)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    opacity: 0,
                    transition: "opacity 0.45s ease",
                    pointerEvents: "none",
                  }}
                />

                <Box
                  className="feature-icon"
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    mb: 2.5,
                    color: "#fff",
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
                    boxShadow: "0 10px 24px rgba(37,99,235,0.35)",
                    transition:
                      "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease",
                  }}
                >
                  {f.icon}
                </Box>

                <Typography
                  variant="h6"
                  sx={{ color: "#0F172A", mb: 1, fontSize: "1.1rem" }}
                >
                  {f.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.65, flexGrow: 1 }}
                >
                  {f.desc}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      <SectionDivider tone="light" />
    </Box>
  );
}
