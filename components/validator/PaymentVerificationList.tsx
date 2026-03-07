"use client";

import React from "react";
import { Check, X, ExternalLink, Banknote, ShieldCheck } from "lucide-react";
import { Transaction } from "@/types/payment";
import { HashBadge } from "@/components/payment/HashBadge";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface PaymentVerificationListProps {
  transactions: Transaction[];
  onVerify: (id: string, status: "CONFIRMED" | "REJECTED") => Promise<void>;
}

export const PaymentVerificationList = ({
  transactions,
  onVerify,
}: PaymentVerificationListProps) => {
  const t = useTranslations("validator.payments");
  const tCatalog = useTranslations("catalog");
  const [loadingTxId, setLoadingTxId] = useState<string | null>(null);

  const handleVerify = async (id: string, status: "CONFIRMED" | "REJECTED") => {
    setLoadingTxId(id);
    try {
      await onVerify(id, status);
    } finally {
      setLoadingTxId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black text-foreground tracking-tighter text-left rtl:text-right">
          {t("title")}
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
            {t("pendingCount", { count: transactions.length })}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-card border border-border rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-10 hover:shadow-xl transition-all"
          >
            {/* Proof Screenshot */}
            <div className="w-full md:w-64 aspect-video bg-muted rounded-3xl overflow-hidden relative group cursor-pointer border border-border">
              {tx.proofImageUrl ? (
                <img
                  src={tx.proofImageUrl}
                  alt="Proof"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                  {t("noImage")}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight mb-2">
                      {tx.needTitle || t("title")}
                    </h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      {t("donorAccount")}
                    </p>
                    <p className="text-sm font-black text-foreground">
                      {tx.donorBankNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      {t("amount")}
                    </p>
                    <p className="text-2xl font-black text-primary tracking-tighter">
                      {tx.amount.toLocaleString()}{" "}
                      <span className="text-xs">{tCatalog("mru")}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      {t("targetAccount")}
                    </p>
                    <p className="text-xs font-bold text-foreground">
                      {tx.validatorBankNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                      {t("date")}
                    </p>
                    <p className="text-xs font-bold text-foreground">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <HashBadge hash={tx.hash} />
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {t("validHash")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => handleVerify(tx.id, "CONFIRMED")}
                  disabled={loadingTxId !== null}
                  className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingTxId === tx.id ? (
                    <Spinner className="w-4 h-4 text-white" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {t("approve")}
                </button>
                <button
                  onClick={() => handleVerify(tx.id, "REJECTED")}
                  disabled={loadingTxId !== null}
                  className="flex-1 py-4 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest border border-destructive/20 hover:bg-destructive hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingTxId === tx.id ? (
                    <Spinner className="w-4 h-4 text-current" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  {t("reject")}
                </button>
              </div>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-muted/20 border-2 border-dashed border-border rounded-[3rem]">
            <div className="w-20 h-20 bg-muted rounded-4xl flex items-center justify-center mb-6">
              <Banknote className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-black text-foreground tracking-tighter mb-2">
              {t("queueClear")}
            </h3>
            <p className="text-muted-foreground font-medium text-sm">
              {t("noPending")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
