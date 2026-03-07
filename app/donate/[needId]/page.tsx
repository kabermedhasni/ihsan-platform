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
import { toast } from "sonner";

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
    // Check if amount exceeds remaining
    const remaining =
      Number(need?.targetAmount || 0) - Number(need?.fundedAmount || 0);
    if (formData.amount > remaining) {
      toast.error(
        `The maximum amount you can donate is ${remaining.toLocaleString()} MRU`,
      );
      return;
    }

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

      // 1. Fetch last confirmed hash for chaining
      const lastHashRes = await fetch("/api/transparency/last-hash");
      const lastHashData = await lastHashRes
        .json()
        .catch(() => ({ lastHash: "0".repeat(64) }));
      const lastHash = lastHashData.lastHash || "0".repeat(64);

      const txId = crypto.randomUUID();
      const timestamp = new Date().toISOString();

      // 2. Upload Proof Image if exists
      let proofImageUrl = null;
      if (formData.proofFile) {
        const fileExt = formData.proofFile.name.split(".").pop();
        const fileName = `${txId}.${fileExt}`;
        const filePath = `donations/${fileName}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from("proof_images")
            .upload(filePath, formData.proofFile);

          if (uploadError) {
            console.warn(
              "Supabase Storage error, trying local fallback:",
              uploadError.message,
            );
            // Fallback to local upload
            const localFormData = new FormData();
            localFormData.append("file", formData.proofFile);
            localFormData.append("fileName", fileName);

            const localRes = await fetch("/api/upload/local", {
              method: "POST",
              body: localFormData,
            });

            if (localRes.ok) {
              const { publicUrl } = await localRes.json();
              proofImageUrl = publicUrl;
              console.log("Local upload successful:", proofImageUrl);
            } else {
              throw new Error("Local fallback also failed");
            }
          } else {
            const { data: urlData } = supabase.storage
              .from("proof_images")
              .getPublicUrl(filePath);
            proofImageUrl = urlData.publicUrl;
          }
        } catch (err: any) {
          console.error("All upload methods failed:", err.message);
        }
      }

      // 3. Generate Transaction Hash
      const hash = generateTransactionHash(
        {
          transaction_id: txId,
          need_id: resolvedParams.needId,
          donor_bank_number: formData.donorBankNumber,
          validator_bank_number: "BANK-IHSAN-2026",
          amount: formData.amount,
          timestamp: timestamp,
          proof_image_url: proofImageUrl,
        } as any,
        lastHash,
      );

      // 4. Create Records for both Donations (for donor history) and Transactions (for ledger)
      const donationEntry = {
        id: txId,
        need_id: resolvedParams.needId,
        donor_id: user.id,
        amount: formData.amount,
        status: "pending",
        donor_bank_number: formData.donorBankNumber,
        validator_bank_number: "BANK-IHSAN-2026",
        hash: hash,
        proof_image_url: proofImageUrl,
      };

      const transactionEntry = {
        id: txId,
        need_id: resolvedParams.needId,
        donor_id: user.id,
        amount: formData.amount,
        status: "PENDING_VALIDATION",
        hash: hash,
        proof_image_url: proofImageUrl,
        donor_bank_number: formData.donorBankNumber,
        validator_bank_number: "BANK-IHSAN-2026",
      };

      const [donRes, txRes] = await Promise.all([
        supabase.from("donations").insert(donationEntry),
        supabase.from("transactions").insert(transactionEntry),
      ]);

      if (donRes.error) throw new Error(donRes.error.message);
      if (txRes.error) throw new Error(txRes.error.message);

      toast.success("Donation submitted for verification!");
      router.push(
        `/donation-confirmation/${txId}?amount=${formData.amount}&hash=${hash}&ts=${timestamp}`,
      );
    } catch (err: any) {
      console.error("Donation failed:", err);
      toast.error(err.message || "Failed to process donation.");
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
