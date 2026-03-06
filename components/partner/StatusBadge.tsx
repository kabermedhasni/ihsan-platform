"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type OrderStatus =
  | "Funded"
  | "Preparing"
  | "Ready"
  | "Delivered"
  | "Cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations("partner");
  const styles: Record<OrderStatus, string> = {
    Funded: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    Preparing: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    Ready: "bg-primary/20 text-primary border border-primary/20",
    Delivered:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Cancelled:
      "bg-destructive/10 text-destructive border border-destructive/20",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-bold transition-all",
        styles[status] || "bg-gray-100 text-gray-800",
        className,
      )}
    >
      {t(`statuses.${status}`)}
    </span>
  );
}
