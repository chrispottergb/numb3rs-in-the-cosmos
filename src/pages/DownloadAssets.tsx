import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Import all image assets
import raiment from "@/assets/369-raiment.png";
import beanieOrange from "@/assets/beanie-orange.jpeg";
import beanieWhite from "@/assets/beanie-white.jpeg";
import blackTourmaline from "@/assets/black-tourmaline-crystal.png";
import cosmicSealHero from "@/assets/cosmic-seal-hero.png";
import flowerOfLife from "@/assets/flower-of-life.png";
import hoodieBlack from "@/assets/hoodie-black.jpeg";
import hoodieGray from "@/assets/hoodie-gray.jpeg";
import hoodieNavy from "@/assets/hoodie-navy.jpeg";
import hoodieOrange from "@/assets/hoodie-orange.jpeg";
import jacketBlack from "@/assets/jacket-black.jpeg";
import jacketNavy from "@/assets/jacket-navy.jpeg";
import jacketRed from "@/assets/jacket-red.jpeg";
import lapisLazuli from "@/assets/lapis-lazuli-crystal.png";
import metatronsCube from "@/assets/metatrons-cube.png";
import cosmosBanner from "@/assets/numb3rs-cosmos-banner.jpeg";
import protectionHat from "@/assets/protection-hat.png";
import protectionHoodie from "@/assets/protection-hoodie.png";
import protectionJacket from "@/assets/protection-jacket.png";
import seedOfLife from "@/assets/seed-of-life.png";
import selenite from "@/assets/selenite-crystal.png";
import sriYantra from "@/assets/sri-yantra.png";
import torusField from "@/assets/torus-field.png";
import vesicaPiscis from "@/assets/vesica-piscis.png";

const imageAssets: Record<string, string> = {
  "369-raiment.png": raiment,
  "beanie-orange.jpeg": beanieOrange,
  "beanie-white.jpeg": beanieWhite,
  "black-tourmaline-crystal.png": blackTourmaline,
  "cosmic-seal-hero.png": cosmicSealHero,
  "flower-of-life.png": flowerOfLife,
  "hoodie-black.jpeg": hoodieBlack,
  "hoodie-gray.jpeg": hoodieGray,
  "hoodie-navy.jpeg": hoodieNavy,
  "hoodie-orange.jpeg": hoodieOrange,
  "jacket-black.jpeg": jacketBlack,
  "jacket-navy.jpeg": jacketNavy,
  "jacket-red.jpeg": jacketRed,
  "lapis-lazuli-crystal.png": lapisLazuli,
  "metatrons-cube.png": metatronsCube,
  "numb3rs-cosmos-banner.jpeg": cosmosBanner,
  "protection-hat.png": protectionHat,
  "protection-hoodie.png": protectionHoodie,
  "protection-jacket.png": protectionJacket,
  "seed-of-life.png": seedOfLife,
  "selenite-crystal.png": selenite,
  "sri-yantra.png": sriYantra,
  "torus-field.png": torusField,
  "vesica-piscis.png": vesicaPiscis,
};

const DownloadAssets = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadZip = async () => {
    setIsDownloading(true);
    setProgress(0);
    const zip = new JSZip();
    const imgFolder = zip.folder("images")!;
    const audioFolder = zip.folder("audio")!;

    const totalImages = Object.keys(imageAssets).length;
    let completed = 0;

    // Fetch and add images
    setStatus("Downloading images...");
    for (const [name, url] of Object.entries(imageAssets)) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        imgFolder.file(name, blob);
      } catch (e) {
        console.error(`Failed to fetch image ${name}`, e);
      }
      completed++;
      setProgress(Math.round((completed / (totalImages + 1)) * 50));
    }

    // Fetch audio tracks from database
    setStatus("Fetching audio tracks...");
    const { data: tracks } = await supabase.from("audio_tracks").select("*");

    if (tracks && tracks.length > 0) {
      const totalAudio = tracks.length;
      let audioCompleted = 0;

      setStatus("Downloading audio files...");
      for (const track of tracks) {
        try {
          const response = await fetch(track.file_url);
          const blob = await response.blob();
          const ext = track.file_url.split(".").pop()?.split("?")[0] || "mp3";
          const safeName = track.title.replace(/[^a-zA-Z0-9-_ ]/g, "") || track.id;
          audioFolder.file(`${safeName}.${ext}`, blob);
        } catch (e) {
          console.error(`Failed to fetch audio ${track.title}`, e);
        }
        audioCompleted++;
        setProgress(50 + Math.round((audioCompleted / totalAudio) * 40));
      }
    }

    // Generate zip
    setStatus("Creating zip file...");
    setProgress(90);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "numb3rs-cosmos-assets.zip");
    setProgress(100);
    setStatus("Download complete!");
    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-2xl font-display text-foreground">Asset Download</h1>
        <p className="text-muted-foreground text-sm">
          Downloads all {Object.keys(imageAssets).length} images and all audio tracks into a single .zip file.
        </p>

        <Button
          onClick={downloadZip}
          disabled={isDownloading}
          variant="sacred"
          size="lg"
          className="w-full"
        >
          {isDownloading ? "Downloading..." : "Download All Assets (.zip)"}
        </Button>

        {isDownloading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">{status} ({progress}%)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadAssets;
