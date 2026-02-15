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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DiscoveryController::class, 'index'])->name('dashboard');
    Route::get('/api/discovery', [DiscoveryController::class, 'search'])->name('api.discovery');
    Route::post('/api/remake', [DiscoveryController::class, 'remake'])->name('api.remake');
    Route::post('/api/generate', [DiscoveryController::class, 'generate'])->name('api.generate');
    Route::get('/api/generate/status', [DiscoveryController::class, 'status'])->name('api.status');
    Route::get('/api/history', [DiscoveryController::class, 'history'])->name('api.history');
    Route::post('/api/publish', [DiscoveryController::class, 'publish'])->name('api.publish');

    // Google Auth / YouTube Auth
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

    // Payments
    Route::post('/payment/checkout', [\App\Http\Controllers\PaymentController::class, 'checkout'])->name('payment.checkout');

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users', [\App\Http\Controllers\Admin\AdminController::class, 'users'])->name('users');
        Route::post('/users/{user}/plan', [\App\Http\Controllers\Admin\AdminController::class, 'updateUserPlan'])->name('users.update-plan');
        Route::get('/settings', [\App\Http\Controllers\Admin\AdminController::class, 'settings'])->name('settings');
        Route::post('/settings', [\App\Http\Controllers\Admin\AdminController::class, 'updateSettings'])->name('settings.update');
    });
});

Route::post('/payment/callback', [\App\Http\Controllers\PaymentController::class, 'callback'])->name('payment.callback');
Route::post('/payment/notify', [\App\Http\Controllers\PaymentController::class, 'notify'])->name('payment.notify');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
