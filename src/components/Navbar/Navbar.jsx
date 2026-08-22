import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Stack,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { TbParkingCircleFilled } from "react-icons/tb";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlowButton from "../common/GlowButton";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      component={motion.header}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.75)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 8px 32px rgba(15,23,42,0.08)" : "none",
        borderBottom: scrolled ? "1px solid rgba(15,23,42,0.06)" : "1px solid transparent",
        transition: "all 0.35s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1.5, justifyContent: "space-between" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ cursor: "pointer" }}
            onClick={() => handleNavClick("#home")}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
                boxShadow: "0 6px 18px rgba(37,99,235,0.35)",
              }}
            >
              <TbParkingCircleFilled size={22} color="#fff" />
            </Box>
            <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: 800 }}>
              Parking Expert
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={4}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                sx={{
                  color: "#0F172A",
                  fontWeight: 600,
                  "&:hover": { color: "#2563EB", backgroundColor: "transparent" },
                }}
                disableRipple
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={() => navigate("/login")}
              sx={{ color: "#1E3A8A", fontWeight: 700 }}
            >
              Login
            </Button>
            <GlowButton size="medium" onClick={() => navigate("/signup")}>
              Register
            </GlowButton>
          </Stack>

          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "#0F172A" }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HiOutlineMenu size={24} />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, height: "100%", p: 3, backgroundColor: "#fff" }}>
          <Stack direction="row" justifyContent="flex-end">
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <HiOutlineX size={22} />
            </IconButton>
          </Stack>
          <List>
            {navLinks.map((link) => (
              <ListItemButton key={link.label} onClick={() => handleNavClick(link.href)}>
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            ))}
          </List>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => navigate("/login")}>
              Login
            </Button>
            <GlowButton fullWidth onClick={() => navigate("/signup")}>
              Register
            </GlowButton>
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}
