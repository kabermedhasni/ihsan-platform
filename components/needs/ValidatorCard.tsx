"use client";

import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface ValidatorCardProps {
    name: string;
}

export const ValidatorCard = ({ name }: ValidatorCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
    >
        <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
            </span>
            Verification
        </h2>
        <div className="bg-card rounded-3xl p-8 border border-border group shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-3 transition-transform">
                    <span className="text-primary font-black text-xl">{name ? name[0] : 'V'}</span>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-xl text-foreground">{name || 'Validator'}</p>
                        <ShieldCheck className="w-5 h-5 text-primary fill-primary/10" />
                    </div>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Field Validator</p>
                </div>
            </div>
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <p className="text-muted-foreground italic font-medium leading-relaxed">
                    "This need was verified by a trusted local volunteer in person to ensure accuracy and legitimacy. Every detail has been cross-referenced with local records."
                </p>
            </div>
        </div>
    </motion.div>
);
