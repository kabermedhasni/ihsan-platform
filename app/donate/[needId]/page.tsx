"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShieldCheck, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";
import { DonationForm } from "@/components/payment/DonationForm";
import { generateTransactionHash } from "@/lib/crypto";
import { createClient } from "@/utils/supabase/client";

export default function DonatePage({
  params,
}: {
  params: Promise<{ needId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const t = useTranslations("needsDetail");
  const [need, setNeed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNeedData = async () => {
      try {
        const response = await fetch(`/api/needs/${resolvedParams.needId}`);
        if (!response.ok) throw new Error("Need not found");
        const data = await response.json();
        setNeed(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNeedData();
  }, [resolvedParams.needId]);

  const handleSubmit = async (formData: {
    amount: number;
    donorBankNumber: string;
    proofFile: File | null;
  }) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      // 1. In a real app, upload proof file to storage
      // 2. Fetch last confirmed hash for chaining
      const lastHashRes = await fetch("/api/transparency/last-hash");
      const { lastHash } = await lastHashRes
        .json()
        .catch(() => ({ lastHash: "0".repeat(64) }));

      const txId = crypto.randomUUID();
      const timestamp = new Date().toISOString();

      // 3. Generate SHA-256 Hash
      const hash = generateTransactionHash(
        {
          transaction_id: txId,
          need_id: resolvedParams.needId,
          donor_bank_number: formData.donorBankNumber,
          validator_bank_number: "BANK-IHSAN-2026", // Global platform account
          amount: formData.amount,
          timestamp: timestamp,
        },
        lastHash,
      );

      // 4. Create Transaction Record in Database
      const { error: insertError } = await supabase.from("donations").insert({
        id: txId,
        need_id: resolvedParams.needId,
        donor_id: user.id,
        amount: formData.amount,
        status: "pending",
        hash: hash,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Redirect to confirmation
      router.push(
        `/donation-confirmation/${txId}?amount=${formData.amount}&hash=${hash}&ts=${timestamp}`,
      );
    } catch (err) {
      console.error("Donation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground mt-15 pb-20">
      <main className="max-w-xl mx-auto px-6 pt-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">
              {t("donation.verifiedNote")}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-4">
            {t("donation.title")}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            {t("supporting")}{" "}
            <span className="text-foreground font-bold">
              {need?.title || t("loadingPlaceholder")}
            </span>
          </p>
        </div>

        <DonationForm
          validatorBankNumber="BANK-IHSAN-2026-XQ"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <div className="mt-12 bg-card rounded-3xl p-8 border border-border flex gap-4 items-start">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-1">
              {t("transparency.title")}
            </h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              {t("transparency.description")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
