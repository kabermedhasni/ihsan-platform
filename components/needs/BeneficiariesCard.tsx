"use client";

import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface BeneficiariesCardProps {
    count: number;
}

export const BeneficiariesCard = ({ count }: BeneficiariesCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground shadow-xl shadow-primary/10 mb-10 flex items-center justify-between group overflow-hidden relative"
    >
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users className="w-32 h-32" />
        </div>

        <div className="relative z-10">
            <p className="text-primary-foreground/70 text-[10px] font-black uppercase tracking-widest mb-2">Impact</p>
            <p className="font-black text-4xl mb-1">{count} Families</p>
            <p className="text-primary-foreground/80 font-medium text-sm">Directly benefiting from your support</p>
        </div>

        <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Users className="w-8 h-8 text-primary-foreground" />
        </div>
    </motion.div>
);
