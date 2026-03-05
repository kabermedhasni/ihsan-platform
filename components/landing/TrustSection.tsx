"use client";

import { ShieldCheck, EyeOff, FileCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TrustSection() {
  const t = useTranslations("trust");

  const trustCards = [
    {
      icon: ShieldCheck,
      title: t("targeted.title"),
      description: t("targeted.description"),
    },
    {
      icon: EyeOff,
      title: t("anonymity.title"),
      description: t("anonymity.description"),
    },
    {
      icon: FileCheck,
      title: t("impact.title"),
      description: t("impact.description"),
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustCards.map((card, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-secondary/30 backdrop-blur-xl border border-white/5 hover:border-primary/50 transition-all duration-500"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-start rtl:text-right">
                {card.title}
              </h3>
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <card.icon className="w-8 h-8" />
              </div>
              <p className="text-foreground/70 text-start rtl:text-right leading-relaxed">
                {card.description}
              </p>

              {/* Subtle accent light */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
