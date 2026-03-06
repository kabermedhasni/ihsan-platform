"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";

// Components
import { LedgerHeader } from "@/components/transparency/LedgerHeader";
import LedgerStats from "@/components/transparency/LedgerStats";
import { LedgerTable } from "@/components/transparency/LedgerTable";
import { VerificationPanel } from "@/components/transparency/VerificationPanel";
import { LedgerMap } from "@/components/transparency/LedgerMap";
import { TransactionDetailsModal } from "@/components/transparency/TransactionDetailsModal";
import { Transaction } from "@/components/transparency/types";

export default function TransparencyPage() {
  const t = useTranslations("transparency.cta");
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
    const found = transactions.find(
      (t) =>
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.hash.toLowerCase().includes(query.toLowerCase()),
    );
    return found || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary pb-20">
      <LedgerHeader />

      <main className="container mx-auto max-w-7xl px-6">
        <LedgerStats />

        <LedgerTable transactions={transactions} onSelectRow={setSelectedTx} />

        <VerificationPanel onVerify={handleVerify} />

        <LedgerMap />
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
