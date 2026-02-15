<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('plan');
            $table->string('merchant_order_no')->unique(); // 藍新訂單編號
            $table->string('trade_no')->nullable(); // 藍新交易序號
            $table->integer('amt');
            $table->string('payment_type')->nullable(); // 支付方式
            $table->string('status')->default('pending'); // pending, paid, failed, canceled
            $table->timestamp('paid_at')->nullable();
            $table->string('invoice_no')->nullable(); // Giveme 發票號碼
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
