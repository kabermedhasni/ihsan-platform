"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

// Dynamic import for MapContainer to avoid SSR issues
const Map = dynamic(() => import("./MapInner"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-secondary/20 animate-pulse rounded-3xl flex items-center justify-center">
            <span className="text-foreground/40 font-medium">Loading Map...</span>
        </div>
    )
});

export default function InteractiveMap() {
    return (
        <section className="py-24 bg-secondary/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-primary mb-4"
                    >
                        Needs by Region
                    </motion.h2>
                    <p className="text-foreground/60 max-w-2xl mx-auto">
                        Track urgent needs across different areas of Nouakchott and contribute directly to meeting them.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl h-[500px]"
                >
                    <Map />
                </motion.div>
            </div>
        </section>
    );
}
