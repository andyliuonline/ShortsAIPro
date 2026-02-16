<?php

namespace App\Services;

use App\Models\User;
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
        $count = \App\Models\RemakeTask::where('user_id', $user->id)->where('status', 'success')->count();
        
        if ($count === 1) {
            $this->awardAchievement($user, 'video_milestone_1', '初試啼聲', '成功製作了第一部 AI 影片！');
        } elseif ($count === 10) {
            $this->awardAchievement($user, 'video_milestone_10', '創作達人', '累計製作了 10 部 AI 影片。');
        } elseif ($count === 50) {
            $this->awardAchievement($user, 'video_milestone_50', '影片大師', '累計製作了 50 部 AI 影片，您的影響力正在擴大！');
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
        }
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
        } else {
            // Streak broken
            $user->update([
                'streak_count' => 1,
                'last_generated_at' => $now
            ]);
        }
    }
}
