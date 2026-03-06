"use client";

import Hero from "@/components/landing/Hero";
import Ticker from "@/components/landing/Ticker";
import HowItWorks from "@/components/landing/HowItWorks";
import InteractiveMap from "@/components/landing/InteractiveMap";
import TrustSection from "@/components/landing/TrustSection";
import PublicLedger from "@/components/landing/PublicLedger";
import FinalCTA from "@/components/landing/FinalCTA";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <div id="home">
        <Hero />
      </div>
      <Ticker />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <TrustSection />
      <div id="map">
        <InteractiveMap />
      </div>
      <div id="transparency">
        <PublicLedger />
      </div>
      <FinalCTA />
    </div>
  );
}
