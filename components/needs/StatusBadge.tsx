"use client";

import React from 'react';
import { motion } from 'framer-motion';

export type NeedStatus = 'Open' | 'Fully Funded' | 'In Delivery' | 'Confirmed' | 'active' | 'completed' | 'urgent';

interface StatusBadgeProps {
    status: NeedStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const configs: Record<string, string> = {
        'Open': 'bg-primary/15 text-primary border-primary/30',
        'active': 'bg-primary/15 text-primary border-primary/30',
        'Fully Funded': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        'In Delivery': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        'urgent': 'bg-destructive/15 text-destructive border-destructive/30',
        'Confirmed': 'bg-green-500/15 text-green-400 border-green-500/30',
        'completed': 'bg-green-500/15 text-green-400 border-green-500/30',
    };

    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    const displayLabel = status === 'active' ? 'Open' : status === 'urgent' ? 'Urgent' : normalizedStatus;

    return (
        <motion.span
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-1 text-xs font-bold rounded-full border ${configs[status] || configs['Open']}`}
        >
            {displayLabel}
        </motion.span>
    );
};
