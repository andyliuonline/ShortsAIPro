<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WithdrawalRequest extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'bank_code',
        'bank_account',
        'bank_name',
        'status',
        'admin_note',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
