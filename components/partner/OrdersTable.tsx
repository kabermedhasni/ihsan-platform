"use client";

import StatusBadge, { OrderStatus } from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

interface Order {
  id: string;
  city: string;
  district: string;
  type: string;
  amount: number;
  status: OrderStatus;
  beneficiaries: number;
}

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const t = useTranslations("partner");
  return (
    <div className="bg-secondary/20 rounded-lg border border-white/5 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/2">
          <TableRow className="border-white/5">
            <TableHead className="px-6 py-4 text-primary font-bold text-sm">
              {t("table.id")}
            </TableHead>
            <TableHead className="px-6 py-4 text-primary font-bold text-sm">
              {t("table.location")}
            </TableHead>
            <TableHead className="px-6 py-4 text-primary font-bold text-sm text-center">
              {t("table.people")}
            </TableHead>
            <TableHead className="px-6 py-4 text-primary font-bold text-sm">
              {t("table.amount")}
            </TableHead>
            <TableHead className="px-6 py-4 text-primary font-bold text-sm text-end">
              {t("table.status")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((row) => (
            <TableRow
              key={row.id}
              className="border-white/5 transition-colors group"
            >
              <TableCell className="px-6 py-4 font-mono text-sm text-white">
                #{row.id.slice(0, 8)}...
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="font-bold text-white text-sm">{row.district}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                  {row.city}
                </p>
              </TableCell>
              <TableCell className="px-6 py-4 font-bold text-white text-sm text-center">
                {row.beneficiaries}
              </TableCell>
              <TableCell className="px-6 py-4 font-bold text-primary text-sm whitespace-nowrap">
                {(row.amount || 0).toLocaleString("en-US")}{" "}
                <span className="text-[10px] text-muted-foreground font-mono uppercase">
                  {t("stats.mru")}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-end">
                <StatusBadge status={row.status} />
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow className="border-none">
              <TableCell
                colSpan={5}
                className="px-6 py-12 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest"
              >
                {t("table.noRecords")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
