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
        
        return response()->json([
            'leaderboard' => $gamification->getLeaderboard(),
            'achievements' => $user->achievements()->orderBy('created_at', 'desc')->get(),
            'stats' => [
                'total_videos' => $user->remakeTasks()->where('status', 'success')->count(),
                'total_referrals' => $user->referrals()->count(),
            ]
        ]);
    }
}
