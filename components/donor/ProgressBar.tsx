import React from 'react';

interface Props {
    current: number;
    max: number;
}

export default function ProgressBar({ current, max }: Props) {
    const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
    return (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
                <span>{current.toLocaleString()} / {max.toLocaleString()} MRU</span>
                <span className="text-primary font-bold">{pct}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
