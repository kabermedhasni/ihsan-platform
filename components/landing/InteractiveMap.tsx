"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2 } from "lucide-react";

// Dynamic import for MapContainer to avoid SSR issues
const Map = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary/20 animate-pulse rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  ),
});

interface InteractiveMapProps {
  needs?: any[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  title?: string;
  description?: string;
  showTitle?: boolean;
}

export default function InteractiveMap({
  needs,
  center,
  zoom,
  height = "500px",
  title,
  description,
  showTitle = true,
}: InteractiveMapProps) {
  const t = useTranslations("map");
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <section className={showTitle ? "py-24 bg-background" : ""} id="map">
      <div className={showTitle ? "container mx-auto px-4" : ""}>
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {title || t("title")}
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              {description || t("description")}
            </p>
          </div>
        )}

        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl group"
          style={{ height }}
        >
          <Map
            needs={needs}
            center={center}
            zoom={zoom}
            isInteractive={isInteracting}
          />

          <AnimatePresence>
            {!isInteracting && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsInteracting(true)}
                className="absolute inset-0 z-10 bg-background/40 backdrop-blur-[2px] cursor-pointer flex flex-col items-center justify-center gap-4 group/overlay"
              >
                <div className="p-4 rounded-full bg-primary/20 text-primary border border-primary/20 group-hover/overlay:scale-110 group-hover/overlay:bg-primary group-hover/overlay:text-white transition-all duration-300">
                  <MousePointer2 className="w-8 h-8" />
                </div>
                <p className="text-white font-bold text-lg bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                  {t("clickToInteract") || "Click to Interact"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {isInteracting && (
            <button
              onClick={() => setIsInteracting(false)}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-background/80 backdrop-blur-md border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-primary hover:border-primary transition-all"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
