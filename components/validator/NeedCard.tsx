"use client";

import { MapPin, Users, CheckCircle, Eye } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { StatusBadge, NeedStatus } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";

export interface ValidatorNeed {
  id: string;
  title: string;
  city: string;
  district: string;
  category: "food" | "medical" | "housing" | "other";
  targetAmount: number;
  fundedAmount: number;
  beneficiaries: number;
  status: NeedStatus;
  partnerStatus?: string;
  createdAt: string;
  partner?: string;
  description: string;
}

interface NeedCardProps {
  n: ValidatorNeed;
  onConfirm: (n: ValidatorNeed) => void;
}

export const NeedCard = ({ n, onConfirm }: NeedCardProps) => {
  const t = useTranslations("validator");
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 bg-secondary rounded text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">
              {n.category}
            </span>
            <StatusBadge status={n.status} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            {(n.status === "fullyFunded" || n.status === "completed") &&
              n.partnerStatus &&
              n.partnerStatus.toLowerCase() !== "funded" && (
                <span className="px-2 py-0.5 bg-accent/20 text-accent font-bold text-[10px] uppercase tracking-widest rounded-md border border-accent/20">
                  Partner: {n.partnerStatus}
                </span>
              )}
          </div>
          <h3 className="font-black text-foreground text-lg leading-tight mb-1 truncate group-hover:text-primary transition-colors text-left rtl:text-right">
            {n.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <MapPin className="w-3 h-3 text-primary" />
            <span>
              {n.city}, {n.district}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ProgressBar current={n.fundedAmount} max={n.targetAmount} />

        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter mb-0.5">
              {t("needs.beneficiaries")}
            </p>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-black text-foreground">
                {n.beneficiaries}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {(n.status === "fullyFunded" || n.status === "completed") && (
              <Button
                onClick={() => onConfirm(n)}
                size="sm"
                disabled={n.partnerStatus?.toLowerCase() !== "delivered"}
                className="rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 h-auto py-2.5 px-4"
                title={
                  n.partnerStatus?.toLowerCase() !== "delivered"
                    ? "Partner must set status to Delivered first"
                    : ""
                }
              >
                <CheckCircle className="w-3.5 h-3.5 mr-2" />
                {t("needs.confirmDelivery")}
              </Button>
            )}
            {n.status === "delivered" && (
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {t("deliveredSuccessNote")}
                </span>
              </div>
            )}
            <Button
              asChild
              variant="secondary"
              size="icon"
              className="rounded-xl hover:text-primary transition-colors border border-transparent hover:border-primary/20"
            >
              <Link href={`/needs/${n.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
