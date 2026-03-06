"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Banknote, Shield, ArrowRight } from 'lucide-react';
import { Transaction } from '@/types/payment';
import { HashBadge } from './HashBadge';
import { StatusBadge } from '@/components/needs/StatusBadge';

interface TransactionCardProps {
    tx: Transaction;
    onClick?: () => void;
}

export const TransactionCard = ({ tx, onClick }: TransactionCardProps) => {
    return (
        <motion.div
            whileHover={onClick ? { y: -5 } : {}}
            onClick={onClick}
            className={`bg-card rounded-[2rem] p-6 border border-border shadow-sm hover:shadow-xl transition-all ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Banknote className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Donation Transaction</h4>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{tx.id.substring(0, 8)}</p>
                    </div>
                </div>
                <StatusBadge status={tx.status as any} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-2xl">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Amount</p>
                    <p className="text-lg font-black text-foreground">{tx.amount.toLocaleString()} <span className="text-xs">MRU</span></p>
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Date</p>
                    <p className="text-xs font-black text-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Public Hash</span>
                    </div>
                    <HashBadge hash={tx.hash} />
                </div>

                {tx.previousHash && (
                    <div className="flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Prev Hash</span>
                        </div>
                        <HashBadge hash={tx.previousHash} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};
