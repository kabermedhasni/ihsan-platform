import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Shield } from 'lucide-react';
import { Donation } from './types';
import StatusBadge from './StatusBadge';

export default function DonationsTable({ donations }: { donations: Donation[] }) {
    const [query, setQuery] = useState('');

    const filtered = donations.filter(d =>
        d.needTitle.toLowerCase().includes(query.toLowerCase()) ||
        d.city.toLowerCase().includes(query.toLowerCase()) ||
        d.id.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <h2 className="text-xl font-extrabold text-foreground">Donation History</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                {['ID', 'City', 'Category', 'Amount', 'Status', 'Date', 'Verify'].map(h => (
                                    <th key={h} className="text-left text-xs font-bold text-muted-foreground px-4 py-3 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                                        No donations found.
                                    </td>
                                </tr>
                            ) : filtered.map((d, i) => (
                                <tr
                                    key={d.id}
                                    className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${i % 2 !== 0 ? 'bg-secondary/20' : ''}`}
                                >
                                    <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{d.id}</td>
                                    <td className="px-4 py-3.5 text-foreground">{d.city}</td>
                                    <td className="px-4 py-3.5 text-foreground">{d.category}</td>
                                    <td className="px-4 py-3.5 font-bold text-primary whitespace-nowrap">
                                        {d.amount.toLocaleString()} MRU
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <StatusBadge status={d.status} />
                                    </td>
                                    <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                                        {new Date(d.date).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <Link
                                            href={`/verify/${d.id}`}
                                            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                        >
                                            <Shield className="w-3.5 h-3.5" />
                                            Verify
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
}
