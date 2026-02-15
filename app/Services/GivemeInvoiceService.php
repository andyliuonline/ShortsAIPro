<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;

class GivemeInvoiceService
{
    protected string $merchantId;
    protected string $apiKey;

    public function __construct()
    {
        $this->merchantId = Setting::where('key', 'giveme_merchant_id')->value('value') ?: config('services.giveme.merchant_id');
        $this->apiKey = Setting::where('key', 'giveme_api_key')->value('value') ?: config('services.giveme.api_key');
    }

    public function issueInvoice(array $data)
    {
        // 這是一個示意性的 API 呼叫，具體格式需參考 Giveme 的 API 文檔
        // 通常包含 Amt, ItemName, CustomerEmail 等
        $response = Http::post('https://www.giveme.com.tw/api/v1/invoice/issue', [
            'MerchantID' => $this->merchantId,
            'ApiKey' => $this->apiKey,
            'OrderNo' => $data['order_no'],
            'Amt' => $data['amt'],
            'ItemName' => $data['item_name'],
            'BuyerEmail' => $data['email'],
            // ... 其他必要欄位
        ]);

        return $response->json();
    }
}
