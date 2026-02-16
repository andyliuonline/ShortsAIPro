<?php

namespace App\Http\Controllers;

use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReferralController extends Controller
{
    public function getReferrals()
    {
        $user = Auth::user();
        $referrals = $user->referrals()
            ->select('id', 'name', 'created_at', 'plan')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($u) {
                return [
                    'name' => substr($u->name, 0, 1) . '***',
                    'date' => $u->created_at->toDateString(),
                    'status' => $u->plan ? '已訂閱' : '已註冊',
                ];
            });

        $commissions = $user->commissions()
            ->with('referredUser:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'referrals' => $referrals,
            'commissions' => $commissions,
        ]);
    }

    public function updateBankInfo(Request $request)
    {
        $request->validate([
            'bank_code' => 'required|string|max:10',
            'bank_account' => 'required|string|max:50',
            'bank_name' => 'required|string|max:100',
        ]);

        Auth::user()->update($request->only(['bank_code', 'bank_account', 'bank_name']));

        return back()->with('status', '銀行資訊已更新');
    }

    public function requestWithdrawal(Request $request)
    {
        $user = Auth::user();
        $pendingAmount = $user->commissions()->where('status', 'pending')->sum('amount');

        if ($pendingAmount < 1000) {
            return response()->json(['error' => '未達提領門檻 NT$ 1,000'], 422);
        }

        if (!$user->bank_account) {
            return response()->json(['error' => '請先設定銀行收款資訊'], 422);
        }

        WithdrawalRequest::create([
            'user_id' => $user->id,
            'amount' => $pendingAmount,
            'bank_code' => $user->bank_code,
            'bank_account' => $user->bank_account,
            'bank_name' => $user->bank_name,
            'status' => 'pending',
        ]);

        // Mark pending commissions as 'processing' (simplification)
        $user->commissions()->where('status', 'pending')->update(['status' => 'processing']);

        return response()->json(['success' => true, 'message' => '提領申請已送出，預計 3-5 個工作天處理完成']);
    }
}
