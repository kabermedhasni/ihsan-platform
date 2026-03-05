"use client";

import { motion } from "framer-motion";
import {
    ClipboardCheck,
    HandCoins,
    CreditCard,
    Truck,
    Camera,
    LayoutDashboard
} from "lucide-react";

const steps = [
    {
        icon: ClipboardCheck,
        title: "Investigator Posts a Need",
        description: "Our field investigators accurately document cases in need.",
    },
    {
        icon: HandCoins,
        title: "Donor Chooses Funding",
        description: "Browse cases and choose what you want to support directly.",
    },
    {
        icon: CreditCard,
        title: "Electronic Payment",
        description: "Secure and fast payment methods locally and internationally.",
    },
    {
        icon: Truck,
        title: "Support is Delivered",
        description: "Our team ensures that help reaches the target as quickly as possible.",
    },
    {
        icon: Camera,
        title: "Proof of Delivery",
        description: "Documentation with photos and videos for every delivery process.",
    },
    {
        icon: LayoutDashboard,
        title: "Transparency Ledger",
        description: "The transaction automatically appears in the public operations ledger.",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        How Ihsan Platform Works?
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="w-20 h-1.5 bg-primary mx-auto rounded-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-secondary/30 border border-white/5 hover:border-primary/30 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 text-left">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground text-left leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
