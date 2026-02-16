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
        $authData = [
            'user' => $user,
        ];

        if ($user) {
            try {
                $user->loadCount('referrals');
                
                $gamification = app(\App\Services\GamificationService::class);
                $nextXp = $gamification->getXpForLevel($user->level + 1);
                $prevXp = $gamification->getXpForLevel($user->level);
                
                $authData['referral'] = [
                    'total_commissions' => (float)$user->commissions()->where('status', 'paid')->sum('amount'),
                    'pending_commissions' => (float)$user->commissions()->where('status', 'pending')->sum('amount'),
                    'referral_link' => url('/register?ref=' . $user->referral_code),
                    'referrals_count' => $user->referrals_count,
                ];

                $authData['gamification'] = [
                    'next_level_xp' => $nextXp,
                    'prev_level_xp' => $prevXp,
                    'xp_progress' => $nextXp > $prevXp 
                        ? round(($user->xp - $prevXp) / ($nextXp - $prevXp) * 100)
                        : 100,
                ];
            } catch (\Exception $e) {
                \Log::error("Inertia Share Error: " . $e->getMessage());
                $authData['referral'] = ['referral_link' => '#', 'referrals_count' => 0];
                $authData['gamification'] = ['next_level_xp' => 100, 'xp_progress' => 0];
            }
        }

        return array_merge(parent::share($request), [
            'auth' => $authData,
            'referral_bonus' => session('referred_by_code') ? true : false,
            'locale' => \App::getLocale(),
            'translations' => [
                'ui' => __('ui'),
            ],
        ]);
    }
}
