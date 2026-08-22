import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import {
  MdLocationCity,
  MdApartment,
  MdBusinessCenter,
  MdLocalMall,
  MdFlight,
  MdSchool,
} from "react-icons/md";

const partners = [
  { label: "City Parking", icon: <MdLocationCity size={26} /> },
  { label: "Smart City", icon: <MdApartment size={26} /> },
  { label: "Corporate Offices", icon: <MdBusinessCenter size={26} /> },
  { label: "Shopping Mall", icon: <MdLocalMall size={26} /> },
  { label: "Airport", icon: <MdFlight size={26} /> },
  { label: "University", icon: <MdSchool size={26} /> },
];

export default function TrustedBy() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#F5F8FF" }}>
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", mb: 4, textTransform: "uppercase" }}
        >
          Trusted by teams managing parking everywhere
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {partners.map((p, i) => (
            <Grid item xs={6} sm={4} md={2} key={p.label}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    color: "#94A3B8",
                    filter: "grayscale(1)",
                    opacity: 0.75,
                    transition: "all 0.3s ease",
                    cursor: "default",
                    "&:hover": {
                      color: "#1E3A8A",
                      filter: "grayscale(0)",
                      opacity: 1,
                    },
                  }}
                >
                  {p.icon}
                  <Typography variant="caption" fontWeight={600} align="center">
                    {p.label}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
