"use client";

import { useTranslations } from "next-intl";

export type NeedStatus =
  | "open"
  | "partiallyFunded"
  | "fullyFunded"
  | "completed"
  | "inDelivery"
  | "confirmed";

export const STATUS_CONFIG: Record<
  NeedStatus,
  { labelKey: string; cls: string }
> = {
  open: {
    labelKey: "open",
    cls: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  partiallyFunded: {
    labelKey: "partiallyFunded",
    cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  fullyFunded: {
    labelKey: "fullyFunded",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  completed: {
    labelKey: "fullyFunded",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  inDelivery: {
    labelKey: "inDelivery",
    cls: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  },
  confirmed: {
    labelKey: "confirmed",
    cls: "bg-primary/20 text-primary border-primary/30",
  },
};

interface StatusBadgeProps {
  status: NeedStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const t = useTranslations("validator");
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${config.cls}`}
    >
      {t(`statuses.${config.labelKey}`)}
    </span>
  );
};
