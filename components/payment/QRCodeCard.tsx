"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Share2 } from 'lucide-react';

interface QRCodeCardProps {
    transactionId: string;
    hash: string;
    amount: number;
    timestamp: string;
}

export const QRCodeCard = ({ transactionId, hash, amount, timestamp }: QRCodeCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-[2.5rem] p-8 border border-border flex flex-col items-center gap-8 relative overflow-hidden group"
        >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-xl font-black text-foreground tracking-tighter">Donation Receipt</h3>
                <p className="text-xs text-muted-foreground font-medium">Digital Cryptographic Proof</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-xl relative group/qr">
                <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
                    <QrCode className="w-32 h-32 text-slate-800" />
                    {/* Mock QR details for visual effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="grid grid-cols-8 grid-rows-8 gap-0.5 h-full w-full">
                            {Array.from({ length: 64 }).map((_, i) => (
                                <div key={i} className={`bg-slate-900 ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-4 relative z-10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Transaction ID</span>
                    <span className="text-foreground">{transactionId.substring(0, 12)}...</span>
                </div>
                <div className="h-px bg-border w-full" />
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Amount</span>
                    <span className="text-primary">{amount.toLocaleString()} MRU</span>
                </div>
                <div className="h-px bg-border w-full" />
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Timestamp</span>
                    <span className="text-foreground">{new Date(timestamp).toLocaleString()}</span>
                </div>
            </div>

            <div className="flex gap-4 w-full relative z-10">
                <button className="flex-1 py-4 bg-muted hover:bg-muted/80 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
                    <Download className="w-4 h-4" />
                    Download
                </button>
                <button className="flex-1 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>
        </motion.div>
    );
};
