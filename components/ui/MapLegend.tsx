"use client";

import { useTranslations } from "next-intl";

interface MapLegendProps {
  className?: string;
}

export default function MapLegend({ className = "" }: MapLegendProps) {
  const t = useTranslations("transparency.map");

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Completed - amber/orange-yellow */}
      <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">
        <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] border border-white/20 shadow-sm" />
        Completed
      </div>
      {/* Funding - bright blue */}
      <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
        <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] border border-white/20 shadow-sm" />
        Funding
      </div>
    </div>
  );
}
