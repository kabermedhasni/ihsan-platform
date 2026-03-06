"use client";

import React, { useState } from "react";
import {
  Search,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { TransactionCard } from "@/components/payment/TransactionCard";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";
import { Transaction } from "@/types/payment";
import Link from "next/link";

export default function VerifyPaymentPage() {
  const t = useTranslations("transparency");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Transaction | null>(null);
  const [error, setError] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError(false);
    setResult(null);

    try {
      // Simulate API call to fetch transaction by hash or ID
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response
      if (query.length > 20) {
        // Assume it's a hash
        setResult({
          id: crypto.randomUUID(),
          needId: "need-abc",
          donorId: "user-123",
          donorBankNumber: "41 23 XX XX",
          validatorBankNumber: "BANK-IHSAN-2026",
          amount: 500,
          timestamp: new Date().toISOString(),
          status: "CONFIRMED",
          hash: query,
          previousHash: "0".repeat(64),
          location: { city: "Nouakchott" },
        });
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="max-w-2xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">
              {t("publicAuditSystem")}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-4">
            {t("verify.title")}
          </h1>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">
            {t("verify.subtitle")}
          </p>
        </div>

        <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("verify.placeholder")}
              className="w-full bg-background border-2 border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/30"
            />
            <button
              type="submit"
              disabled={loading || !query}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" /> : t("verify.button")}
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" className="text-primary" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
              {t("verify.verifying")}
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-tight">
                {t("verify.recordFound")}
              </span>
            </div>
            <TransactionCard tx={result} />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 bg-destructive/5 border border-destructive/20 rounded-[2.5rem]">
            <AlertCircle className="w-10 h-10 text-destructive mb-4" />
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
              {t("ledger.id")} {t("verify.notFound")}
            </h3>
            <p className="text-sm text-muted-foreground font-medium text-center px-8">
              {t("verify.notFound")}
            </p>
          </div>
        )}

        <div className="mt-20 p-8 rounded-[2.5rem] bg-card border border-border flex flex-col items-center text-center">
          <h3 className="text-xl font-black text-foreground mb-4">
            {t("radicalTransparency")}
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8">
            {t("traceabilityNote")}
          </p>
          <Link
            href="/transparency"
            className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] group"
          >
            {t("exploreFullLedger")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}
