"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    current: number;
    max: number;
}

export const ProgressBar = ({ current, max }: ProgressBarProps) => {
    const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
    return (
        <div className="w-full">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-1.5 text-muted-foreground">
                <span>{current.toLocaleString('en-US')} / {max.toLocaleString('en-US')} MRU</span>
                <span className="text-primary font-bold">{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                />
            </div>
        </div>
    );
};
