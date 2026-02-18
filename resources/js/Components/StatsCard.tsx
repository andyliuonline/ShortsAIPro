import { Zap } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: 'yellow' | 'green' | 'blue' | 'orange' | 'purple';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatsCard({ title, value, subtitle, icon, color = 'yellow', trend }: StatsCardProps) {
    const colorClasses = {
        yellow: 'from-yellow-400/10 to-yellow-500/5 border-yellow-400/20',
        green: 'from-green-400/10 to-green-500/5 border-green-400/20',
        blue: 'from-blue-400/10 to-blue-500/5 border-blue-400/20',
        orange: 'from-orange-400/10 to-orange-500/5 border-orange-400/20',
        purple: 'from-purple-400/10 to-purple-500/5 border-purple-400/20',
    };

    const iconColorClasses = {
        yellow: 'text-yellow-500',
        green: 'text-green-500',
        blue: 'text-blue-500',
        orange: 'text-orange-500',
        purple: 'text-purple-500',
    };

    return (
        <div className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-1">{title}</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{subtitle}</p>}
                    {trend && (
                        <p className={`text-xs font-bold mt-2 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 ${iconColorClasses[color]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

export function LevelProgress({ level, xp, progress }: { level: number; xp: number; progress: { current: number; next_level: number; progress: number; needed: number; percentage: number } }) {
    return (
        <div className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <Zap className="text-white" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500">等級</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">LV {level}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{xp.toLocaleString()} XP</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">距離 Lv.{progress.next_level} 還需 {progress.needed - progress.progress} XP</p>
                </div>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                />
            </div>
            <p className="text-xs text-center mt-2 text-gray-500 dark:text-zinc-500">{progress.percentage}% 完成</p>
        </div>
    );
}
