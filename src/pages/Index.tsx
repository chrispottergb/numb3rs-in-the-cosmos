import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import DivinityCommons from "@/components/DivinityCommons";
import ApothecarySection from "@/components/ApothecarySection";
import FrequencyChamber from "@/components/FrequencyChamber";
import ResonanceRoom from "@/components/ResonanceRoom";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <DivinityCommons />
      <ApothecarySection />
      <FrequencyChamber />
      <ResonanceRoom />
      <Footer />
    </main>
  );
};

export default Index;
