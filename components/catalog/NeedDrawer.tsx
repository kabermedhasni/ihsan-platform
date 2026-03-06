import React from 'react';
import Link from 'next/link';
import { X, MapPin, User, Heart, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import CategoryIcon from './CategoryIcon';
import { Need } from '@/types/need';

const NeedDrawer = ({
    need,
    isOpen,
    onClose
}: {
    need: Need | null;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const t = useTranslations("catalog");
    const tCats = useTranslations("catalog.categories");

    const formatTimeRemaining = (dateString: string) => {
        if (!dateString) return t("card.unknown");
        const expiresAt = new Date(dateString);
        const now = new Date();
        if (expiresAt < now) return t("card.expired");
        const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) return t("card.endsTomorrow");
        if (diffDays <= 7) return t("card.endsInDays", { days: diffDays });
        return t("card.endsOn", { date: expiresAt.toLocaleDateString() });
    };

    // Map database categories to translation keys
    const categoryKey = need?.category.toLowerCase().replace(/\s+/g, '') || "other";
    const displayCategory = tCats(categoryKey as any) || need?.category;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-card text-card-foreground z-50 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto flex flex-col`}
            >
                {need && (
                    <>
                        {/* Header */}
                        <div className="sticky top-0 bg-card/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-border z-10">
                            <span className="font-bold text-foreground">{t("drawer.needDetails")}</span>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 flex-1 text-left rtl:text-right">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                    <CategoryIcon category={need.category} className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-primary mb-1">{displayCategory}</div>
                                    <h2 className="text-xl font-bold text-foreground leading-tight">{need.title}</h2>
                                </div>
                            </div>

                            <div className="mb-6 flex gap-2">
                                <StatusBadge status={need.status} />
                            </div>

                            {/* Info Section */}
                            <div className="bg-secondary/50 rounded-2xl p-5 mb-8 space-y-4 border border-border">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-0.5">{t("drawer.location")}</div>
                                        <div className="font-medium text-foreground">{need.city}, {need.district}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-0.5">{t("drawer.verifiedBy")}</div>
                                        <div className="font-medium text-foreground">{need.validator}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Heart className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-0.5">{t("drawer.beneficiaries")}</div>
                                        <div className="font-medium text-foreground">{t("drawer.beneficiariesCount", { count: need.beneficiaries })}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-foreground mb-3">{t("drawer.description")}</h3>
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    {need.description}
                                </p>
                            </div>

                            {/* Funding */}
                            <div className="bg-primary/10 rounded-2xl p-5 mb-6 border border-primary/20">
                                <h3 className="font-bold text-foreground mb-4">{t("drawer.fundingStatus")}</h3>
                                <ProgressBar current={need.total_donated} max={need.amount_required} />
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-primary/20 text-foreground">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground font-medium mb-1">{t("drawer.donors")}</span>
                                        <span className="font-bold">{need.donors_count || 0}</span>
                                    </div>
                                    <div className="flex flex-col items-end rtl:items-start">
                                        <span className="text-xs text-muted-foreground font-medium mb-1">{t("drawer.timeRemaining")}</span>
                                        <span className="font-bold text-sm">{formatTimeRemaining(need.expires_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer CTA */}
                        <div className="p-6 border-t border-border bg-card sticky bottom-0 z-10">
                            <Link
                                href={`/donate/${need.id}`}
                                className="w-full py-3.5 px-4 rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 font-bold text-lg transition-all text-center flex items-center justify-center gap-2"
                            >
                                {t("drawer.donateToThisNeed")}
                                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default NeedDrawer;
