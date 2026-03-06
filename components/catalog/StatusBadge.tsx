import React from 'react';
import { useTranslations } from 'next-intl';

type NeedStatus = 'active' | 'completed' | 'urgent';

const StatusBadge = ({ status }: { status: NeedStatus }) => {
    const t = useTranslations("catalog.statuses");

    const getStyles = () => {
        switch (status) {
            case 'active':
                return 'bg-primary/15 text-primary border-primary/30';
            case 'completed':
                return 'bg-secondary/80 text-foreground border-border';
            case 'urgent':
                return 'bg-destructive/20 text-destructive border-destructive/30';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    const labelKey = status === 'active' ? 'open' : status;

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStyles()}`}>
            {t(labelKey as any) || t('unknown')}
        </span>
    );
};

export default StatusBadge;
