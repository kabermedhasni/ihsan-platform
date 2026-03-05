import React from 'react';
import Link from 'next/link';
import { CheckCircle, Calendar, ExternalLink } from 'lucide-react';
import { Donation } from './types';

export default function ProofCard({ donation }: { donation: Donation }) {
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            {donation.proofImage && (
                <div className="h-40 overflow-hidden">
                    <img
                        src={donation.proofImage}
                        alt="Proof of impact"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="p-5">
                <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground font-medium">{donation.validatorMessage}</p>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(donation.date).toLocaleDateString('en-GB')}</span>
                    </div>
                    <span className="font-bold text-primary">{donation.amount.toLocaleString()} MRU</span>
                </div>
                <Link
                    href={`/verify/${donation.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Transaction
                </Link>
            </div>
        </div>
    );
}
