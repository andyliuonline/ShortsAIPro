import { useState, useEffect } from 'react';
import { Trophy, X } from 'lucide-react';

interface Achievement {
    id: number;
    badge_name: string;
    description: string;
}

interface AchievementToastProps {
    achievement: Achievement | null;
    onClose: () => void;
    duration?: number;
}

export default function AchievementToast({ 
    achievement, 
    onClose, 
    duration = 5000 
}: AchievementToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (achievement) {
            // Trigger entrance animation
            setTimeout(() => setIsVisible(true), 100);
            
            // Auto dismiss
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [achievement]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if (!achievement || !isVisible) return null;

    return (
        <div 
            className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
                isLeaving 
                    ? 'opacity-0 translate-x-full' 
                    : 'opacity-100 translate-x-0'
            }`}
        >
            <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-400 rounded-2xl shadow-2xl shadow-orange-500/30 p-1">
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0 animate-bounce">
                            <Trophy className="text-white" size={28} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-black uppercase tracking-wider text-orange-500">
                                    成就解鎖！
                                </h4>
                                <button 
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                                {achievement.badge_name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                {achievement.description}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <p className="text-xs text-center text-gray-400 dark:text-zinc-500">
                            獲得 10 積分獎勵！ 🎉
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Toast container to manage multiple toasts
export function AchievementToastContainer({ 
    achievements, 
    onDismiss 
}: { 
    achievements: Achievement[]; 
    onDismiss: (id: number) => void;
}) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3">
            {achievements.map((achievement, index) => (
                <div 
                    key={achievement.id}
                    style={{ marginTop: `${index * 140}px` }}
                >
                    <AchievementToast 
                        achievement={achievement} 
                        onClose={() => onDismiss(achievement.id)}
                    />
                </div>
            ))}
        </div>
    );
}
