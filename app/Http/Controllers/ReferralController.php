<?php

namespace App\Http\Controllers;

use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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

        // Get withdrawal history
        $withdrawals = $user->withdrawalRequests()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($w) {
                return [
                    'id' => $w->id,
                    'amount' => $w->amount,
                    'status' => $w->status,
                    'created_at' => $w->created_at->toDateString(),
                    'processed_at' => $w->processed_at ? $w->processed_at->toDateString() : null,
                    'note' => $w->note,
                ];
            });

        // Calculate totals
        $pendingAmount = $user->commissions()->where('status', 'pending')->sum('amount');
        $availableAmount = $user->commissions()->whereIn('status', ['pending', 'available'])->sum('amount');

        return response()->json([
            'referrals' => $referrals,
            'commissions' => $commissions,
            'withdrawals' => $withdrawals,
            'stats' => [
                'pending_amount' => $pendingAmount,
                'available_amount' => $availableAmount,
                'total_earned' => $user->commissions()->sum('amount'),
            ]
        ]);
    }

    public function updateBankInfo(Request $request)
    {
        $request->validate([
            'bank_code' => 'required|string|max:10',
            'bank_account' => 'required|string|max:50',
            'bank_name' => 'required|string|max:100',
        ]);

        $user = Auth::user();
        
        // Validate bank account format (basic validation)
        $bankAccount = $request->input('bank_account');
        if (!preg_match('/^[0-9]+$/', $bankAccount)) {
            return back()->with('error', '銀行帳號格式錯誤，請輸入數字');
        }

        $user->update($request->only(['bank_code', 'bank_account', 'bank_name']));

        Log::info('Bank info updated', ['user_id' => $user->id]);

        return back()->with('status', '銀行資訊已更新');
    }

    public function requestWithdrawal(Request $request)
    {
        $user = Auth::user();
        
        // Check for pending withdrawal requests
        $pendingWithdrawal = $user->withdrawalRequests()
            ->where('status', 'pending')
            ->exists();
            
        if ($pendingWithdrawal) {
            return response()->json(['error' => '您有待處理的提領申請，請耐心等待'], 422);
        }

        $availableAmount = $user->commissions()
            ->whereIn('status', ['pending', 'available'])
            ->sum('amount');

        if ($availableAmount < 1000) {
            return response()->json(['error' => '未達提領門檻 NT$ 1,000，目前可用金額 NT$ ' . $availableAmount], 422);
        }

        if (!$user->bank_account) {
            return response()->json(['error' => '請先設定銀行收款資訊'], 422);
        }

        // Create withdrawal request
        $withdrawal = WithdrawalRequest::create([
            'user_id' => $user->id,
            'amount' => $availableAmount,
            'bank_code' => $user->bank_code,
            'bank_account' => $user->bank_account,
            'bank_name' => $user->bank_name,
            'status' => 'pending',
        ]);

        // Mark pending commissions as processing
        $user->commissions()
            ->whereIn('status', ['pending', 'available'])
            ->update(['status' => 'processing']);

        Log::info('Withdrawal request created', [
            'user_id' => $user->id,
            'amount' => $availableAmount,
            'withdrawal_id' => $withdrawal->id,
        ]);

        // Gamification: Award achievement for first withdrawal
        $isFirstWithdrawal = WithdrawalRequest::where('user_id', $user->id)->count() === 1;
        if ($isFirstWithdrawal) {
            $gamification = app(\App\Services\GamificationService::class);
            $gamification->awardAchievement($user, 'first_withdrawal', '首次提領', '恭喜您成功提領第一筆收益！');
        }

        return response()->json([
            'success' => true, 
            'message' => '提領申請已送出，預計 3-5 個工作天處理完成',
            'withdrawal_id' => $withdrawal->id
        ]);
    }
}
