"use client";

import { motion } from "framer-motion";
import { X, ShieldCheck, MapPin, Calendar, User, ExternalLink } from "lucide-react";
import { Transaction } from "./types";

import { useTranslations } from "next-intl";

export const TransactionDetailsModal = ({ tx, onClose }: { tx: Transaction, onClose: () => void }) => {
    const t = useTranslations("transparency.modal");
    const tCatalog = useTranslations("catalog");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-4xl bg-card rounded-[2.5rem] shadow-2xl border border-border overflow-hidden relative z-10"
            >
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 rtl:right-auto rtl:left-8 w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-12 text-left rtl:text-right">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{t("verified")}</p>
                                <p className="text-xl font-black text-foreground tracking-tighter">{t("impactDetails")}</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">{t("location")}</p>
                                    <p className="text-sm font-bold text-foreground">{tx.city}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">{t("dateVerified")}</p>
                                    <p className="text-sm font-bold text-foreground">{tx.timestamp}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">{t("fieldValidator")}</p>
                                    <p className="text-sm font-bold text-foreground">{tx.validator}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-muted/50 rounded-2xl border border-border mb-8">
                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-2">{t("ledgerHash")}</p>
                            <p className="text-[10px] font-mono text-primary font-bold break-all leading-relaxed">
                                {tx.hash}
                            </p>
                        </div>

                        <button className="w-full h-16 bg-muted text-foreground rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-muted/80 transition-all flex items-center justify-center gap-3">
                            {t("viewProof")} <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-muted relative min-h-[400px]">
                        {tx.proofImage && (
                            <img
                                src={tx.proofImage}
                                alt="On-site verification"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-8 left-8 rtl:left-auto rtl:right-8 text-left rtl:text-right">
                            <p className="text-white text-lg font-black tracking-tight mb-1">{t("onSiteConfirmation")}</p>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{t("capturedBy")}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
