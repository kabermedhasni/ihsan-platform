import React from 'react';

const ProgressBar = ({ current, max }: { current: number; max: number }) => {
    const percentage = Math.min(Math.round((current / max) * 100), 100) || 0;

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-foreground">
                    {current.toLocaleString()} / {max.toLocaleString()} MRU
                </span>
                <span className="text-primary font-bold">{percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
