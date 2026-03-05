import React from 'react';

interface Props {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
}

export default function StatCard({ icon, label, value, sub }: Props) {
    return (
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-2xl font-extrabold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
                {sub && <p className="text-xs text-primary font-medium mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}
