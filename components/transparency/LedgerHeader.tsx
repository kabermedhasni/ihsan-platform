"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const LedgerHeader = () => {
  const t = useTranslations("transparency");
  return (
    <section className="relative pt-20 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="container mx-auto max-w-7xl px-6 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl mt-10 md:text-6xl font-black text-foreground tracking-tighter leading-tight mb-6 text-left rtl:text-right">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed text-left rtl:text-right">
            {t("description")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
