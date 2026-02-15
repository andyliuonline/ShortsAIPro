<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('remake_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('original_video_id')->nullable();
            $table->string('original_title')->nullable();
            $table->string('task_id')->unique(); // Kie AI taskId
            $table->string('status')->default('pending'); // pending, running, success, fail
            $table->integer('progress')->default(0);
            $table->string('model_used')->default('sora-2');
            $table->text('visual_prompt')->nullable();
            $table->string('optimized_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('video_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('remake_tasks');
    }
};
