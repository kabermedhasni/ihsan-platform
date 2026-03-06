"use client";

import { TrendingUp, CheckCircle2, Users, Building } from "lucide-react";
import { useTranslations } from "next-intl";

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

export const LedgerStats = () => {
    const t = useTranslations("transparency.stats");
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-24 relative z-10 px-6">
            <StatCard icon={TrendingUp} label={t("volume")} value="482,500" />
            <StatCard icon={CheckCircle2} label={t("records")} value="1,240" />
            <StatCard icon={Users} label={t("impact")} value="14.2k" />
            <StatCard icon={Building} label={t("regions")} value="14" />
        </section>
    );
};
