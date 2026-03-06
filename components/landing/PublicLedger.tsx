"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PublicLedger() {
  const t = useTranslations("ledger");
  const tStatus = useTranslations("catalog.statuses");
  const [ledgerData, setLedgerData] = useState<any[]>([]);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await fetch("/api/donations/recent");
        const data = await response.json();
        if (Array.isArray(data)) {
          setLedgerData(data);
        }
      } catch (error) {
        console.error("Error fetching ledger:", error);
      }
    };
    fetchLedger();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="bg-secondary/20 rounded-lg border border-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/2">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                  {t("id")}
                </TableHead>
                <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                  {t("need")}
                </TableHead>
                <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                  {t("city")}
                </TableHead>
                <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                  {t("amount")}
                </TableHead>
                <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                  {t("status")}
                </TableHead>
                <TableHead className="px-6 py-4 text-primary font-bold text-sm font-mono text-end">
                  {t("hash")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerData.map((item, idx) => (
                <TableRow
                  key={idx}
                  className="border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <TableCell className="px-6 py-4 text-white font-mono text-sm">
                    {item.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="px-6 py-4 text-white font-medium">
                    {item.needs?.title}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground">
                    {item.needs?.district}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-primary font-bold">
                    {item.amount} MRU
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "completed"
                          ? "bg-primary/20 text-primary"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {tStatus(
                        item.status === "active"
                          ? "open"
                          : item.status === "urgent"
                            ? "inProgress"
                            : item.status,
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground font-mono text-sm text-end">
                    {item.hash
                      ? `${item.hash.slice(0, 6)}...${item.hash.slice(-4)}`
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-end gap-4">
            <button className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all group">
              {t("viewFull")}
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
