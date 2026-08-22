import { Box } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import TrustedBy from "../components/TrustedBy/TrustedBy";
import Features from "../components/Features/Features";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import DashboardShowcase from "../components/DashboardShowcase/DashboardShowcase";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import Stats from "../components/Stats/Stats";
import Testimonials from "../components/Testimonials/Testimonials";
import FAQ from "../components/FAQ/FAQ";
import CTA from "../components/CTA/CTA";
import Footer from "../components/Footer/Footer";

export default function LandingPage() {
  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "#FFFFFF" }}>
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <DashboardShowcase />
      <WhyChoose />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </Box>
  );
}
