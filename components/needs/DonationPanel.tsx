"use client";

import React, { useState } from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const DonationPanel = () => {
    const [amount, setAmount] = useState<string>('');
    const [isDonating, setIsDonating] = useState(false);
    const quickAmounts = [250, 500, 1000];

    const handleDonate = () => {
        setIsDonating(true);
        setTimeout(() => setIsDonating(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-[2rem] p-8 md:p-10 shadow-2xl border border-border sticky top-28"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
                </div>
                <h3 className="text-2xl font-black text-foreground">Make an Impact</h3>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-1">
                        Donation Amount (MRU)
                    </label>
                    <div className="relative group">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-2xl font-black text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/30"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-muted-foreground group-focus-within:text-primary transition-colors">MRU</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((amt) => (
                        <motion.button
                            key={amt}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAmount(amt.toString())}
                            className={`py-4 rounded-2xl text-xs font-black transition-all border-2 ${amount === amt.toString()
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                                }`}
                        >
                            +{amt}
                        </motion.button>
                    ))}
                </div>

                <motion.button
                    disabled={isDonating || !amount}
                    onClick={handleDonate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg ${isDonating
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
                        }`}
                >
                    {isDonating ? (
                        <div className="w-6 h-6 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                        <>
                            <Heart className="w-6 h-6 fill-primary-foreground" />
                            Donate Now
                        </>
                    )}
                </motion.button>

                <div className="flex flex-col items-center gap-4 pt-4">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Verified & Encrypted Transaction
                    </div>
                    <div className="w-full h-px bg-border" />
                    <p className="text-[10px] text-muted-foreground text-center leading-relaxed font-bold">
                        100% of your donation goes directly to the beneficiary.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
