<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class KieAIService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.kie.key');
    }

    public function createVideoTask(string $prompt, ?string $model = null)
    {
        $user = auth()->user();
        $apiKey = ($user->video_model_provider === 'kie' && $user->user_kie_api_key) 
            ? $user->user_kie_api_key 
            : $this->apiKey;

        $model = $model ?: ($user->video_model_id ?: (\App\Models\Setting::where('key', 'sora_model_id')->value('value') ?: 'sora-2-text-to-video'));
        
        $response = Http::withToken($apiKey)
            ->post('https://api.kie.ai/api/v1/jobs/createTask', [
                'model' => $model,
                'input' => [
                    'prompt' => $prompt,
                    'aspect_ratio' => 'portrait',
                    'n_frames' => '15',
                    'remove_watermark' => true
                ]
            ]);

        if ($response->failed() || ($response->json()['code'] ?? 0) !== 200) {
            throw new \Exception('Kie AI Error: ' . ($response->json()['message'] ?? 'Unknown error'));
        }

        return $response->json()['data']['taskId'];
    }

    public function getTaskStatus(string $taskId)
    {
        $user = auth()->user();
        $apiKey = ($user->video_model_provider === 'kie' && $user->user_kie_api_key) 
            ? $user->user_kie_api_key 
            : $this->apiKey;

        $response = Http::withToken($apiKey)
            ->get("https://api.kie.ai/api/v1/jobs/recordInfo?taskId={$taskId}");

        if ($response->failed() || ($response->json()['code'] ?? 0) !== 200) {
            throw new \Exception('Kie AI Status Error: ' . ($response->json()['message'] ?? 'Unknown error'));
        }

        $data = $response->json()['data'];
        $videoUrl = null;

        if ($data['state'] === 'success') {
            $result = json_decode($data['resultJson'], true);
            $videoUrl = $result['resultUrls'][0] ?? null;
        }

        return [
            'state' => $data['state'],
            'progress' => $data['progress'],
            'video_url' => $videoUrl,
            'fail_msg' => $data['failMsg'] ?? null
        ];
    }
}
