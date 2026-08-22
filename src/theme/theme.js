import { createTheme } from "@mui/material/styles";

// Design tokens — Parking Expert
// Primary Blue Gradient: #2563EB -> #1E3A8A
// Display face: Plus Jakarta Sans (headlines, carries the brand's confident SaaS voice)
// Body / UI face: Inter (neutral, highly legible for dashboard-adjacent copy)

export const tokens = {
  colors: {
    primary: "#2563EB",
    primaryDark: "#1E3A8A",
    gradient: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
    gradientSoft: "linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(30,58,138,0.10) 100%)",
    ink: "#0F172A",
    slate: "#475569",
    mist: "#64748B",
    surface: "#FFFFFF",
    canvas: "#F5F8FF",
    line: "rgba(15, 23, 42, 0.08)",
    glass: "rgba(255, 255, 255, 0.65)",
  },
  radius: { sm: 14, md: 20, lg: 24, xl: 32 },
  shadow: {
    soft: "0 4px 20px rgba(15, 23, 42, 0.06)",
    card: "0 20px 45px -12px rgba(30, 58, 138, 0.18)",
    lift: "0 30px 60px -15px rgba(37, 99, 235, 0.35)",
  },
};

const theme = createTheme({
  palette: {
    primary: { main: tokens.colors.primary, dark: tokens.colors.primaryDark },
    text: { primary: tokens.colors.ink, secondary: tokens.colors.slate },
    background: { default: tokens.colors.canvas, paper: tokens.colors.surface },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: tokens.radius.md },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, padding: "12px 28px" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow.card,
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default theme;
