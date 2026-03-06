"use client";

import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const TransparencySection = () => {
    const t = useTranslations("needsDetail");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 p-10 bg-secondary/20 rounded-[2.5rem] border border-border text-foreground relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-colors duration-500 group-hover:bg-primary/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
                        <ShieldCheck className="w-3 h-3" />
                        {t("transparency.badge")}
                    </div>
                    <h3 className="text-3xl font-black mb-4 tracking-tight">{t("transparency.title")}</h3>
                    <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                        {t("transparency.description")}
                    </p>
                </div>
                <motion.button
                    whileHover={{ x: 5 }}
                    className="whitespace-nowrap bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 self-start md:self-center shadow-xl hover:bg-primary/90 shadow-primary/20"
                >
                    {t("transparency.button")}
                    <ArrowRight className="w-5 h-5" />
                </motion.button>
            </div>
        </motion.div>
    );
};
