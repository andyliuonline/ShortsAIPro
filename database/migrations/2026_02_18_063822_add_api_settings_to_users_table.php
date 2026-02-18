<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('video_model_provider')->default('kie')->after('last_generated_at');
            $table->string('video_model_id')->default('sora-2-text-to-video')->after('video_model_provider');
            $table->string('user_kie_api_key')->nullable()->after('video_model_id');
            $table->string('analysis_model_provider')->default('minimax')->after('user_kie_api_key');
            $table->string('user_openai_api_key')->nullable()->after('analysis_model_provider');
            $table->string('user_anthropic_api_key')->nullable()->after('user_openai_api_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'video_model_provider',
                'video_model_id',
                'user_kie_api_key',
                'analysis_model_provider',
                'user_openai_api_key',
                'user_anthropic_api_key'
            ]);
        });
    }
};
