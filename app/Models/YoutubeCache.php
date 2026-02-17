<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class YoutubeCache extends Model
{
    protected $fillable = [
        'query_hash',
        'query_text',
        'results',
        'expires_at',
    ];

    protected $casts = [
        'results' => 'array',
        'expires_at' => 'datetime',
    ];
}
