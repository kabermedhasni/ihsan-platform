"use client";

import { useState } from "react";
import { Info, Search, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Transaction } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const VerificationPanel = ({
  onVerify,
}: {
  onVerify: (query: string) => Promise<Transaction | null>;
}) => {
  const t = useTranslations("transparency.verify");
  const tCatalog = useTranslations("catalog");
  const tStats = useTranslations("catalog.statuses");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<Transaction | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async () => {
    if (!search) return;
    setSearching(true);
    setHasSearched(false);
    const found = await onVerify(search);
    setResult(found);
    setSearching(false);
    setHasSearched(true);
  };

  const statusKey = (result?.status || "").toLowerCase().trim();
  let normalizedStatus = "unknown";
  if (["active", "مفتوح"].includes(statusKey)) normalizedStatus = "open";
  else if (["urgent", "عاجل"].includes(statusKey)) normalizedStatus = "urgent";
  else if (["completed", "مكتمل"].includes(statusKey))
    normalizedStatus = "completed";

  return (
    <section className="container mx-auto max-w-7xl px-6 mb-32">
      <div className="bg-card/20 p-8 md:p-12 rounded-2xl border border-border grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-left rtl:text-right">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/20">
              <Info className="w-3.5 h-3.5" /> {t("directVerification")}
            </div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter leading-tight mb-4">
              {t("title")}
            </h2>
            <p className="text-muted-foreground font-medium">{t("subtitle")}</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (hasSearched) setHasSearched(false);
                }}
                placeholder={t("placeholder")}
                className="w-full h-14 border border-border rounded-xl pl-12 pr-6 rtl:pl-6 rtl:pr-12 text-sm font-black text-foreground focus:border-primary focus:bg-muted/50 transition-all outline-none placeholder:font-medium placeholder:text-muted-foreground/40"
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={searching}
              size="lg"
              className="w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              {searching ? t("verifying") : t("button")}
              {!searching && (
                <ArrowRight className="w-5 h-5 rtl:rotate-180 ml-2" />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {result === null && hasSearched && !searching && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-bold text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  {t("notFound")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-primary/5 p-8 rounded-2xl border-2 border-primary/20 relative"
              >
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 animate-pulse">
                  <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50" />
                </div>
                <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-2 justify-start rtl:justify-end">
                  <CheckCircle2 className="w-6 h-6 text-primary" />{" "}
                  {t("recordFound")}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-[10px] font-black text-primary uppercase">
                      MRU
                    </span>
                    <span className="text-lg font-black text-foreground">
                      {result.amount} {tCatalog("mru")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-[10px] font-black text-primary uppercase">
                      {t("beneficiaries")}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {result.beneficiaries} {t("people")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-[10px] font-black text-primary uppercase">
                      Location
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {result.city}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-primary uppercase">
                      Status
                    </span>
                    <span className="text-[10px] font-black bg-primary text-primary-foreground px-3 py-1 rounded-full uppercase">
                      {tStats(normalizedStatus as any) || result.status}
                    </span>
                  </div>
                </div>
                <Button
                  variant="link"
                  onClick={() => setResult(null)}
                  className="mt-8 text-[10px] font-black text-primary uppercase tracking-widest w-full text-center h-auto p-0"
                >
                  {t("clear")}
                </Button>
              </motion.div>
            ) : (
              <div className="aspect-square bg-muted/20 rounded-[2.5rem] border-4 border-dashed border-border flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-card rounded-3xl shadow-lg flex items-center justify-center mb-6 text-muted-foreground/30">
                  <Shield className="w-10 h-10" />
                </div>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs leading-relaxed">
                  {t("waiting")
                    .split("\n")
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
