<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WithdrawalRequest;
use App\Models\ReferralCommission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WithdrawalController extends Controller
{
    /**
     * Display a list of withdrawal requests
     */
    public function index(Request $request)
    {
        $query = WithdrawalRequest::with('user:id,name,email')
            ->orderBy('created_at', 'desc');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $withdrawals = $query->paginate(20);

        return response()->json($withdrawals);
    }

    /**
     * Approve a withdrawal request
     */
    public function approve(Request $request, int $id)
    {
        $withdrawal = WithdrawalRequest::findOrFail($id);

        if ($withdrawal->status !== 'pending') {
            return response()->json(['error' => '此申請狀態無法批准'], 400);
        }

        $withdrawal->update([
            'status' => 'completed',
            'admin_note' => $request->input('note', '已批准'),
            'processed_at' => now(),
        ]);

        // Mark associated commissions as completed
        ReferralCommission::where('referrer_id', $withdrawal->user_id)
            ->where('status', 'processing')
            ->update(['status' => 'completed']);

        Log::info('Withdrawal approved', [
            'withdrawal_id' => $id,
            'amount' => $withdrawal->amount,
            'user_id' => $withdrawal->user_id,
        ]);

        return response()->json(['success' => true, 'message' => '提領已批准']);
    }

    /**
     * Reject a withdrawal request
     */
    public function reject(Request $request, int $id)
    {
        $withdrawal = WithdrawalRequest::findOrFail($id);

        if ($withdrawal->status !== 'pending') {
            return response()->json(['error' => '此申請狀態無法拒絕'], 400);
        }

        $withdrawal->update([
            'status' => 'rejected',
            'admin_note' => $request->input('note', '已被拒絕'),
            'processed_at' => now(),
        ]);

        // Restore commissions to available status
        ReferralCommission::where('referrer_id', $withdrawal->user_id)
            ->where('status', 'processing')
            ->update(['status' => 'available']);

        Log::info('Withdrawal rejected', [
            'withdrawal_id' => $id,
            'amount' => $withdrawal->amount,
            'user_id' => $withdrawal->user_id,
        ]);

        return response()->json(['success' => true, 'message' => '提領已拒絕']);
    }
}
