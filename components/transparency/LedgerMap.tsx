"use client";

import { motion } from "framer-motion";
import { Map as MapIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const LedgerMap = () => {
    const t = useTranslations("transparency.map");
    return (
        <section className="container mx-auto max-w-7xl px-6 mb-32">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tighter">{t("title")}</h2>
                    <p className="text-muted-foreground font-medium mt-1">{t("subtitle")}</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/20 text-xs font-black uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-primary" /> Confirmed
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 text-xs font-black uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> In Progress
                    </div>
                </div>
            </div>

            <div className="bg-muted/20 rounded-[2.5rem] h-[500px] relative overflow-hidden group border border-border shadow-inner">
                {/* Map Placeholder */}
                <div className="absolute inset-0 bg-background opacity-40 mix-blend-multiply" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-sm pointer-events-none">
                    <MapIcon className="w-96 h-96 text-foreground" />
                </div>

                {/* Simulated Markers */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute top-1/4 left-1/3 w-6 h-6 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer group/marker"
                >
                    <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg" />
                    <div className="absolute bottom-full mb-3 hidden group-hover/marker:block z-20">
                        <div className="bg-card p-4 rounded-xl shadow-2xl border border-border min-w-[200px]">
                            <p className="text-[10px] font-black text-primary uppercase mb-1">Food Distribution</p>
                            <p className="text-sm font-black text-foreground tracking-tight">Nouakchott Central</p>
                            <div className="flex justify-between mt-3 pt-3 border-t border-border items-center">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">1,500 MRU</span>
                                <span className="text-[10px] font-black text-primary">Delivered</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                    className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer group/marker"
                >
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-background shadow-lg" />
                </motion.div>

                <div className="absolute bottom-8 right-8 bg-card/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-border max-w-xs transition-all hover:scale-105">
                    <p className="text-xs font-black text-foreground mb-2">Real-time Coverage</p>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                        Map shows active delivery sites. Click markers to view on-site verification data.
                    </p>
                </div>
            </div>
        </section>
    );
};
