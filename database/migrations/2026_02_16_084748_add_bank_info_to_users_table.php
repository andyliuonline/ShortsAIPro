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
            $table->string('bank_code', 10)->nullable()->after('referred_by');
            $table->string('bank_account', 50)->nullable()->after('bank_code');
            $table->string('bank_name', 100)->nullable()->after('bank_account');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bank_code', 'bank_account', 'bank_name']);
        });
    }
};
