"use client";

import { TrendingUp, CheckCircle2, Users, Building } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="bg-card p-6 rounded-2xl shadow-xl shadow-black/20 border border-border flex items-start gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-black text-card-foreground tracking-tighter">{value}</p>
        </div>
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

    const volume = stats?.totalDonated !== undefined ? Number(stats.totalDonated).toLocaleString() : "...";
    const records = stats?.verifiedCount !== undefined ? Number(stats.verifiedCount).toLocaleString() : "...";
    const impact = stats?.totalDonated !== undefined ? (stats.totalDonated >= 1000 ? (stats.totalDonated / 1000).toFixed(1) + "k" : stats.totalDonated.toString()) : "...";
    const regions = stats?.citiesCovered !== undefined ? stats.citiesCovered.toString() : "...";

    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-24 relative z-10 px-6">
            <StatCard icon={TrendingUp} label={t("volume")} value={volume} />
            <StatCard icon={CheckCircle2} label={t("records")} value={records} />
            <StatCard icon={Users} label={t("impact")} value={impact} />
            <StatCard icon={Building} label={t("regions")} value={regions} />
        </section>
    );
}
