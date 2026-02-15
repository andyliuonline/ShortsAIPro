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
        Schema::table('users', function (Blueprint $col) {
            $col->string('google_id')->nullable()->after('id');
            $col->text('google_token')->nullable()->after('google_id');
            $col->text('google_refresh_token')->nullable()->after('google_token');
            $col->timestamp('google_token_expires_at')->nullable()->after('google_refresh_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $col) {
            $col->dropColumn(['google_id', 'google_token', 'google_refresh_token', 'google_token_expires_at']);
        });
    }
};
