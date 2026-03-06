"use client";

import { TrendingUp, CheckCircle2, Users, Building } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="group relative p-4 sm:p-6 rounded-2xl bg-secondary/30 border border-white/5 hover:border-primary/50 transition-all duration-500 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left rtl:sm:text-right gap-3 sm:gap-4 overflow-hidden">
    <div className="p-2 sm:p-3 bg-primary/10 text-primary rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <div className="min-w-0 w-full">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 truncate">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-black text-foreground tracking-tighter overflow-hidden">
        {value}
      </p>
    </div>
    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

export default function LedgerStats() {
  const t = useTranslations("transparency.stats");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats/global");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Global stats fetch error:", err);
      }
    };
    fetchStats();
  }, []);

  const volume =
    stats?.totalDonated !== undefined
      ? Number(stats.totalDonated).toLocaleString()
      : "...";
  const records =
    stats?.verifiedCount !== undefined
      ? Number(stats.verifiedCount).toLocaleString()
      : "...";
  const impact =
    stats?.totalDonated !== undefined
      ? stats.totalDonated >= 1000
        ? (stats.totalDonated / 1000).toFixed(1) + "k"
        : stats.totalDonated.toString()
      : "...";
  const regions =
    stats?.citiesCovered !== undefined ? stats.citiesCovered.toString() : "...";

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-24 relative z-10 px-6">
      <StatCard icon={TrendingUp} label={t("volume")} value={volume} />
      <StatCard icon={CheckCircle2} label={t("records")} value={records} />
      <StatCard icon={Users} label={t("impact")} value={impact} />
      <StatCard icon={Building} label={t("regions")} value={regions} />
    </section>
  );
}
