"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string;
}

export const StatCard = ({ icon, label, value }: StatCardProps) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all"
    >
        <div className={`p-3 bg-primary/10 text-primary rounded-xl w-fit`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-black text-foreground tracking-tighter">{value}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{label}</p>
        </div>
    </motion.div>
);
