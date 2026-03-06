"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "./StatusBadge";
import { Need } from "./NeedCard";

interface NeedsHistoryTableProps {
    needs: Need[];
}

export const NeedsHistoryTable = ({ needs }: NeedsHistoryTableProps) => {
    const t = useTranslations("validator");
    const [query, setQuery] = useState("");

    const filtered = needs.filter(n =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.city.toLowerCase().includes(query.toLowerCase()) ||
        n.id.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-black text-foreground tracking-tighter">{t('history.title')}</h2>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Search history..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-12 h-12 border-2 rounded-xl text-sm font-bold bg-card border-border"
                    />
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/50 border-b border-border">
                            <tr>
                                {[
                                    t('history.table.id'),
                                    t('history.table.city'),
                                    t('history.table.category'),
                                    t('history.table.amount'),
                                    t('history.table.status'),
                                    t('history.table.date'),
                                    t('history.table.action')
                                ].map(h => (
                                    <th key={h} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filtered.map((n, i) => (
                                <tr key={n.id} className={`hover:bg-accent transition-colors ${i % 2 !== 0 ? 'bg-secondary/20' : ''}`}>
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{n.id}</td>
                                    <td className="px-6 py-4 font-black text-xs text-foreground uppercase tracking-tight">{n.city}</td>
                                    <td className="px-6 py-4 font-black">
                                        <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-[10px] font-black uppercase tracking-widest">{n.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-sm text-primary">{n.targetAmount.toLocaleString('en-US')} MRU</td>
                                    <td className="px-6 py-4"><StatusBadge status={n.status} /></td>
                                    <td className="px-6 py-4 font-bold text-[10px] text-muted-foreground uppercase">{new Date(n.createdAt).toLocaleDateString('en-GB')}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/needs/${n.id}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 group whitespace-nowrap">
                                            {t('history.table.view')}
                                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
