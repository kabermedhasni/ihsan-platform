"use client";

import { CheckCircle2, ChevronRight, Calendar } from "lucide-react";
import { Transaction } from "./types";
import { useTranslations } from "next-intl";

const HashBadge = ({ hash }: { hash: string }) => (
    <div className="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border border-border group-hover:border-primary/30 transition-colors">
        <span className="text-[10px] font-mono text-muted-foreground font-black tracking-widest uppercase">
            {hash.slice(0, 6)}...{hash.slice(-4)}
        </span>
    </div>
);

const TableRow = ({ tx, onClick }: { tx: Transaction, onClick: () => void }) => {
    const tCatalog = useTranslations("catalog");
    const tCats = useTranslations("catalog.categories");
    const tStats = useTranslations("catalog.statuses");

    const categoryKey = (tx.category || "").toLowerCase().trim().replace(/\s+/g, '');
    let normalizedCategory = "other";
    if (["meals", "وجبات"].includes(categoryKey)) normalizedCategory = "meals";
    else if (["medical", "طبي"].includes(categoryKey)) normalizedCategory = "medical";
    else if (["housing", "إيواء"].includes(categoryKey)) normalizedCategory = "housing";

    const statusKey = (tx.status || "").toLowerCase().trim();
    let normalizedStatus = "unknown";
    if (["active", "مفتوح"].includes(statusKey)) normalizedStatus = "open";
    else if (["urgent", "عاجل"].includes(statusKey)) normalizedStatus = "urgent";
    else if (["completed", "مكتمل"].includes(statusKey)) normalizedStatus = "completed";

    return (
        <tr
            onClick={onClick}
            className="group hover:bg-primary/5 cursor-pointer transition-all border-b border-border last:border-0"
        >
            <td className="py-5 pl-6 rtl:pl-0 rtl:pr-6">
                <span className="text-xs font-black text-muted-foreground group-hover:text-primary transition-colors">#{tx.id.slice(0, 4)}</span>
            </td>
            <td className="py-5 text-left rtl:text-right">
                <span className="text-sm font-bold text-foreground">{tx.city}</span>
            </td>
            <td className="py-5 text-left rtl:text-right">
                <span className="text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground px-2 py-1 rounded-md">
                    {tCats(normalizedCategory as any) || tx.category}
                </span>
            </td>
            <td className="py-5 text-sm font-black text-foreground text-left rtl:text-right">
                {tx.amount?.toLocaleString()} {tCatalog("mru")}
            </td>
            <td className="py-5 text-left rtl:text-right">
                <div className="flex items-center gap-1.5 justify-start rtl:justify-end">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                        {tStats(normalizedStatus as any) || tx.status}
                    </span>
                </div>
            </td>
            <td className="py-5 text-[10px] font-bold text-muted-foreground text-left rtl:text-right">
                {tx.timestamp}
            </td>
            <td className="py-5 pr-6 rtl:pr-0 rtl:pl-6">
                <div className="flex items-center justify-between gap-4">
                    <HashBadge hash={tx.hash} />
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all rtl:rotate-180" />
                </div>
            </td>
        </tr>
    );
};

export const LedgerTable = ({ transactions, onSelectRow }: { transactions: Transaction[], onSelectRow: (tx: Transaction) => void }) => {
    const t = useTranslations("transparency.ledger");
    return (
        <section className="mb-32">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 px-6 md:px-0">
                <div className="text-left rtl:text-right">
                    <h2 className="text-3xl font-black text-foreground tracking-tighter">{t("title")}</h2>
                    <p className="text-muted-foreground font-medium mt-1">{t("subtitle")}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right rtl:text-left hidden sm:block">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{t("networkStatus")}</p>
                        <p className="text-xs font-bold text-foreground">{t("synchronized")}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-[2.5rem] shadow-2xl shadow-black/20 border border-border overflow-hidden mx-6 md:mx-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left rtl:text-right border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="py-5 pl-6 rtl:pl-0 rtl:pr-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left rtl:text-right">{t("id")}</th>
                                <th className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left rtl:text-right">{t("city")}</th>
                                <th className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left rtl:text-right">{t("category")}</th>
                                <th className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left rtl:text-right">{t("amount")}</th>
                                <th className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left rtl:text-right">{t("status")}</th>
                                <th className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left rtl:text-right">{t("time")}</th>
                                <th className="py-5 pr-6 rtl:pr-0 rtl:pl-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left rtl:text-right">{t("hash")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <TableRow
                                    key={tx.id}
                                    tx={tx}
                                    onClick={() => onSelectRow(tx)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-muted/30 border-t border-border flex justify-center">
                    <button className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2 group">
                        {t("viewOlder")}
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                    </button>
                </div>
            </div>
        </section>
    );
};
