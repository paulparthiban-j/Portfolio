interface LiveBadgeProps {
    label?: string;
    className?: string;
}

export function LiveBadge({ label = "Live", className = "" }: LiveBadgeProps) {
    return (
        <span className={`inline-flex items-center gap-1.5 ${className}`}>
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{label}</span>
        </span>
    );
}
