<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        if ($user) {
            $user->loadCount('referrals');
            $user->total_commissions = $user->commissions()->where('status', 'paid')->sum('amount');
            $user->pending_commissions = $user->commissions()->where('status', 'pending')->sum('amount');
            $user->referral_link = route('register', ['ref' => $user->referral_code]);
            
            // Gamification data
            $gamification = app(\App\Services\GamificationService::class);
            $user->next_level_xp = $gamification->getXpForLevel($user->level + 1);
            $user->prev_level_xp = $gamification->getXpForLevel($user->level);
            $user->xp_progress = $user->next_level_xp > $user->prev_level_xp 
                ? round(($user->xp - $user->prev_level_xp) / ($user->next_level_xp - $user->prev_level_xp) * 100)
                : 100;
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'referral_bonus' => session('referred_by_code') ? true : false,
        ];
    }
}
