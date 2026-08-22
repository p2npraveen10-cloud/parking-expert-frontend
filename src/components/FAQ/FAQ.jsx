import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";

const faqs = [
  {
    q: "How does booking work?",
    a: "Search for a lot near your destination, pick an open slot and time window, then confirm — your reservation and QR pass are ready instantly.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. Bookings can be cancelled from your dashboard up until the reserved start time, with refunds processed per the lot's cancellation window.",
  },
  {
    q: "How does payment work?",
    a: "Payments are processed through an encrypted checkout at the time of booking, with a digital receipt emailed and saved to your account.",
  },
  {
    q: "How does QR entry work?",
    a: "Each booking generates a unique QR code. Scan it at the gate or entry kiosk and the barrier opens automatically — no ticket, no queue.",
  },
  {
    q: "Is my data secure?",
    a: "All personal and payment data is encrypted in transit and at rest, and we never share your information with third parties without consent.",
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = useState("panel0");

  return (
    <Box component="section" sx={{ py: { xs: 10, md: 12 }, bgcolor: "#FFFFFF" }}>
      <Container maxWidth="md">
        <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 6 }}>
          <Typography variant="overline" sx={{ color: "#1E3A8A", fontWeight: 800, letterSpacing: "0.12em" }}>
            FAQ
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, color: "#0F172A" }}>
            Questions, answered
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Accordion
                expanded={expanded === `panel${i}`}
                onChange={() => setExpanded(expanded === `panel${i}` ? false : `panel${i}`)}
                disableGutters
                elevation={0}
                sx={{
                  borderRadius: "18px !important",
                  border: "1px solid rgba(15,23,42,0.08)",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<HiChevronDown size={20} color="#1E3A8A" />}
                  sx={{ px: 3, py: 1 }}
                >
                  <Typography fontWeight={700} color="#0F172A">
                    {f.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {f.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
