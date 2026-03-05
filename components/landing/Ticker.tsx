"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS, fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

const dateLocales = {
  ar: ar,
  en: enUS,
  fr: fr,
};

export default function Ticker() {
  const t = useTranslations("ticker");
  const locale = useLocale();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/donations/recent");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
    // Refresh every minute
    const interval = setInterval(fetchTransactions, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!transactions || transactions.length === 0) return null;

  // Duplicate the array to create a seamless loop
  const duplicatedTransactions = [...transactions, ...transactions];

  return (
    <div className="bg-background/50 border-y border-white/5 py-4 overflow-hidden select-none">
      <motion.div
        className="flex whitespace-nowrap gap-8 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedTransactions.map((tx, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-2 rounded-full text-sm shrink-0"
          >
            <div className="flex items-center gap-2 text-primary font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {t("donationFor")} {tx.needs?.title}
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-foreground/60">
              <MapPin className="w-3.5 h-3.5" />
              <span>{tx.needs?.district}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="text-white font-mono font-bold tracking-tight">
              {tx.amount} MRU
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-foreground/40">
              <Clock className="w-3.5 h-3.5" />
              <span className="capitalize">
                {tx.created_at
                  ? formatDistanceToNow(new Date(tx.created_at), {
                      addSuffix: true,
                      locale:
                        dateLocales[locale as keyof typeof dateLocales] || enUS,
                    })
                  : t("justNow")}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
