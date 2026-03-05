"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="py-24 bg-emerald-950 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 border-4 border-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-emerald-500 rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-8 inline-flex p-4 rounded-3xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/50"
                    >
                        <Heart className="w-12 h-12 fill-current" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-white mb-8"
                    >
                        Do Good with Excellence
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-xl text-emerald-100/70 mb-12"
                    >
                        Join thousands of donors who place their trust in Ihsan to ensure their giving reaches those in need.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/auth"
                            className="px-12 py-5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 w-full sm:w-auto mx-auto"
                        >
                            Get Started
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
