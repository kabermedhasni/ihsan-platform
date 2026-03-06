"use client";

import { useState } from "react";
import { Info, Search, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Transaction } from "./types";

export const VerificationPanel = ({ onVerify }: { onVerify: (query: string) => Promise<Transaction | null> }) => {
    const t = useTranslations("transparency.verify");
    const [search, setSearch] = useState("");
    const [result, setResult] = useState<Transaction | null>(null);
    const [searching, setSearching] = useState(false);

    const handleVerify = async () => {
        if (!search) return;
        setSearching(true);
        const found = await onVerify(search);
        setResult(found);
        setSearching(false);
    };

    return (
        <section className="container mx-auto max-w-7xl px-6 mb-32">
            <div className="bg-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/20 border border-border grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/20">
                            <Info className="w-3.5 h-3.5" /> Direct Verification
                        </div>
                        <h2 className="text-4xl font-black text-foreground tracking-tighter leading-tight mb-4">
                            {t("title")}
                        </h2>
                        <p className="text-muted-foreground font-medium">
                            {t("subtitle")}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("placeholder")}
                                className="w-full h-16 bg-muted/30 border-2 border-border rounded-2xl pl-14 pr-6 text-sm font-bold text-foreground focus:border-primary focus:bg-muted/50 transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={handleVerify}
                            disabled={searching}
                            className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {searching ? t("verifying") : t("button")}
                            {!searching && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>

                    {result === null && search && !searching && (
                        <p className="text-sm font-bold text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                            {t("notFound")}
                        </p>
                    )}
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-primary/5 p-8 rounded-[2rem] border-2 border-primary/20 relative"
                            >
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50" />
                                </div>
                                <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-primary" /> {t("recordFound")}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-border">
                                        <span className="text-[10px] font-black text-primary uppercase">Impact</span>
                                        <span className="text-lg font-black text-foreground">{result.amount} MRU</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-border">
                                        <span className="text-[10px] font-black text-primary uppercase">Beneficiaries</span>
                                        <span className="text-sm font-bold text-foreground">{result.beneficiaries} People</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-border">
                                        <span className="text-[10px] font-black text-primary uppercase">Location</span>
                                        <span className="text-sm font-bold text-foreground">{result.city}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-primary uppercase">Status</span>
                                        <span className="text-[10px] font-black bg-primary text-primary-foreground px-3 py-1 rounded-full uppercase">{result.status}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setResult(null)}
                                    className="mt-8 text-[10px] font-black text-primary uppercase tracking-widest hover:underline w-full text-center"
                                >
                                    {t("clear")}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="aspect-square bg-muted/20 rounded-[2.5rem] border-4 border-dashed border-border flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-20 h-20 bg-card rounded-3xl shadow-lg flex items-center justify-center mb-6 text-muted-foreground/30">
                                    <Shield className="w-10 h-10" />
                                </div>
                                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs leading-relaxed">
                                    Waiting for <br /> Verification Input
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
