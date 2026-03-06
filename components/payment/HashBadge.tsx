"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HashBadgeProps {
    hash: string;
    className?: string;
}

export const HashBadge = ({ hash, className = "" }: HashBadgeProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const displayHash = `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`;

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-lg hover:border-primary/50 transition-all font-mono text-[10px] group ${className}`}
        >
            <span className="text-muted-foreground group-hover:text-primary transition-colors uppercase">
                {displayHash}
            </span>
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <Check className="w-3 h-3 text-emerald-500" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <Copy className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};
