<?php

namespace App\Http\Controllers;

use App\Models\ReferralCommission;
use App\Models\Subscription;
use App\Services\NewebPayService;
use App\Services\GivemeInvoiceService;
use App\Services\GamificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        $amt = $prices[$plan];
        $orderNo = 'ORD' . time() . Auth::id();
        
        // Create pending subscription
        Subscription::create([
            'user_id' => Auth::id(),
            'plan' => $plan,
            'merchant_order_no' => $orderNo,
            'amt' => $amt,
            'status' => 'pending',
        ]);

        $paymentData = $newebpay->generateOrderData($amt, "ShortsRemaker Pro - " . ucfirst($plan), Auth::user()->email, $orderNo);

        return response()->json($paymentData);
    }

    public function callback(Request $request, NewebPayService $newebpay)
    {
        $status = $request->input('Status');
        $merchantID = $request->input('MerchantID');
        $tradeInfo = $request->input('TradeInfo');
        $tradeSha = $request->input('TradeSha');

        if ($status !== 'SUCCESS') {
            return redirect()->route('dashboard')->with('error', '支付失敗');
        }

        $decodedData = $newebpay->decrypt($tradeInfo);
        $orderNo = $decodedData['Result']['MerchantOrderNo'] ?? null;

        return redirect()->route('dashboard')->with('status', "訂單 {$orderNo} 支付處理中...");
    }

    public function notify(Request $request, NewebPayService $newebpay, GivemeInvoiceService $invoiceService, GamificationService $gamification)
    {
        $tradeInfo = $request->input('TradeInfo');
        $decodedData = $newebpay->decrypt($tradeInfo);
        
        if ($decodedData['Status'] === 'SUCCESS') {
            $orderNo = $decodedData['Result']['MerchantOrderNo'];
            $tradeNo = $decodedData['Result']['TradeNo'];
            
            $sub = Subscription::where('merchant_order_no', $orderNo)->first();
            if ($sub && $sub->status === 'pending') {
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
                    }
                } catch (\Exception $e) {
                    \Log::error("Giveme Invoice Error: " . $e->getMessage());
                }
            }
        }

        return response('OK');
    }
}
