<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DiscoveryController;
use App\Http\Controllers\Auth\GoogleAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('/language', function (\Illuminate\Http\Request $request) {
    $locale = $request->input('locale');
    if (in_array($locale, ['en', 'zh_TW'])) {
        session(['locale' => $locale]);
    }
    return back();
})->name('language.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DiscoveryController::class, 'index'])->name('dashboard');
    Route::get('/api/discovery', [DiscoveryController::class, 'search'])->name('api.discovery');
    Route::post('/api/remake', [DiscoveryController::class, 'remake'])->name('api.remake');
    Route::post('/api/generate', [DiscoveryController::class, 'generate'])->name('api.generate');
    Route::get('/api/generate/status', [DiscoveryController::class, 'status'])->name('api.status');
    Route::get('/api/history', [DiscoveryController::class, 'history'])->name('api.history');
    Route::post('/api/publish', [DiscoveryController::class, 'publish'])->name('api.publish');

    // Referral Routes
    Route::get('/api/referrals', [\App\Http\Controllers\ReferralController::class, 'getReferrals'])->name('api.referrals');
    Route::post('/api/referrals/bank-info', [\App\Http\Controllers\ReferralController::class, 'updateBankInfo'])->name('api.referrals.bank-info');
    Route::post('/api/referrals/withdraw', [\App\Http\Controllers\ReferralController::class, 'requestWithdrawal'])->name('api.referrals.withdraw');

    // Gamification Routes
    Route::get('/api/gamification/stats', [\App\Http\Controllers\GamificationController::class, 'getStats'])->name('api.gamification.stats');

    // Google Auth / YouTube Auth
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

    // Payments
    Route::post('/payment/checkout', [\App\Http\Controllers\PaymentController::class, 'checkout'])->name('payment.checkout');
});

Route::post('/payment/callback', [\App\Http\Controllers\PaymentController::class, 'callback'])->name('payment.callback');
Route::post('/payment/notify', [\App\Http\Controllers\PaymentController::class, 'notify'])->name('payment.notify');

// Admin Routes (require admin role)
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('/withdrawals', [\App\Http\Controllers\Admin\WithdrawalController::class, 'index'])->name('admin.withdrawals');
    Route::post('/withdrawals/{id}/approve', [\App\Http\Controllers\Admin\WithdrawalController::class, 'approve'])->name('admin.withdrawals.approve');
    Route::post('/withdrawals/{id}/reject', [\App\Http\Controllers\Admin\WithdrawalController::class, 'reject'])->name('admin.withdrawals.reject');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::patch('/profile/api-settings', [ProfileController::class, 'updateApiSettings'])->name('profile.api-settings.update');
});

require __DIR__.'/auth.php';
