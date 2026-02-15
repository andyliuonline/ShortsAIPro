<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'active_subscriptions' => Subscription::where('status', 'paid')->count(),
                'total_revenue' => Subscription::where('status', 'paid')->sum('amt'),
            ],
            'recent_users' => User::orderBy('created_at', 'desc')->limit(5)->get(),
        ]);
    }

    public function users()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::orderBy('created_at', 'desc')->paginate(10),
        ]);
    }

    public function updateUserPlan(Request $request, User $user)
    {
        $request->validate([
            'plan' => 'required|string',
            'credits' => 'required|integer',
        ]);

        $user->update([
            'plan' => $request->plan,
            'credits' => $request->credits,
        ]);

        return back()->with('status', '使用者方案已更新');
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'settings' => Setting::all()->groupBy('group'),
        ]);
    }

    public function updateSettings(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        return back()->with('status', '系統設定已更新');
    }
}
