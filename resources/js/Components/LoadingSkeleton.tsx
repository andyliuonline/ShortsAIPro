interface LoadingSkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export default function LoadingSkeleton({ 
    className = '', 
    variant = 'rectangular', 
    width = '100%', 
    height = '1rem',
    count = 1 
}: LoadingSkeletonProps) {
    const baseClasses = 'animate-pulse bg-gray-200 dark:bg-zinc-800';
    
    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div 
                    key={i}
                    className={`${baseClasses} ${variantClasses[variant]} ${className}`}
                    style={style}
                />
            ))}
        </>
    );
}

// Predefined skeleton components for common use cases
export function VideoCardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden p-4">
            <LoadingSkeleton height={280} className="mb-4" />
            <LoadingSkeleton height="1rem" width="80%" className="mb-2" />
            <LoadingSkeleton height="0.75rem" width="60%" />
        </div>
    );
}

export function StatsCardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
            <LoadingSkeleton height="1rem" width="40%" className="mb-4" />
            <LoadingSkeleton height="2.5rem" width="60%" />
        </div>
    );
}

export function LeaderboardSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800">
                    <LoadingSkeleton variant="circular" width={32} height={32} />
                    <div className="flex-1">
                        <LoadingSkeleton height="1rem" width="30%" className="mb-2" />
                        <LoadingSkeleton height="0.75rem" width="20%" />
                    </div>
                    <LoadingSkeleton height="1.5rem" width="15%" />
                </div>
            ))}
        </div>
    );
}
