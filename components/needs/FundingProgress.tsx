"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface FundingProgressProps {
    current: number;
    target: number;
    donors: number;
}

export const FundingProgress = ({ current, target, donors }: FundingProgressProps) => {
    const t = useTranslations("needsDetail");
    const percentage = Math.min(Math.round((current / target) * 100), 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-3xl p-8 border border-border mb-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                <Heart className="w-24 h-24 text-primary fill-primary" />
            </div>

            <div className="flex justify-between items-end mb-5">
                <div>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">{t("fundingTitle")}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-foreground">{current.toLocaleString()}</span>
                        <span className="text-muted-foreground font-bold text-lg">/ {target.toLocaleString()} MRU</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-primary font-black text-3xl">{percentage}%</span>
                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">{t("completed")}</p>
                </div>
            </div>

            <div className="h-4 w-full bg-muted rounded-full overflow-hidden mb-6 p-1">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                />
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        +{Math.max(0, donors - 3)}
                    </div>
                </div>
                <span><strong className="text-foreground font-black">{t("donorsCount", { count: donors })}</strong></span>
            </div>
        </motion.div>
    );
};
