"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Share2, Info, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

// Import refactored components
import { NeedHeader } from "@/components/needs/NeedHeader";
import { FundingProgress } from "@/components/needs/FundingProgress";
import { BeneficiariesCard } from "@/components/needs/BeneficiariesCard";
import { NeedDescription } from "@/components/needs/NeedDescription";
import { ValidatorCard } from "@/components/needs/ValidatorCard";
import { LocationCard } from "@/components/needs/LocationCard";
import { DonationPanel } from "@/components/needs/DonationPanel";
import { Spinner } from "@/components/ui/spinner";

// --- TYPES ---
import { Need } from "@/types/need";

// --- PAGE ---

export default function NeedDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params for Next.js 15
  const resolvedParams = use(params);
  const [need, setNeed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("needsDetail");

  useEffect(() => {
    const fetchNeedData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/needs/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error(t("error") || "Failed to fetch need details");
        }
        const data = await response.json();
        setNeed(data);
      } catch (err: any) {
        console.error("Error fetching need:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchNeedData();
    }
  }, [resolvedParams.id, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (error || !need) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
            {t("error")}
          </h2>
          <p className="text-muted-foreground font-medium">
            {error || t("notFound")}
          </p>
          <Link
            href="/catalog"
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            {t("backToCatalog")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden pt-20">
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Details */}
          <div className="flex-1 min-w-0">
            <NeedHeader need={need} />

            <FundingProgress
              current={need.fundedAmount}
              target={need.targetAmount}
              donors={need.donorsCount}
            />

            <BeneficiariesCard count={need.beneficiaries} />

            <NeedDescription description={need.description} />

            <div className="grid md:grid-cols-2 gap-10">
              <ValidatorCard name={need.validatorName} />
              <LocationCard
                city={need.city}
                district={need.district}
                lat={need.latitude || need.lat}
                lng={need.longitude || need.lng}
              />
            </div>
          </div>

          {/* Right Column: Donation Panel */}
          <div className="w-full lg:w-[460px] shrink-0">
            <DonationPanel needId={need.id} />

            <div className="mt-12 bg-card rounded-3xl p-8 border border-border shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 bg-primary rounded-bl-3xl">
                <Info className="w-12 h-12 text-primary-foreground" />
              </div>
              <h4 className="font-black text-foreground mb-2 uppercase tracking-widest text-[10px]">
                {t("taxInfo.title")}
              </h4>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                {t("taxInfo.description")}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
