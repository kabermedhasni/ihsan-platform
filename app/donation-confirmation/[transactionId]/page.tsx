"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Share2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeCard } from '@/components/payment/QRCodeCard';
import { HashBadge } from '@/components/payment/HashBadge';

export default function ConfirmationPage({ params }: { params: Promise<{ transactionId: string }> }) {
    const resolvedParams = use(params);
    const searchParams = useSearchParams();

    const amount = parseFloat(searchParams.get('amount') || '0');
    const hash = searchParams.get('hash') || '0'.repeat(64);
    const timestamp = searchParams.get('ts') || new Date().toISOString();

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <main className="max-w-xl mx-auto px-6 pt-20 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8"
                >
                    <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black tracking-tighter mb-4">Donation Received!</h1>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                        Your contribution has been submitted for validation.
                        A cryptographic proof has been generated for this transaction.
                    </p>
                </div>

                <div className="w-full space-y-8">
                    {/* Summary Card */}
                    <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transaction Verified</span>
                            </div>
                            <HashBadge hash={hash} />
                        </div>

                        <div className="text-center py-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Amount Funded</p>
                            <h2 className="text-5xl font-black text-foreground">{amount.toLocaleString()} <span className="text-sm">MRU</span></h2>
                        </div>

                        <div className="h-px bg-border my-6" />

                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Status</p>
                                <p className="text-xs font-black text-amber-500 uppercase">Pending</p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Ledger ID</p>
                                <p className="text-xs font-black text-foreground uppercase">#{resolvedParams.transactionId.substring(0, 8)}</p>
                            </div>
                        </div>
                    </div>

                    <QRCodeCard
                        transactionId={resolvedParams.transactionId}
                        hash={hash}
                        amount={amount}
                        timestamp={timestamp}
                    />

                    <div className="flex flex-col gap-4">
                        <Link
                            href="/catalog"
                            className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                        >
                            Return to Catalog
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/transparency"
                            className="w-full py-6 bg-muted text-foreground rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 border border-border"
                        >
                            View Transparency Ledger
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
