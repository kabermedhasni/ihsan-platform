"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ValidatorNeed } from "./NeedCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NeedsHistoryTableProps {
  needs: ValidatorNeed[];
}

export const NeedsHistoryTable = ({ needs }: NeedsHistoryTableProps) => {
  const t = useTranslations("validator");
  const tCatalog = useTranslations("catalog");
  const [query, setQuery] = useState("");

  const filtered = needs.filter(
    (n) =>
      n.title?.toLowerCase().includes(query.toLowerCase()) ||
      n.city?.toLowerCase().includes(query.toLowerCase()) ||
      n.id?.toLowerCase().includes(query.replace(/^#/, "").toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black text-foreground tracking-tighter text-left rtl:text-right">
          {t("history.title")}
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t("history.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 rtl:pl-4 rtl:pr-12 h-12 border rounded-xl text-sm font-bold bg-card border-border"
          />
        </div>
      </div>

      <div className="bg-secondary/20 rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/2">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("history.table.id")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("history.table.city")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("history.table.category")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("history.table.amount")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("history.table.status")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm text-end">
                {t("history.table.action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="border-none">
                <TableCell
                  colSpan={6}
                  className="px-6 py-12 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest"
                >
                  {t("history.noRecords")}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((n) => (
                <TableRow
                  key={n.id}
                  className="border-white/5 transition-colors group"
                >
                  <TableCell className="px-6 py-4 font-mono text-sm text-white">
                    #{n.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="px-6 py-4 text-white font-medium">
                    {n.city}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-[10px] font-black uppercase tracking-widest">
                      {n.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-primary whitespace-nowrap">
                    {n.targetAmount.toLocaleString("en-US")}{" "}
                    <span className="text-xs uppercase ml-1">
                      {tCatalog("mru")}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <StatusBadge status={n.status} />
                  </TableCell>
                  <TableCell className="px-6 py-4 text-end">
                    <Button
                      asChild
                      variant="link"
                      className="text-[10px] font-black w-full justify-end text-primary uppercase tracking-widest hover:underline inline-flex items-center gap-1 group whitespace-nowrap h-auto p-0"
                    >
                      <Link href={`/needs/${n.id}`}>
                        {t("history.table.view")}
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
