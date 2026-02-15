<?php

namespace App\Services;

use App\Models\Setting;

class NewebPayService
{
    protected string $merchantId;
    protected string $hashKey;
    protected string $hashIv;
    protected bool $isProduction;

    public function __construct()
    {
        $this->merchantId = Setting::where('key', 'newebpay_merchant_id')->value('value') ?: config('services.newebpay.merchant_id');
        $this->hashKey = Setting::where('key', 'newebpay_hash_key')->value('value') ?: config('services.newebpay.hash_key');
        $this->hashIv = Setting::where('key', 'newebpay_hash_iv')->value('value') ?: config('services.newebpay.hash_iv');
        $this->isProduction = config('services.newebpay.is_production');
    }

    public function generateOrderData(int $amt, string $itemDesc, string $email, string $orderNo)
    {
        $data = [
            'MerchantID' => $this->merchantId,
            'RespondType' => 'JSON',
            'TimeStamp' => time(),
            'Version' => '2.0',
            'MerchantOrderNo' => $orderNo,
            'Amt' => $amt,
            'ItemDesc' => $itemDesc,
            'Email' => $email,
            'LoginType' => 0,
            'ReturnURL' => route('payment.callback'),
            'NotifyURL' => route('payment.notify'),
            'ClientBackURL' => route('dashboard'),
        ];

        $edata = $this->encrypt($data);
        $hash = $this->hash($edata);

        return [
            'MerchantID' => $this->merchantId,
            'TradeInfo' => $edata,
            'TradeSha' => $hash,
            'Version' => '2.0',
            'ActionUrl' => $this->isProduction 
                ? 'https://core.newebpay.com/MPG/mpg_gateway' 
                : 'https://ccore.newebpay.com/MPG/mpg_gateway',
        ];
    }

    protected function encrypt(array $data): string
    {
        $queryString = http_build_query($data);
        $padded = $this->addPadding($queryString);
        return bin2hex(openssl_encrypt($padded, 'AES-256-CBC', $this->hashKey, OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING, $this->hashIv));
    }

    protected function hash(string $edata): string
    {
        $string = "HashKey={$this->hashKey}&{$edata}&HashIV={$this->hashIv}";
        return strtoupper(hash("sha256", $string));
    }

    protected function addPadding(string $string, int $blocksize = 32): string
    {
        $len = strlen($string);
        $pad = $blocksize - ($len % $blocksize);
        return $string . str_repeat(chr($pad), $pad);
    }

    public function decrypt(string $edata): array
    {
        $decrypted = openssl_decrypt(hex2bin($edata), 'AES-256-CBC', $this->hashKey, OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING, $this->hashIv);
        $unpadded = $this->stripPadding($decrypted);
        return json_decode($unpadded, true);
    }

    protected function stripPadding(string $string): string
    {
        $slast = ord(substr($string, -1));
        $slastc = chr($slast);
        if (preg_match("/$slastc{" . $slast . "}$/", $string)) {
            return substr($string, 0, strlen($string) - $slast);
        }
        return $string;
    }
}
