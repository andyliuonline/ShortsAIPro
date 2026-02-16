<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->scopes([
                'https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/youtube.readonly',
            ])
            ->with(['access_type' => 'offline', 'prompt' => 'consent'])
            ->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            /** @var User $user */
            $user = Auth::user();

            if (!$user) {
                // If not logged in, find or create user by email
                $referredBy = null;
                if (session()->has('referred_by_code')) {
                    $referrer = User::where('referral_code', session('referred_by_code'))->first();
                    if ($referrer) {
                        $referredBy = $referrer->id;
                    }
                }

                $user = User::firstOrCreate([
                    'email' => $googleUser->email,
                ], [
                    'name' => $googleUser->name,
                    'password' => bcrypt(str()->random(16)),
                    'referred_by' => $referredBy,
                ]);

                if ($user->wasRecentlyCreated && $referredBy) {
                    $user->awardReferralBonus();
                }
                
                Auth::login($user);
                session()->forget('referred_by_code');
            }

            // Save tokens to user
            $user->update([
                'google_id' => $googleUser->id,
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
                'google_token_expires_at' => now()->addSeconds($googleUser->expiresIn),
            ]);

            return redirect()->route('dashboard')->with('status', 'YouTube 頻道已成功授權！');

        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'Google 授權失敗：' . $e->getMessage());
        }
    }
}
