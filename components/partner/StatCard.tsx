"use client";

import { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
}: StatCardProps) {
  const t = useTranslations("partner");
  return (
    <div className="group relative p-6 rounded-2xl bg-secondary/30 border border-white/5 hover:border-primary/50 transition-all duration-500 overflow-hidden">
      <div className="relative flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
          <Icon size={24} />
        </div>
        <div>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider text-left rtl:text-right">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-black text-white">{value}</h3>
            {unit && (
              <span className="text-xs font-bold text-primary">{unit}</span>
            )}
          </div>
          {trend && (
            <p className="text-[10px] font-black text-primary/80 mt-1">
              {t("stats.trend", { trend })}
            </p>
          )}
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
