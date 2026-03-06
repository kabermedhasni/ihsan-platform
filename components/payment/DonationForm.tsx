"use client";

import React, { useState } from "react";
import { Send, Banknote, User, CreditCard, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProofUpload } from "./ProofUpload";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface DonationFormProps {
  validatorBankNumber: string;
  onSubmit: (data: {
    amount: number;
    donorBankNumber: string;
    proofFile: File | null;
  }) => void;
  isSubmitting?: boolean;
}

export const DonationForm = ({
  validatorBankNumber,
  onSubmit,
  isSubmitting = false,
}: DonationFormProps) => {
  const [amount, setAmount] = useState<string>("");
  const [donorBankNumber, setDonorBankNumber] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const t = useTranslations("needsDetail.donation");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !donorBankNumber) return;
    onSubmit({
      amount: parseFloat(amount),
      donorBankNumber,
      proofFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Bank Info Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Banknote className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
              {t("targetAccount")}
            </p>
            <p className="text-lg font-black text-foreground uppercase tracking-tight">
              {validatorBankNumber}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          {t("transferNote")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-1">
            {t("amountLabel")}
          </label>
          <div className="relative group">
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-card border border-border rounded-2xl px-6 py-5 text-2xl font-black text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="font-black text-muted-foreground group-focus-within:text-primary transition-colors">
                MRU
              </span>
            </div>
          </div>
        </div>

        {/* Donor Bank Number */}
        <div>
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-1">
            {t("bankNumberLabel")}
          </label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <CreditCard className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              required
              value={donorBankNumber}
              onChange={(e) => setDonorBankNumber(e.target.value)}
              placeholder="e.g. 41 23 45 67"
              className="w-full bg-card border border-border rounded-2xl pl-16 pr-6 py-5 text-lg font-black text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        {/* Proof Upload */}
        <ProofUpload onUpload={setProofFile} />

        <Button
          type="submit"
          disabled={isSubmitting || !amount || !donorBankNumber}
          className={`w-full py-8 rounded-4xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl transition-all h-auto active:scale-[0.98] ${
            isSubmitting
              ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
              : "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30"
          }`}
        >
          {isSubmitting ? (
            <Spinner className="size-4 text-primary-foreground" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t("submitDonation")}
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {t("secureNote")}
          </span>
        </div>
      </div>
    </form>
  );
};
