import { useRef } from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  TbBolt,
  TbCompass,
  TbShieldCheck,
  TbEye,
  TbTag,
  TbHeadset,
} from "react-icons/tb";

const reasons = [
  { icon: TbBolt, title: "Fast Booking", desc: "Reserve a slot in under 30 seconds, start to finish.", area: "a", size: "lg" },
  { icon: TbCompass, title: "Smart Navigation", desc: "Turn-by-turn directions straight to your reserved spot.", area: "b", size: "md" },
  { icon: TbShieldCheck, title: "Secure Platform", desc: "Encrypted payments and verified access at every gate.", area: "c", size: "md" },
  { icon: TbEye, title: "Live Availability", desc: "Real slot counts, not estimates — updated every second.", area: "d", size: "lg" },
  { icon: TbTag, title: "Affordable Pricing", desc: "Transparent rates with zero hidden booking fees.", area: "e", size: "sm" },
  { icon: TbHeadset, title: "24x7 Support", desc: "A real support team on call, any hour of the day.", area: "f", size: "sm" },
];

/* ---------------- Reusable variants ---------------- */

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
};

/* ---------------- Background ambience ---------------- */

function Ambience() {
  return (
    <Box className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1E3A8A 1px, transparent 1px), linear-gradient(90deg, #1E3A8A 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <motion.div
        className="absolute -top-24 -left-16 w-[380px] h-[380px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.10), transparent 70%)", filter: "blur(12px)" }}
        animate={{ y: [0, 22, 0], x: [0, 14, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -right-20 w-[420px] h-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(30,58,138,0.08), transparent 70%)", filter: "blur(12px)" }}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <Box
        className="absolute inset-0"
        sx={{ background: "radial-gradient(circle at 50% 25%, rgba(37,99,235,0.05), transparent 55%)" }}
      />
    </Box>
  );
}

/* ---------------- Feature card ---------------- */
/* Internal alignment is now identical across every card, regardless of
   bento size: icon → title → divider → description, all left-aligned,
   all top-anchored, with the same spacing scale. Large cards get more
   room to breathe (bigger icon, more padding) but the structure and
   vertical rhythm never change between cards. */

function FeatureCard({ reason }) {
  const Icon = reason.icon;
  const isLg = reason.size === "lg";

  return (
    <motion.div variants={cardVariant} style={{ gridArea: reason.area, height: "100%" }}>
      <motion.div
        whileHover={{ y: -6, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group h-full"
      >
        <div
          className="rounded-[28px] p-[1.5px] h-full transition-all duration-300"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(147,169,242,0.12))" }}
        >
          <Box
            className="relative h-full backdrop-blur-md transition-shadow duration-300 overflow-hidden"
            sx={{
              borderRadius: "27px",
              background: "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(239,246,255,0.75))",
              p: { xs: 3, md: isLg ? 4 : 3.25 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              height: "100%",
              minHeight: { xs: 190, md: isLg ? 260 : 190 },
              boxShadow: "0 4px 20px rgba(15,23,42,0.05)",
              "&:hover": {
                boxShadow: "0 24px 48px -18px rgba(37,99,235,0.35)",
              },
            }}
          >
            <Box
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              sx={{
                borderRadius: "27px",
                background: "radial-gradient(180px circle at 20% 15%, rgba(37,99,235,0.10), transparent 70%)",
              }}
            />

            {/* Fixed-height icon slot keeps every title starting at the same
               baseline, whether the icon is the large or small variant. */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                height: 58,
                display: "flex",
                alignItems: "flex-end",
                mb: 2,
              }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                  whileHover={{ rotate: 8, scale: 1.12 }}
                  style={{
                    width: isLg ? 58 : 50,
                    height: isLg ? 58 : 50,
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    color: "#1E3A8A",
                    background: "rgba(37,99,235,0.1)",
                    transition: "box-shadow 0.3s ease, color 0.3s ease",
                  }}
                  className="group-hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] group-hover:text-[#2563EB]"
                >
                  <Icon size={isLg ? 28 : 24} />
                </motion.div>
              </motion.div>
            </Box>

            <Stack sx={{ position: "relative", zIndex: 1, alignItems: "flex-start", textAlign: "left", width: "100%" }}>
              <Typography
                variant={isLg ? "h6" : "subtitle1"}
                fontWeight={800}
                color="#0F172A"
                sx={{ mb: 1, lineHeight: 1.3 }}
              >
                {reason.title}
              </Typography>

              <Box
                sx={{
                  width: 28,
                  height: 3,
                  borderRadius: 999,
                  mb: 1.25,
                  background: "linear-gradient(90deg, #2563EB, #93A9F2)",
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7, maxWidth: isLg ? 340 : "100%" }}
              >
                {reason.desc}
              </Typography>
            </Stack>
          </Box>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Main Section ---------------- */

export default function WhyChooseUs() {
  const headingRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: headingRef, offset: ["start end", "end start"] });
  const underlineScale = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <Box component="section" sx={{ position: "relative", py: { xs: 10, md: 12 }, bgcolor: "#FFFFFF", overflow: "hidden" }}>
      <Ambience />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box ref={headingRef} sx={{ textAlign: "center", mb: { xs: 7, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
          >
            <Typography variant="overline" sx={{ color: "#1E3A8A", fontWeight: 800, letterSpacing: "0.12em" }}>
              Why Parking Expert
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}
            >
              Built for drivers who don't have{" "}
              <Box
                component="span"
                sx={{
                  backgroundImage: "linear-gradient(90deg, #2563EB, #1E3A8A)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                time to circle
              </Box>{" "}
              the block
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1.25 }}>
              <motion.div
                style={{
                  scaleX: underlineScale,
                  transformOrigin: "left",
                  height: 3,
                  width: 110,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #2563EB, #93A9F2)",
                }}
              />
            </Box>
          </motion.div>
        </Box>

        <Box
          component={motion.div}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerStagger}
          className="grid gap-6"
          sx={{
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "7fr 5fr" },
            gridTemplateAreas: {
              xs: `"a" "b" "c" "d" "e" "f"`,
              sm: `"a a" "b c" "d d" "e f"`,
              md: `"a b" "c d" "e f"`,
            },
          }}
        >
          {reasons.map((r) => (
            <FeatureCard key={r.title} reason={r} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}