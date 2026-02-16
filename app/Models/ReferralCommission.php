<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralCommission extends Model
{
    protected $fillable = [
        'referrer_id',
        'referred_user_id',
        'subscription_id',
        'amount',
        'status',
    ];

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referredUser()
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
