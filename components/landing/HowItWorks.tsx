"use client";

import {
  ClipboardCheck,
  HandCoins,
  CreditCard,
  Truck,
  Camera,
  LayoutDashboard,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      icon: ClipboardCheck,
      title: t("steps.investigator.title"),
      description: t("steps.investigator.description"),
    },
    {
      icon: HandCoins,
      title: t("steps.donor.title"),
      description: t("steps.donor.description"),
    },
    {
      icon: CreditCard,
      title: t("steps.payment.title"),
      description: t("steps.payment.description"),
    },
    {
      icon: Truck,
      title: t("steps.delivery.title"),
      description: t("steps.delivery.description"),
    },
    {
      icon: Camera,
      title: t("steps.proof.title"),
      description: t("steps.proof.description"),
    },
    {
      icon: LayoutDashboard,
      title: t("steps.ledger.title"),
      description: t("steps.ledger.description"),
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-secondary/30 backdrop-blur-xl border border-white/5 hover:border-primary/50 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-start rtl:text-right">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-start rtl:text-right leading-relaxed">
                {step.description}
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
