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
        'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get status display text in Chinese
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            'pending' => '待處理',
            'processing' => '處理中',
            'completed' => '已完成',
            'rejected' => '已拒絕',
            default => $this->status,
        };
    }
}
