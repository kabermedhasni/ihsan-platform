"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Hash } from 'lucide-react';
import { Transaction } from '@/types/payment';
import { StatusBadge } from '@/components/needs/StatusBadge';
import { HashBadge } from './HashBadge';

interface LedgerTableProps {
    transactions: Transaction[];
    onSelectRow: (tx: Transaction) => void;
}

export const LedgerTable = ({ transactions, onSelectRow }: LedgerTableProps) => {
    return (
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction ID</th>
                            <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">City</th>
                            <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Amount</th>
                            <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Ledger Hash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {transactions.map((tx) => (
                            <motion.tr
                                key={tx.id}
                                onClick={() => onSelectRow(tx)}
                                whileHover={{ backgroundColor: 'rgba(var(--primary-rgb), 0.02)' }}
                                className="cursor-pointer transition-colors group"
                            >
                                <td className="px-8 py-6">
                                    <span className="text-xs font-black text-foreground uppercase tracking-tight">
                                        {tx.id.substring(0, 8)}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-primary" />
                                        <span className="text-xs font-bold text-muted-foreground">{tx.location?.city || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm font-black text-foreground">
                                        {tx.amount.toLocaleString()} <span className="text-[10px] text-muted-foreground">MRU</span>
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <StatusBadge status={tx.status as any} />
                                </td>
                                <td className="px-8 py-6">
                                    <HashBadge hash={tx.hash} />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {transactions.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No verified records found</p>
                </div>
            )}
        </div>
    );
};
