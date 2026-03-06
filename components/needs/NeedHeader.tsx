"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { StatusBadge, NeedStatus } from './StatusBadge';

interface NeedHeaderProps {
    need: {
        title: string;
        category: string;
        status: NeedStatus;
        city: string;
        district: string;
    };
}

export const NeedHeader = ({ need }: NeedHeaderProps) => {
    const t = useTranslations("catalog.categories");

    // Map database categories to translation keys
    const categoryKey = need.category.toLowerCase().replace(/\s+/g, '');
    const displayCategory = t(categoryKey as any) || need.category;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-secondary/30 text-foreground text-[10px] font-black uppercase tracking-widest rounded-full border border-border">
                    {displayCategory}
                </span>
                <StatusBadge status={need.status} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
                {need.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground font-semibold bg-card w-fit px-4 py-2 rounded-xl border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">{need.city}, {need.district}</span>
            </div>
        </motion.div>
    );
};
