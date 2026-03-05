import React from 'react';
import { DonationStatus } from './types';

const STATUS_CONFIG: Record<DonationStatus, { label: string; className: string }> = {
    funding: { label: 'Funding', className: 'bg-primary/15 text-primary border-primary/30' },
    'in-progress': { label: 'In Progress', className: 'bg-secondary text-muted-foreground border-border' },
    delivered: { label: 'Delivered', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
};

export default function StatusBadge({ status }: { status: DonationStatus }) {
    const { label, className } = STATUS_CONFIG[status];
    return (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${className}`}>
            {label}
        </span>
    );
}
