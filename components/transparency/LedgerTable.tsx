"use client";

import { CheckCircle2, ChevronRight, Calendar } from "lucide-react";
import { Transaction } from "./types";
import { useTranslations } from "next-intl";
import { HashBadge } from "@/components/payment/HashBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as UITableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const TableRow = ({
  tx,
  onClick,
}: {
  tx: Transaction;
  onClick: () => void;
}) => {
  const tCatalog = useTranslations("catalog");
  const tCats = useTranslations("catalog.categories");
  const tStats = useTranslations("catalog.statuses");

  const categoryKey = (tx.category || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "");
  let normalizedCategory = "other";
  if (["meals", "وجبات"].includes(categoryKey)) normalizedCategory = "meals";
  else if (["medical", "طبي"].includes(categoryKey))
    normalizedCategory = "medical";
  else if (["housing", "إيواء"].includes(categoryKey))
    normalizedCategory = "housing";

  const statusKey = (tx.status || "").toLowerCase().trim();
  let normalizedStatus = "unknown";
  if (["active", "مفتوح"].includes(statusKey)) normalizedStatus = "open";
  else if (["urgent", "عاجل"].includes(statusKey)) normalizedStatus = "urgent";
  else if (["completed", "مكتمل"].includes(statusKey))
    normalizedStatus = "completed";

  return (
    <UITableRow
      onClick={onClick}
      className="border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
    >
      <TableCell className="px-6 py-4 text-white font-mono text-sm">
        #{tx.id.slice(0, 8)}...
      </TableCell>
      <TableCell className="px-6 py-4 text-white font-medium">
        {tx.city}
      </TableCell>
      <TableCell className="px-6 py-4">
        <span className="text-[10px] font-black uppercase tracking-widest bg-secondary text-muted-foreground px-2 py-1 rounded-md">
          {tCats(normalizedCategory as any) || tx.category}
        </span>
      </TableCell>
      <TableCell className="px-6 py-4 text-primary font-bold">
        {tx.amount?.toLocaleString()} {tCatalog("mru")}
      </TableCell>
      <TableCell className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            normalizedStatus === "completed"
              ? "bg-primary/20 text-primary"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {tStats(normalizedStatus as any) || tx.status}
        </span>
      </TableCell>
      <TableCell className="px-6 py-4 text-muted-foreground font-mono text-sm text-end">
        {tx.timestamp}
      </TableCell>
      <TableCell className="px-6 py-4 text-end">
        <div className="flex items-center justify-end gap-4">
          <HashBadge hash={tx.hash} />
        </div>
      </TableCell>
    </UITableRow>
  );
};

export const LedgerTable = ({
  transactions,
  onSelectRow,
}: {
  transactions: Transaction[];
  onSelectRow: (tx: Transaction) => void;
}) => {
  const t = useTranslations("transparency.ledger");
  return (
    <section className="mb-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 px-6 md:px-0">
        <div className="text-left rtl:text-right">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">
            {t("title")}
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right rtl:text-left hidden sm:block">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
              {t("networkStatus")}
            </p>
            <p className="text-xs font-bold text-foreground">
              {t("synchronized")}
            </p>
          </div>
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-secondary/20 rounded-lg border border-white/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/2">
            <UITableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("id")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("city")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("category")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("amount")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("status")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm">
                {t("time")}
              </TableHead>
              <TableHead className="px-6 py-4 text-primary font-bold text-sm font-mono text-end">
                {t("hash")}
              </TableHead>
            </UITableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} tx={tx} onClick={() => onSelectRow(tx)} />
            ))}
          </TableBody>
        </Table>
        <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-end gap-4">
          <Button
            variant="default"
            className="rounded-xl font-bold transition-all group px-8"
          >
            {t("viewOlder")}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
