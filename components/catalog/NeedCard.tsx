import React from 'react';
import Link from 'next/link';
import { MapPin, User, Clock, Heart } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import CategoryIcon, { getCategoryLabel } from './CategoryIcon';
import { Need } from '@/types/need';

const formatTimeRemaining = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const expiresAt = new Date(dateString);
    const now = new Date();
    if (expiresAt < now) return 'Expired';
    const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Ends tomorrow';
    if (diffDays <= 7) return `Ends in ${diffDays} days`;
    return `Ends on ${expiresAt.toLocaleDateString()}`;
};

const NeedCard = ({ need, onViewDetails }: { need: Need; onViewDetails: (n: Need) => void }) => {
    return (
        <div className="bg-card text-card-foreground rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border overflow-hidden flex flex-col h-full group">
            {/* Card Header */}
            <div className="p-5 pb-3 border-b border-border flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <CategoryIcon category={need.category} className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{getCategoryLabel(need.category)}</span>
                </div>
                <StatusBadge status={need.status} />
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors text-left">
                    {need.title}
                </h3>

                <div className="space-y-2 mb-6 text-left">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground/60" />
                        <span>{need.city}, {need.district}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <User className="w-4 h-4 text-muted-foreground/60" />
                        <span>Verified by: {need.validator}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <ProgressBar current={need.total_donated} max={need.amount_required} />

                    <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4 fill-primary text-primary" />
                            <span>{need.donors_count || 0} Donors</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeRemaining(need.expires_at)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Actions */}
            <div className="p-5 pt-0 mt-2 gap-3 flex flex-col sm:flex-row">
                <button
                    onClick={() => onViewDetails(need)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-primary bg-primary/10 hover:bg-primary/20 font-medium text-sm transition-colors text-center"
                >
                    View Details
                </button>
                <Link
                    href={`/donate/${need.id}`}
                    className="flex-1 py-2.5 px-4 rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 font-medium text-sm transition-colors text-center flex items-center justify-center gap-2"
                >
                    Donate Now
                </Link>
            </div>
        </div>
    );
};

export default NeedCard;
