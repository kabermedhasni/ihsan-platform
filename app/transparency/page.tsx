"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// Components
import { LedgerHeader } from "@/components/transparency/LedgerHeader";
import { LedgerStats } from "@/components/transparency/LedgerStats";
import { LedgerTable } from "@/components/transparency/LedgerTable";
import { VerificationPanel } from "@/components/transparency/VerificationPanel";
import { LedgerMap } from "@/components/transparency/LedgerMap";
import { TransactionDetailsModal } from "@/components/transparency/TransactionDetailsModal";
import { Transaction } from "@/components/transparency/types";

export default function TransparencyPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await fetch("/api/transparency/ledger");
        if (!res.ok) throw new Error("Failed to fetch ledger");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Ledger fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, []);

  const handleVerify = async (query: string): Promise<Transaction | null> => {
    // Search in local list first for speed
    const found = transactions.find(t =>
      t.id.toLowerCase().includes(query.toLowerCase()) ||
      t.hash.toLowerCase().includes(query.toLowerCase())
    );
    return found || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary pb-20">
      <LedgerHeader />

      <main className="container mx-auto max-w-7xl px-6">

        <LedgerStats />

        <LedgerTable
          transactions={transactions}
          onSelectRow={setSelectedTx}
        />

        <VerificationPanel onVerify={handleVerify} />

        <LedgerMap />

        {/* CALL TO ACTION */}
        <section className="mb-20">
          <div className="bg-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group border border-border">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] rounded-full -mt-40 pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight mb-8">
                Building blocks for <br /> radical trust.
              </h2>
              <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto mb-12">
                Our transparency ledger is open for public audit. We believe that clarity is the foundation of effective charity.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all w-full sm:w-auto">
                  Become a Validator
                </button>
                <button className="px-10 py-5 bg-muted text-foreground rounded-2xl font-black text-sm uppercase tracking-widest border border-border hover:bg-muted/80 transition-all w-full sm:w-auto flex items-center justify-center gap-3">
                  Developer API <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <AnimatePresence>
        {selectedTx && (
          <TransactionDetailsModal
            tx={selectedTx}
            onClose={() => setSelectedTx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
