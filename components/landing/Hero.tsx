"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Globe, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
    const [stats, setStats] = useState([
        { label: "Total Donations", value: "...", icon: Wallet },
        { label: "Verified Operations", value: "...", icon: CheckCircle },
        { label: "Cities Covered", value: "...", icon: Globe },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats/global');
                const data = await response.json();

                setStats([
                    { label: "Total Donations", value: `${(data.totalDonated / 1000).toFixed(1)}k+ MRU`, icon: Wallet },
                    { label: "Verified Operations", value: `${data.verifiedCount}`, icon: CheckCircle },
                    { label: "Cities Covered", value: `${data.citiesCovered}`, icon: Globe },
                ]);
            } catch (error) {
                console.error('Error fetching global stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background -z-10" />

            {/* Animated Shapes */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left flex flex-col items-center lg:items-start"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
                        >
                            Your donation... <span className="text-primary">is traceable</span> <br /> until delivery
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg md:text-xl text-foreground/80 mb-10 max-w-xl leading-relaxed"
                        >
                            Ihsan platform ensures that every Ouguiya reaches its beneficiaries with full transparency through live tracking technology.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Link
                                href="/needs"
                                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
                            >
                                Browse Needs
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats Card (Desktop) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="hidden lg:block relative"
                    >
                        <div className="grid grid-cols-1 gap-6 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="p-4 rounded-xl bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                                        <stat.icon className="w-8 h-8" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="text-3xl font-bold text-white mb-1 tracking-tight">
                                            {stat.value}
                                        </div>
                                        <div className="text-foreground/60 text-sm font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Trust Badge */}
                            <div className="absolute -bottom-6 -right-6 p-4 bg-primary rounded-2xl shadow-xl flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-white" />
                                <span className="text-white font-bold text-sm">100% Verified Operations</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
