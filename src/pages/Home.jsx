import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AIAndEmergency from "../components/AIAndEmergency";
import CTAAndFooter from "../components/CTAAndFooter";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <AIAndEmergency />
      <CTAAndFooter />
    </div>
  );
};

export default Home;
