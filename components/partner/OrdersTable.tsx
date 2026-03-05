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
        <div className="bg-secondary/20 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-4 text-primary font-black text-xs uppercase tracking-widest">ID</th>
                            <th className="px-6 py-4 text-primary font-black text-xs uppercase tracking-widest">Location</th>
                            <th className="px-6 py-4 text-primary font-black text-xs uppercase tracking-widest">Type</th>
                            <th className="px-6 py-4 text-primary font-black text-xs uppercase tracking-widest text-center">People</th>
                            <th className="px-6 py-4 text-primary font-black text-xs uppercase tracking-widest">Amount</th>
                            <th className="px-6 py-4 text-primary font-black text-xs uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map((row) => (
                            <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 font-mono font-bold text-muted-foreground text-xs">#{row.id}</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-white text-sm">{row.district}</p>
                                    <p className="text-xs text-muted-foreground font-bold uppercase">{row.city}</p>
                                </td>
                                <td className="px-6 py-4 font-bold text-emerald-100/80 text-sm">{row.type}</td>
                                <td className="px-6 py-4 font-black text-white text-sm text-center">{row.beneficiaries}</td>
                                <td className="px-6 py-4 font-black text-primary text-sm">{row.amount} <span className="text-[10px] text-muted-foreground font-mono">MRU</span></td>
                                <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground font-bold italic">
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
