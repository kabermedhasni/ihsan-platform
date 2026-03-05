"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    trend?: string;
}

export default function StatCard({ title, value, unit, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="bg-secondary/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative flex items-center gap-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20">
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-black text-white">{value}</h3>
                        {unit && <span className="text-xs font-bold text-primary">{unit}</span>}
                    </div>
                    {trend && (
                        <p className="text-[10px] font-black text-primary/80 mt-1">{trend} from yesterday</p>
                    )}
                </div>
            </div>
        </div>
    );
}
