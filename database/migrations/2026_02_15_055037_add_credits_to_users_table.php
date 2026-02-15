<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('plan')->default('free')->after('email'); // free, basic, standard, pro, flagship
            $table->integer('credits')->default(0)->after('plan');
            $table->timestamp('credits_reset_at')->nullable()->after('credits');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['plan', 'credits', 'credits_reset_at']);
        });
    }
};
