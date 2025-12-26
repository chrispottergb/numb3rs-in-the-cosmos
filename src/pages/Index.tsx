import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ResonanceRoom from "@/components/ResonanceRoom";
import MerchPreview from "@/components/MerchPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ResonanceRoom />
      <MerchPreview />
      <Footer />
    </main>
  );
};

export default Index;
