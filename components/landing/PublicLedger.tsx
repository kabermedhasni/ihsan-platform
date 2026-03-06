"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await fetch("/api/donations/recent");
        if (!response.ok) throw new Error("Failed to fetch ledger");
        const data = await response.json();
        if (Array.isArray(data)) {
          setLedgerData(data);
        }
      } catch (error: any) {
        console.error("Error fetching ledger:", error);
        setError(error.message);
      } finally {
        setLoading(false);
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
              {loading ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                       <span className="text-muted-foreground text-sm">Loading ledger...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="px-6 py-12 text-center text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : ledgerData.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    {t("noData") || "No recent transactions found"}
                  </TableCell>
                </TableRow>
              ) : (
                ledgerData.map((item, idx) => (
                  <TableRow
                    key={item.id || idx}
                    className="border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <TableCell className="px-6 py-4 text-white font-mono text-sm">
                      {item.id ? `${item.id.slice(0, 8)}...` : "N/A"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-white font-medium">
                      {item.needs?.title || "Donation"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {item.needs?.district || "Unknown"}
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
                        ) ||
                          (item.status === "completed"
                            ? "Confirmed"
                            : "In Progress")}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground font-mono text-sm text-end">
                      {item.hash
                        ? `${item.hash.slice(0, 6)}...${item.hash.slice(-4)}`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-end gap-4">
            <Link
              href="/transparency"
              className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all group"
            >
              {t("viewFull")}
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
