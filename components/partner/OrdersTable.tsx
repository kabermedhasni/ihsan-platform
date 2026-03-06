"use client";

import StatusBadge, { OrderStatus } from "./StatusBadge";

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
    return (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-secondary/50 border-b border-border">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">People</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {orders.map((row) => (
                            <tr key={row.id} className="hover:bg-accent transition-colors group">
                                <td className="px-6 py-4 font-mono font-bold text-muted-foreground text-xs">#{row.id}</td>
                                <td className="px-6 py-4">
                                    <p className="font-black text-foreground text-sm tracking-tight">{row.district}</p>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{row.city}</p>
                                </td>
                                <td className="px-6 py-4 font-black text-foreground/80 text-sm whitespace-nowrap">{row.type}</td>
                                <td className="px-6 py-4 font-black text-foreground text-sm text-center">{row.beneficiaries}</td>
                                <td className="px-6 py-4 font-black text-primary text-sm whitespace-nowrap">
                                    {(row.amount || 0).toLocaleString('en-US')} <span className="text-[10px] text-muted-foreground font-mono uppercase">MRU</span>
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm font-bold uppercase tracking-widest">
                                    No records to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
