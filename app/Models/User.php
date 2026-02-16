<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\RemakeTask;
use App\Models\ReferralCommission;
use App\Models\UserAchievement;
use App\Models\WithdrawalRequest;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'google_token',
        'google_refresh_token',
        'google_token_expires_at',
        'plan',
        'credits',
        'credits_reset_at',
        'referral_code',
        'referred_by',
        'bank_code',
        'bank_account',
        'bank_name',
        'xp',
        'level',
        'streak_count',
        'last_generated_at',
    ];

    protected static function booted()
    {
        static::creating(function ($user) {
            if (!$user->referral_code) {
                $user->referral_code = static::generateUniqueReferralCode();
            }
        });
    }

    protected static function generateUniqueReferralCode()
    {
        do {
            $code = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));
        } while (static::where('referral_code', $code)->exists());

        return $code;
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function remakeTasks()
    {
        return $this->hasMany(RemakeTask::class);
    }

    public function commissions()
    {
        return $this->hasMany(ReferralCommission::class, 'referrer_id');
    }

    public function achievements()
    {
        return $this->hasMany(UserAchievement::class);
    }

    public function withdrawalRequests()
    {
        return $this->hasMany(WithdrawalRequest::class);
    }

    public function awardReferralBonus()
    {
        // Give 50 credits to the newly registered user as a welcome bonus for being referred
        $this->increment('credits', 50);
        
        // Optionally, we could also notify the referrer here
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'google_token_expires_at' => 'datetime',
        ];
    }
}
