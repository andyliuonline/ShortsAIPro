<?php

namespace App\Http\Controllers;

use App\Models\ReferralCommission;
use App\Models\Subscription;
use App\Services\NewebPayService;
use App\Services\GivemeInvoiceService;
use App\Services\GamificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function checkout(Request $request, NewebPayService $newebpay)
    {
        $plan = $request->input('plan'); // basic, standard, pro, flagship
        $prices = [
            'basic' => 299,
            'standard' => 449,
            'pro' => 769,
            'flagship' => 1049,
        ];

        if (!isset($prices[$plan])) {
            return back()->with('error', '無效的方案');
        }

        // Verify user has enough credits for the plan
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')->with('error', '請先登入');
        }

        $amt = $prices[$plan];
        $orderNo = 'ORD' . time() . $user->id;
        
        // Create pending subscription with payment amount for verification
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $plan,
            'merchant_order_no' => $orderNo,
            'amt' => $amt,
            'status' => 'pending',
        ]);

        Log::info('Payment checkout initiated', [
            'user_id' => $user->id,
            'plan' => $plan,
            'order_no' => $orderNo,
            'amt' => $amt,
        ]);

        $paymentData = $newebpay->generateOrderData($amt, "ShortsRemaker Pro - " . ucfirst($plan), $user->email, $orderNo);

        return response()->json($paymentData);
    }

    public function callback(Request $request, NewebPayService $newebpay)
    {
        $status = $request->input('Status');
        
        Log::info('Payment callback received', [
            'status' => $status,
            'merchant_order_no' => $request->input('MerchantOrderNo'),
        ]);

        if ($status !== 'SUCCESS') {
            Log::warning('Payment failed', ['status' => $status]);
            return redirect()->route('dashboard')->with('error', '支付失敗，請重試');
        }

        // Don't process payment here - only redirect user
        // Actual processing happens in notify() which is more secure
        return redirect()->route('dashboard')->with('status', '支付處理中，請稍候...');
    }

    public function notify(Request $request, NewebPayService $newebpay, GivemeInvoiceService $invoiceService, GamificationService $gamification)
    {
        $tradeInfo = $request->input('TradeInfo');
        
        // Verify the notification is from NewebPay
        if (!$tradeInfo) {
            Log::error('Payment notify: Missing TradeInfo');
            return response('Invalid Request', 400);
        }

        $decodedData = $newebpay->decrypt($tradeInfo);
        
        Log::info('Payment notify processed', [
            'status' => $decodedData['Status'] ?? 'unknown',
            'message' => $decodedData['Message'] ?? '',
            'merchant_order_no' => $decodedData['Result']['MerchantOrderNo'] ?? '',
        ]);

        if (($decodedData['Status'] ?? '') !== 'SUCCESS') {
            Log::warning('Payment notify failed', ['decoded' => $decodedData]);
            return response('FAIL', 400);
        }

        $orderNo = $decodedData['Result']['MerchantOrderNo'] ?? null;
        $tradeNo = $decodedData['Result']['TradeNo'] ?? null;
        $payAmt = $decodedData['Result']['Amt'] ?? null;

        if (!$orderNo) {
            Log::error('Payment notify: Missing order number');
            return response('Missing Order No', 400);
        }

        // Find the subscription order
        $sub = Subscription::where('merchant_order_no', $orderNo)->first();
        
        if (!$sub) {
            Log::error('Payment notify: Order not found', ['order_no' => $orderNo]);
            return response('Order Not Found', 404);
        }

        // Prevent duplicate processing
        if ($sub->status === 'paid') {
            Log::info('Payment notify: Order already processed', ['order_no' => $orderNo]);
            return response('OK');
        }

        // Verify payment amount matches
        if ($payAmt != $sub->amt) {
            Log::error('Payment notify: Amount mismatch', [
                'expected' => $sub->amt,
                'received' => $payAmt,
            ]);
            return response('Amount Mismatch', 400);
        }

        // Process the payment
        try {
            $sub->update([
                'status' => 'paid',
                'trade_no' => $tradeNo,
                'paid_at' => now(),
                'payment_type' => $decodedData['Result']['PaymentType'] ?? null,
            ]);

            // Update User Plan & Credits
            $user = $sub->user;
            $credits = [
                'basic' => 300,
                'standard' => 600,
                'pro' => 1500,
                'flagship' => 9999, // 無限制
            ];

            $user->update([
                'plan' => $sub->plan,
                'credits' => $credits[$sub->plan] ?? 0,
                'credits_reset_at' => now()->addMonth(),
            ]);

            // Gamification: Award XP for purchase
            $xpAmount = match($sub->plan) {
                'basic' => 300,
                'standard' => 600,
                'pro' => 1200,
                'flagship' => 2000,
                default => 0
            };
            $gamification->awardXp($user, $xpAmount, "Purchase " . ucfirst($sub->plan) . " Plan");

            // Award achievement for first purchase
            $gamification->awardAchievement($user, 'first_purchase', '首次訂閱', '感謝您成為 ShortsAIPro 的會員！');

            // Handle Referral Commission
            if ($user->referred_by) {
                $commissionRate = 0.20; // 20%
                ReferralCommission::create([
                    'referrer_id' => $user->referred_by,
                    'referred_user_id' => $user->id,
                    'subscription_id' => $sub->id,
                    'amount' => $sub->amt * $commissionRate,
                    'status' => 'pending',
                ]);
                
                Log::info('Referral commission created', [
                    'referrer_id' => $user->referred_by,
                    'amount' => $sub->amt * $commissionRate,
                ]);
            }

            // Issue Invoice via Giveme
            try {
                $invoiceResult = $invoiceService->issueInvoice([
                    'order_no' => $orderNo,
                    'amt' => $sub->amt,
                    'item_name' => "ShortsRemaker Pro - " . ucfirst($sub->plan),
                    'email' => $user->email,
                ]);
                
                if (isset($invoiceResult['InvoiceNo'])) {
                    $sub->update(['invoice_no' => $invoiceResult['InvoiceNo']]);
                    Log::info('Invoice issued', ['invoice_no' => $invoiceResult['InvoiceNo']]);
                }
            } catch (\Exception $e) {
                Log::error("Giveme Invoice Error: " . $e->getMessage());
            }

            Log::info('Payment processed successfully', ['order_no' => $orderNo]);

        } catch (\Exception $e) {
            Log::error('Payment processing error: ' . $e->getMessage());
            return response('Processing Error', 500);
        }

        return response('OK');
    }
}
