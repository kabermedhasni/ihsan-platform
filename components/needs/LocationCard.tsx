"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationCardProps {
    city: string;
    district: string;
}

export const LocationCard = ({ city, district }: LocationCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
    >
        <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
            </span>
            Location Details
        </h2>
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
            <div className="p-8">
                <p className="font-black text-2xl text-foreground mb-1">{city}</p>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">{district}</p>
            </div>
            <div className="h-56 bg-secondary/20 relative flex items-center justify-center group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                {/* Placeholder for Map - can be replaced with Leaflet later */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative z-10 bg-card/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-2xl flex items-center gap-3"
                >
                    <MapPin className="w-6 h-6 text-primary" />
                    <span className="font-black text-sm text-foreground">Open in Maps</span>
                </motion.div>
            </div>
        </div>
    </motion.div>
);
