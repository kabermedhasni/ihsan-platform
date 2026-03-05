"use client";

import { motion } from "framer-motion";
import { ShieldCheck, EyeOff, FileCheck } from "lucide-react";

const trustCards = [
    {
        icon: ShieldCheck,
        title: "Targeted Donations",
        description: "Ensure your donation goes directly to the case you chose without deductions.",
    },
    {
        icon: EyeOff,
        title: "Asymmetric Anonymity",
        description: "We protect your identity completely while providing full transparency on the path of your funds.",
    },
    {
        icon: FileCheck,
        title: "Proof of Impact",
        description: "Receive documented reports with photos and data as soon as the delivery process is complete.",
    },
];

export default function TrustSection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {trustCards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-500"
                        >
                            <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <card.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 text-left">
                                {card.title}
                            </h3>
                            <p className="text-foreground/70 text-left leading-relaxed">
                                {card.description}
                            </p>

                            {/* Subtle accent light */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
