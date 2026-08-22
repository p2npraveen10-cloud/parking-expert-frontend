import { Box, Container, Grid, Typography, Stack, IconButton, Divider } from "@mui/material";
import { TbParkingCircleFilled } from "react-icons/tb";
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebookF } from "react-icons/fa";

const linkColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export default function Footer() {
  const scrollTo = (href) => {
    if (href === "#") return;
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box component="footer" id="contact" sx={{ bgcolor: "#0F172A", color: "rgba(255,255,255,0.8)", pt: { xs: 8, md: 10 }, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "11px",
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
                }}
              >
                <TbParkingCircleFilled size={20} color="#fff" />
              </Box>
              <Typography variant="h6" fontWeight={800} color="#fff">
                Parking Expert
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ maxWidth: 320, color: "rgba(255,255,255,0.6)", mb: 3 }}>
              Real-time parking discovery, booking and access — for drivers
              and operators who value their time.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[FaTwitter, FaLinkedin, FaInstagram, FaFacebookF].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  aria-label="social link"
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.08)",
                    "&:hover": { bgcolor: "rgba(37,99,235,0.4)" },
                  }}
                >
                  <Icon size={15} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {linkColumns.map((col) => (
            <Grid item xs={6} md={2} key={col.title}>
              <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ mb: 2 }}>
                {col.title}
              </Typography>
              <Stack spacing={1.25}>
                {col.links.map((l) => (
                  <Typography
                    key={l.label}
                    variant="body2"
                    onClick={() => scrollTo(l.href)}
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      width: "fit-content",
                      "&:hover": { color: "#fff" },
                    }}
                  >
                    {l.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ mb: 2 }}>
              Get in touch
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 0.5 }}>
              support@parkingexpert.app
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Mon–Sat, 9am–8pm
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} Parking Expert. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", cursor: "pointer", "&:hover": { color: "#fff" } }}>
              Privacy Policy
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", cursor: "pointer", "&:hover": { color: "#fff" } }}>
              Terms
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
