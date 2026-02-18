<?php

namespace App\Services;

use App\Models\User;
use App\Models\RemakeTask;
use Illuminate\Support\Facades\Log;

class GamificationService
{
    public function awardXp(User $user, int $amount, string $reason = '')
    {
        $oldLevel = $user->level;
        $user->increment('xp', $amount);
        
        $newLevel = $this->calculateLevel($user->xp);
        
        if ($newLevel > $oldLevel) {
            $this->handleLevelUp($user, $oldLevel, $newLevel);
        }

        Log::info("User {$user->id} awarded {$amount} XP for {$reason}. Total XP: {$user->xp}, Level: {$user->level}");
    }

    public function calculateLevel(int $xp): int
    {
        // Simple leveling formula: Level = floor(sqrt(xp / 100)) + 1
        // LV 1: 0 XP
        // LV 2: 100 XP
        // LV 3: 400 XP
        // LV 4: 900 XP
        // LV 5: 1600 XP
        return (int) floor(sqrt($xp / 100)) + 1;
    }

    public function getXpForLevel(int $level): int
    {
        if ($level <= 1) return 0;
        return pow($level - 1, 2) * 100;
    }

    public function getXpProgress(int $currentXp, int $level): array
    {
        $currentLevelXp = $this->getXpForLevel($level);
        $nextLevelXp = $this->getXpForLevel($level + 1);
        $progress = $currentXp - $currentLevelXp;
        $needed = $nextLevelXp - $currentLevelXp;
        
        return [
            'current' => $currentXp,
            'current_level' => $level,
            'next_level' => $level + 1,
            'progress' => $progress,
            'needed' => $needed,
            'percentage' => $needed > 0 ? min(100, round(($progress / $needed) * 100)) : 100,
        ];
    }

    protected function handleLevelUp(User $user, int $oldLevel, int $newLevel)
    {
        $user->update(['level' => $newLevel]);

        // Reward 20 credits per level up
        $rewardCredits = ($newLevel - $oldLevel) * 20;
        $user->increment('credits', $rewardCredits);

        $this->awardAchievement($user, 'level_up', "達到等級 {$newLevel}", "恭喜！您已晉升為第 {$newLevel} 級創作者。");

        Log::info("User {$user->id} leveled up from {$oldLevel} to {$newLevel}. Awarded {$rewardCredits} credits.");
    }

    public function checkVideoAchievements(User $user)
    {
        $count = RemakeTask::where('user_id', $user->id)->where('status', 'success')->count();
        
        if ($count === 1) {
            $this->awardAchievement($user, 'video_milestone_1', '初試啼聲', '成功製作了第一部 AI 影片！');
        } elseif ($count === 10) {
            $this->awardAchievement($user, 'video_milestone_10', '創作達人', '累計製作了 10 部 AI 影片。');
        } elseif ($count === 50) {
            $this->awardAchievement($user, 'video_milestone_50', '影片大師', '累計製作了 50 部 AI 影片，您的影響力正在擴大！');
        } elseif ($count === 100) {
            $this->awardAchievement($user, 'video_milestone_100', '百萬播放製造機', '累計製作了 100 部 AI 影片，已成為頂尖創作者！');
        }
    }

    public function checkStreakAchievements(User $user)
    {
        $streak = $user->streak_count;
        
        if ($streak >= 3) {
            $this->awardAchievement($user, 'streak_3', '小小起步', '連續 3 天不間斷創作！');
        }
        if ($streak >= 7) {
            $this->awardAchievement($user, 'streak_7', '一週連勝', '連續 7 天不間斷創作！');
        }
        if ($streak >= 14) {
            $this->awardAchievement($user, 'streak_14', '雙週冠軍', '連續 14 天不間斷創作！');
        }
        if ($streak >= 30) {
            $this->awardAchievement($user, 'streak_30', '一個月傳奇', '連續 30 天不間斷創作！太厲害了！');
        }
        if ($streak >= 100) {
            $this->awardAchievement($user, 'streak_100', '百日達人', '連續 100 天不間斷創作！您是真正的創作者！');
        }
    }

    public function checkReferralAchievements(User $user)
    {
        $count = $user->referrals()->count();
        
        if ($count >= 1) {
            $this->awardAchievement($user, 'referral_1', '推薦新手', '成功邀請第一位好友加入！');
        }
        if ($count >= 5) {
            $this->awardAchievement($user, 'referral_5', '人脈達人', '成功邀請 5 位好友加入！');
        }
        if ($count >= 10) {
            $this->awardAchievement($user, 'referral_10', '推廣大使', '成功邀請 10 位好友加入！');
        }
        if ($count >= 20) {
            $this->awardAchievement($user, 'referral_20', '超級經紀人', '成功邀請 20 位好友加入！');
        }
    }

    public function checkSubscriptionAchievements(User $user)
    {
        if (!$user->plan) return;
        
        $this->awardAchievement($user, 'first_purchase', '首次訂閱', '感謝您成為 ShortsAIPro 的會員！');
        
        if ($user->plan === 'flagship') {
            $this->awardAchievement($user, 'flagship_member', '尊貴旗艦會員', '歡迎加入 ShortsAIPro 旗艦行列！');
        }
    }

    public function checkYouTubeAchievements(User $user)
    {
        if ($user->google_refresh_token) {
            $this->awardAchievement($user, 'youtube_connected', 'YouTube 連接', '成功連接 YouTube 頻道！');
        }
    }

    public function awardAchievement(User $user, string $type, string $name, string $desc)
    {
        if (!$user->achievements()->where('achievement_type', $type)->exists()) {
            $user->achievements()->create([
                'achievement_type' => $type,
                'badge_name' => $name,
                'description' => $desc,
            ]);
            
            // Achievement bonus: extra 10 credits
            $user->increment('credits', 10);
            Log::info("User {$user->id} earned achievement: {$name}");
            
            return true; // New achievement awarded
        }
        
        return false; // Already had this achievement
    }

    public function getLeaderboard()
    {
        return User::orderBy('xp', 'desc')
            ->limit(10)
            ->get(['id', 'name', 'level', 'xp', 'streak_count'])
            ->map(function($u, $index) {
                return [
                    'rank' => $index + 1,
                    'name' => substr($u->name, 0, 1) . '***' . substr($u->name, -1),
                    'level' => $u->level,
                    'xp' => $u->xp,
                    'streak' => $u->streak_count
                ];
            });
    }

    public function updateStreak(User $user)
    {
        $now = now();
        $lastGenerated = $user->last_generated_at;

        if (!$lastGenerated) {
            $user->update([
                'streak_count' => 1,
                'last_generated_at' => $now
            ]);
            // Check streak achievements
            $this->checkStreakAchievements($user);
            return;
        }

        $diffInDays = $now->diffInDays($lastGenerated);

        if ($diffInDays === 0) {
            // Same day, update timestamp only
            $user->update(['last_generated_at' => $now]);
        } elseif ($diffInDays === 1) {
            // Sequential day, increment streak
            $user->increment('streak_count');
            $user->update(['last_generated_at' => $now]);
            
            // Streak Bonus: Every 7 days, give 50 credits
            if ($user->streak_count % 7 === 0) {
                $user->increment('credits', 50);
                Log::info("User {$user->id} hit a 7-day streak! Awarded 50 credits.");
            }
            
            // Check streak achievements
            $this->checkStreakAchievements($user);
        } else {
            // Streak broken
            $user->update([
                'streak_count' => 1,
                'last_generated_at' => $now
            ]);
        }
    }

    /**
     * Check all achievements for a user (run periodically or on key events)
     */
    public function checkAllAchievements(User $user)
    {
        $this->checkVideoAchievements($user);
        $this->checkStreakAchievements($user);
        $this->checkReferralAchievements($user);
        $this->checkSubscriptionAchievements($user);
        $this->checkYouTubeAchievements($user);
    }
}
