<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAchievement extends Model
{
    protected $fillable = [
        'user_id',
        'achievement_type',
        'badge_name',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
