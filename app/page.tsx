import Hero from "@/components/landing/Hero";
import Ticker from "@/components/landing/Ticker";
import HowItWorks from "@/components/landing/HowItWorks";
import InteractiveMap from "@/components/landing/InteractiveMap";
import TrustSection from "@/components/landing/TrustSection";
import PublicLedger from "@/components/landing/PublicLedger";
import FinalCTA from "@/components/landing/FinalCTA";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden" dir="ltr">
      <Navbar />
      <Hero />
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
      <Footer />
    </div>
  );
}
