<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RemakeTask extends Model
{
    protected $fillable = [
        'user_id',
        'original_video_id',
        'original_title',
        'task_id',
        'status',
        'progress',
        'model_used',
        'visual_prompt',
        'optimized_title',
        'seo_description',
        'video_url',
        'youtube_url',
        'published_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
