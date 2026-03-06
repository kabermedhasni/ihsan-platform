"use client";

import React, { use } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Share2,
    Info
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

// Import refactored components
import { NeedHeader } from '@/components/needs/NeedHeader';
import { FundingProgress } from '@/components/needs/FundingProgress';
import { BeneficiariesCard } from '@/components/needs/BeneficiariesCard';
import { NeedDescription } from '@/components/needs/NeedDescription';
import { ValidatorCard } from '@/components/needs/ValidatorCard';
import { LocationCard } from '@/components/needs/LocationCard';
import { DonationPanel } from '@/components/needs/DonationPanel';
import { TransparencySection } from '@/components/needs/TransparencySection';

// --- TYPES ---
import { Need } from '@/types/need';

// --- MOCK DATA ---

const MOCK_NEED: any = { // Using any temporarily as the global Need type might slightly differ
    id: "need_123",
    title: "5 Iftar Meals for Families in Need",
    city: "Nouakchott",
    district: "Tevragh Zeina",
    category: "Food",
    description: "This request funds Iftar meals for five families during Ramadan. Each meal set includes traditional staples and nutritional items to ensure families can break their fast with dignity and health. Your contribution directly supports local families who are struggling with food security during this holy month.",
    targetAmount: 5000,
    fundedAmount: 2350,
    donorsCount: 12,
    beneficiaries: 5,
    validatorName: "Ahmed Salem",
    status: "Open",
    createdAt: "2024-03-01T10:00:00Z"
};

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
    const need = MOCK_NEED;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">

            {/* Navigation Header */}
            <nav className="bg-card/80 backdrop-blur-2xl border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <Link href="/catalog" className="flex items-center gap-3 font-black text-foreground hover:text-primary transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center border border-border group-hover:bg-primary/10 group-hover:border-primary/30">
                            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </div>
                        <span className="text-sm uppercase tracking-widest hidden sm:block">Back to Catalog</span>
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
                            <h4 className="font-black text-foreground mb-2 uppercase tracking-widest text-[10px]">Tax Information</h4>
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                As a registered non-profit platform, your donations may be eligible for tax deductions. An automated receipt will be sent to your email after successful completion.
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
