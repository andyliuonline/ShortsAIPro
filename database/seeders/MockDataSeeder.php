<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\RemakeTask;
use App\Models\Subscription;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MockDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. 建立 Andy 的管理員帳號 (如果不存在)
        $admin = User::updateOrCreate(
            ['email' => 'andyliu.online@gmail.com'],
            [
                'name' => 'Andy Liu',
                'password' => Hash::make('password'),
                'is_admin' => true,
                'plan' => 'flagship',
                'credits' => 99999,
            ]
        );

        // 2. 模擬多位不同等級的客戶
        $plans = ['free', 'basic', 'standard', 'pro', 'flagship'];
        $customerNames = [
            ['First Name' => '王', 'Last Name' => '大明'],
            ['First Name' => '李', 'Last Name' => '小華'],
            ['First Name' => '張', 'Last Name' => '三'],
            ['First Name' => '趙', 'Last Name' => '六'],
            ['First Name' => '陳', 'Last Name' => '美麗'],
            ['First Name' => 'Sarah', 'Last Name' => 'Chen'],
            ['First Name' => 'Kevin', 'Last Name' => 'Wang'],
            ['First Name' => 'Emily', 'Last Name' => 'Huang'],
            ['First Name' => 'Jason', 'Last Name' => 'Lin'],
            ['First Name' => 'Angela', 'Last Name' => 'Yeh'],
        ];

        foreach ($customerNames as $index => $nameData) {
            $plan = $plans[$index % count($plans)];
            $user = User::updateOrCreate(
                ['email' => "user" . ($index + 1) . "@example.com"],
                [
                    'name' => $nameData['First Name'] . $nameData['Last Name'],
                    'password' => Hash::make('password'),
                    'is_admin' => false,
                    'plan' => $plan,
                    'credits' => $this->getCreditsByPlan($plan),
                    'created_at' => Carbon::now()->subDays(rand(1, 30)),
                ]
            );

            // 3. 為每位使用者模擬一些生成任務
            $this->createMockTasks($user);
            
            // 4. 為付費使用者模擬訂閱紀錄
            if ($plan !== 'free') {
                $this->createMockSubscription($user, $plan);
            }
        }
    }

    private function getCreditsByPlan($plan)
    {
        return match ($plan) {
            'free' => rand(0, 10),
            'basic' => rand(50, 300),
            'standard' => rand(200, 600),
            'pro' => rand(500, 1500),
            'flagship' => rand(1000, 5000),
            default => 0,
        };
    }

    private function createMockTasks($user)
    {
        $taskCount = rand(2, 10);
        for ($i = 0; $i < $taskCount; $i++) {
            RemakeTask::create([
                'user_id' => $user->id,
                'original_video_id' => 'yt_' . uniqid(),
                'original_title' => '原片標題 - ' . rand(100, 999),
                'task_id' => 'kie_' . uniqid(),
                'status' => rand(0, 10) > 2 ? 'success' : 'fail',
                'progress' => 100,
                'model_used' => 'sora-2',
                'visual_prompt' => 'A Cinematic drone shot of a futuristic city with glowing neon lights, 8k resolution.',
                'optimized_title' => '重製版標題 - ' . rand(100, 999),
                'video_url' => 'https://example.com/mock-video-' . $i . '.mp4',
                'created_at' => Carbon::now()->subHours(rand(1, 720)),
            ]);
        }
    }

    private function createMockSubscription($user, $plan)
    {
        $prices = [
            'basic' => 29,
            'standard' => 59,
            'pro' => 99,
            'flagship' => 199,
        ];

        Subscription::create([
            'user_id' => $user->id,
            'plan' => $plan,
            'merchant_order_no' => 'MOCK_' . uniqid(),
            'trade_no' => 'TXN_' . uniqid(),
            'amt' => $prices[$plan] ?? 0,
            'payment_type' => 'CREDIT',
            'status' => 'paid',
            'paid_at' => Carbon::now()->subDays(rand(1, 20)),
        ]);
    }
}
