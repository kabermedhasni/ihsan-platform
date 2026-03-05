"use client";

interface TimelineItem {
    time: string;
    title: string;
    status: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
    return (
        <div className="bg-secondary/30 backdrop-blur-md p-8 rounded-3xl border border-white/5 relative">
            <div className="absolute top-8 bottom-8 left-[3.25rem] w-px bg-white/10" />
            <div className="space-y-12">
                {items.map((item, idx) => (
                    <div key={idx} className="relative flex gap-6 pl-4">
                        <div className="relative z-10 w-10 h-10 bg-background border-2 border-primary rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </div>
                        <div className="space-y-1 pt-1">
                            <p className="text-xs font-black text-primary uppercase tracking-widest">{item.time}</p>
                            <h4 className="font-bold text-white">{item.title}</h4>
                            <p className="text-xs text-muted-foreground font-bold lowercase">{item.status}</p>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <p className="text-muted-foreground font-bold italic text-sm text-center py-10">
                        Your daily activity will appear here.
                    </p>
                )}
            </div>
        </div>
    );
}
