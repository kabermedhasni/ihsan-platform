import React from 'react';

type NeedStatus = 'active' | 'completed' | 'urgent';

const StatusBadge = ({ status }: { status: NeedStatus }) => {
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

    const getLabel = () => {
        switch (status) {
            case 'active': return 'Active';
            case 'completed': return 'Completed';
            case 'urgent': return 'Urgent';
            default: return 'Unknown';
        }
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStyles()}`}>
            {getLabel()}
        </span>
    );
};

export default StatusBadge;
