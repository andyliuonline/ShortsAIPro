<?php

namespace App\Http\Controllers;

use App\Services\GamificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GamificationController extends Controller
{
    public function getStats(GamificationService $gamification)
    {
        $user = Auth::user();
        
        // Get XP progress
        $xpProgress = $gamification->getXpProgress($user->xp, $user->level);
        
        return response()->json([
            'leaderboard' => $gamification->getLeaderboard(),
            'achievements' => $user->achievements()->orderBy('created_at', 'desc')->get(),
            'stats' => [
                'total_videos' => $user->remakeTasks()->where('status', 'success')->count(),
                'total_referrals' => $user->referrals()->count(),
                'current_plan' => $user->plan,
                'credits' => $user->credits,
            ],
            'user_progress' => [
                'level' => $user->level,
                'xp' => $user->xp,
                'streak' => $user->streak_count,
                'xp_progress' => $xpProgress,
            ]
        ]);
    }
}
