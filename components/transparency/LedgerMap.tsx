"use client";

import { useTranslations } from "next-intl";
import InteractiveMap from "../landing/InteractiveMap";

export const LedgerMap = () => {
  const t = useTranslations("transparency.map");

  return (
    <section className="container mx-auto max-w-7xl px-6 mb-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div className="text-left rtl:text-right">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">
            {t("title")}
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <InteractiveMap
        showTitle={false}
        zoom={13}
        center={[18.0858, -15.9485]}
        height="500px"
      />
    </section>
  );
};
