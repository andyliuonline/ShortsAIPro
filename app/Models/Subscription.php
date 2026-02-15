<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan',
        'merchant_order_no',
        'trade_no',
        'amt',
        'payment_type',
        'status',
        'paid_at',
        'invoice_no',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
