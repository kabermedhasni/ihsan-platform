"use client";

import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface NeedDescriptionProps {
    description: string;
}

export const NeedDescription = ({ description }: NeedDescriptionProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
    >
        <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Info className="w-4 h-4 text-primary" />
            </span>
            Story & Mission
        </h2>
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <p className="text-foreground/80 leading-relaxed text-lg font-medium">
                {description}
            </p>
        </div>
    </motion.div>
);
