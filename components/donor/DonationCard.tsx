import React from 'react';
import Link from 'next/link';
import { MapPin, Eye } from 'lucide-react';
import { Donation } from './types';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

export default function DonationCard({ donation }: { donation: Donation }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex justify-between items-start mb-3 gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-base leading-tight mb-1 truncate">
                        {donation.needTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{donation.city}, {donation.district}</span>
                    </div>
                </div>
                <StatusBadge status={donation.status} />
            </div>

            <ProgressBar current={donation.needFunded} max={donation.needTarget} />

            <div className="flex justify-between items-center mt-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Your Donation</p>
                    <p className="text-lg font-extrabold text-primary">
                        {donation.amount.toLocaleString()} MRU
                    </p>
                </div>
                <Link
                    href={`/verify/${donation.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                </Link>
            </div>
        </div>
    );
}
