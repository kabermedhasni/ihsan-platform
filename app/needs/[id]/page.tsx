"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Share2,
    Info,
    AlertCircle
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Import refactored components
import { NeedHeader } from '@/components/needs/NeedHeader';
import { FundingProgress } from '@/components/needs/FundingProgress';
import { BeneficiariesCard } from '@/components/needs/BeneficiariesCard';
import { NeedDescription } from '@/components/needs/NeedDescription';
import { ValidatorCard } from '@/components/needs/ValidatorCard';
import { LocationCard } from '@/components/needs/LocationCard';
import { DonationPanel } from '@/components/needs/DonationPanel';
import { TransparencySection } from '@/components/needs/TransparencySection';
import { Spinner } from "@/components/ui/spinner";

// --- TYPES ---
import { Need } from '@/types/need';

// --- ANIMATION VARIANTS ---

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// --- PAGE ---

export default function NeedDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params for Next.js 15
    const resolvedParams = use(params);
    const [need, setNeed] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations("needsDetail");

    useEffect(() => {
        const fetchNeedData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/needs/${resolvedParams.id}`);
                if (!response.ok) {
                    throw new Error(t("error") || "Failed to fetch need details");
                }
                const data = await response.json();
                setNeed(data);
            } catch (err: any) {
                console.error("Error fetching need:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (resolvedParams.id) {
            fetchNeedData();
        }
    }, [resolvedParams.id, t]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Spinner size="xl" className="text-primary" />
                <p className="mt-6 text-foreground font-black uppercase tracking-widest text-sm animate-pulse">
                    {t("loading")}
                </p>
            </div>
        );
    }

    if (error || !need) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight">{t("error")}</h2>
                    <p className="text-muted-foreground font-medium">{error || t("notFound")}</p>
                    <Link href="/catalog" className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
                        {t("backToCatalog")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">

            {/* Navigation Header */}
            <nav className="bg-card/80 backdrop-blur-2xl border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <Link href="/catalog" className="flex items-center gap-3 font-black text-foreground hover:text-primary transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center border border-border group-hover:bg-primary/10 group-hover:border-primary/30">
                            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </div>
                        <span className="text-sm uppercase tracking-widest hidden sm:block">{t("backToCatalog")}</span>
                    </Link>

                    <Link href="/" className="flex items-center gap-2 scale-110">
                        <span className="text-2xl font-black tracking-tighter text-primary">IHSAN</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        >
                            <Share2 className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col lg:flex-row gap-16"
                >

                    {/* Left Column: Details */}
                    <div className="flex-1 min-w-0">
                        <NeedHeader need={need} />

                        <FundingProgress
                            current={need.fundedAmount}
                            target={need.targetAmount}
                            donors={need.donorsCount}
                        />

                        <BeneficiariesCard count={need.beneficiaries} />

                        <NeedDescription description={need.description} />

                        <div className="grid md:grid-cols-2 gap-10">
                            <ValidatorCard name={need.validatorName} />
                            <LocationCard city={need.city} district={need.district} />
                        </div>

                        {/* Desktop Transparency */}
                        <div className="hidden lg:block">
                            <TransparencySection />
                        </div>
                    </div>

                    {/* Right Column: Donation Panel */}
                    <div className="w-full lg:w-[460px] flex-shrink-0">
                        <DonationPanel />

                        <div className="lg:hidden mt-12">
                            <TransparencySection />
                        </div>

                        <motion.div
                            variants={fadeIn}
                            className="mt-12 bg-card rounded-3xl p-8 border border-border shadow-sm overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 bg-primary rounded-bl-3xl">
                                <Info className="w-12 h-12 text-primary-foreground" />
                            </div>
                            <h4 className="font-black text-foreground mb-2 uppercase tracking-widest text-[10px]">{t("taxInfo.title")}</h4>
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                {t("taxInfo.description")}
                            </p>
                        </motion.div>
                    </div>

                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-border bg-card">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tighter text-primary">IHSAN</span>
                        </div>
                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
                            Built for Impact • © 2026
                        </p>
                        <div className="flex gap-6">
                            {['Terms', 'Privacy', 'Contact'].map(item => (
                                <a key={item} href="#" className="text-muted-foreground hover:text-primary text-xs font-black uppercase tracking-widest transition-colors">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
