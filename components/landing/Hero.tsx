"use client";

import { ArrowRight, CheckCircle, Globe, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  const [dots, setDots] = useState(".");
  const [statsValues, setStatsValues] = useState<{
    totalDonations: string | null;
    verifiedCount: string | null;
    citiesCovered: string | null;
  }>({
    totalDonations: null,
    verifiedCount: null,
    citiesCovered: null,
  });

  useEffect(() => {
    const frames = [".", "..", "...", ".", "..", ".."];
    let i = 0;
    const interval = setInterval(() => {
      setDots(frames[i % frames.length]);
      i++;
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats/global");
        const data = await response.json();
        setStatsValues({
          totalDonations: `${(data.totalDonated / 1000).toFixed(1)}k+ MRU`,
          verifiedCount: `${data.verifiedCount}`,
          citiesCovered: `${data.citiesCovered}`,
        });
      } catch (error) {
        console.error("Error fetching global stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      label: t("totalDonations"),
      value: statsValues.totalDonations ?? dots,
      icon: Wallet,
    },
    {
      label: t("verifiedOperations"),
      value: statsValues.verifiedCount ?? dots,
      icon: CheckCircle,
    },
    {
      label: t("citiesCovered"),
      value: statsValues.citiesCovered ?? dots,
      icon: Globe,
    },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-secondary/50 via-background to-background -z-10" />

      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute top-1/2 -right-15 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/2 -left-15 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-start rtl:text-right flex flex-col items-center lg:items-start text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {t("title")}{" "}
              <span className="text-primary">{t("titleHighlight")}</span> <br />{" "}
              {t("titleEnd")}
            </h1>

            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-xl leading-relaxed">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/needs"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
              >
                {t("browseNeeds")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Stats Card (Desktop) */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-1 gap-6 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-6 p-4 rounded-2xl bg-transparent hover:bg-white/5 backdrop-blur-sm transition-colors group"
                >
                  <div className="p-4 rounded-xl bg-primary/20 text-primary transition-transform">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-start flex-1">
                    <div className="text-3xl font-bold text-white/80 mb-1 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-foreground/40 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}

              {/* Trust Badge */}
              <div className="absolute -bottom-6 -right-6 p-3 bg-primary rounded-2xl shadow-xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary-foreground" />
                <span className="text-primary-foreground font-bold text-sm">
                  {t("verifiedBadge")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
