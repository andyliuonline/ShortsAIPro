<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Setting;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create initial admin
        User::updateOrCreate([
            'email' => 'admin@shortsremaker.pro',
        ], [
            'name' => 'Super Admin',
            'password' => bcrypt('admin123456'),
            'is_admin' => true,
            'plan' => 'flagship',
            'credits' => 9999,
        ]);

        // Default Settings
        $defaultSettings = [
            ['key' => 'newebpay_merchant_id', 'value' => '', 'group' => 'payment', 'description' => '藍新商號 ID'],
            ['key' => 'newebpay_hash_key', 'value' => '', 'group' => 'payment', 'description' => '藍新 Hash Key'],
            ['key' => 'newebpay_hash_iv', 'value' => '', 'group' => 'payment', 'description' => '藍新 Hash IV'],
            ['key' => 'giveme_merchant_id', 'value' => '', 'group' => 'invoice', 'description' => 'Giveme 商店編號'],
            ['key' => 'giveme_api_key', 'value' => '', 'group' => 'invoice', 'description' => 'Giveme API Key'],
            ['key' => 'sora_model_id', 'value' => 'sora-2-text-to-video', 'group' => 'ai', 'description' => 'AI 影片生成模型 ID'],
        ];

        foreach ($defaultSettings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }
    }
}
