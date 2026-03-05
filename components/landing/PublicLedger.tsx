"use client";

import { motion } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export default function PublicLedger() {
    const [ledgerData, setLedgerData] = useState<any[]>([]);

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const response = await fetch('/api/donations/recent');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setLedgerData(data);
                }
            } catch (error) {
                console.error('Error fetching ledger:', error);
            }
        };
        fetchLedger();
    }, []);

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Public Transparency Ledger
                    </motion.h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        All transactions are recorded in a public, tamper-proof ledger to ensure maximum integrity.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-secondary/20 rounded-3xl border border-white/5 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-emerald-400 font-bold text-sm">ID</th>
                                    <th className="px-6 py-4 text-emerald-400 font-bold text-sm">Need</th>
                                    <th className="px-6 py-4 text-emerald-400 font-bold text-sm">City/District</th>
                                    <th className="px-6 py-4 text-emerald-400 font-bold text-sm">Amount</th>
                                    <th className="px-6 py-4 text-emerald-400 font-bold text-sm">Status</th>
                                    <th className="px-6 py-4 text-emerald-400 font-bold text-sm font-mono text-right">Hash</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {ledgerData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-white font-mono text-sm">{item.id.slice(0, 8)}...</td>
                                        <td className="px-6 py-4 text-white font-medium">{item.needs?.title}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{item.needs?.district}</td>
                                        <td className="px-6 py-4 text-emerald-400 font-bold">{item.amount} MRU</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-mono text-sm text-right">{item.hash ? `${item.hash.slice(0, 6)}...${item.hash.slice(-4)}` : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            You can search using transaction number or electronic fingerprint
                        </p>
                        <button className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all group">
                            View Full Transparency Ledger
                            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
