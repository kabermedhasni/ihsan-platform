"use client";

import { useTranslations } from "next-intl";

interface MapLegendProps {
  className?: string;
}

export default function MapLegend({ className = "" }: MapLegendProps) {
  const t = useTranslations("transparency.map");

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Confirmed - yellow */}
      <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-3 py-1.5 rounded-xl border border-yellow-500/20 text-[10px] font-black uppercase tracking-widest">
        <div className="w-2.5 h-2.5 rounded-full bg-[#d1a000] border border-white/20" />
        {t("confirmed")}
      </div>
      {/* In Progress - blue */}
      <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white/20" />
        {t("inProgress")}
      </div>
      {/* Pending - slate */}
      <div className="flex items-center gap-2 bg-slate-500/10 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl border border-slate-500/20 text-[10px] font-black uppercase tracking-widest">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-white/20" />
        {t("pending")}
      </div>
    </div>
  );
}
