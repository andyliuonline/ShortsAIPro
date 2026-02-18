<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MiniMaxService
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = config('services.minimax.key');
        $this->model = config('services.minimax.model', 'MiniMax-M2.1');
    }

    public function analyzeVideo(array $context)
    {
        $user = auth()->user();
        $provider = $user->analysis_model_provider ?? 'minimax';
        $targetLang = ($context['locale'] ?? 'zh_TW') === 'zh_TW' ? 'Traditional Chinese (繁體中文)' : 'English';

        $prompt = "
            You are an expert viral short video creator. 
            I will give you details of a trending YouTube Short. 
            Your goal is to create a 'Remake Plan' that will perform even better.

            Original Video Info:
            Title: {$context['title']}
            Description: " . ($context['description'] ?? '') . "

            Please provide the response in {$targetLang}.
            Please provide a JSON response with the following fields:
            1. 'visualPrompt': A highly detailed 3-4 sentence prompt for an AI video generator (Sora/Kling). It should describe the scene, lighting, camera movement, and action. Do not mention copyright characters. Focus on visual impact and high quality. (Write this in English even if other fields are in Chinese).
            2. 'optimizedTitle': A viral, high-CTR title in {$targetLang}.
            3. 'seoDescription': A short, SEO-optimized description with hashtags in {$targetLang}.
            4. 'viralHook': Why this video will go viral (detailed analysis in {$targetLang}).

            Format: Strictly JSON.
        ";

        if ($provider === 'openai' && $user->user_openai_api_key) {
            return $this->callOpenAI($prompt, $user->user_openai_api_key);
        }

        if ($provider === 'anthropic' && $user->user_anthropic_api_key) {
            return $this->callAnthropic($prompt, $user->user_anthropic_api_key);
        }

        // Default to MiniMax (System Key)
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post("https://api.minimaxi.com/v1/text/chatcompletion_v2", [
            'model' => $this->model,
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a professional video content analyst. Always respond in valid JSON format.',
                ],
                [
                    'role' => 'user',
                    'content' => $prompt,
                ],
            ],
        ]);

        if ($response->failed()) {
            throw new \Exception('MiniMax API Error: ' . ($response->json()['base_resp']['status_msg'] ?? 'Unknown error'));
        }

        $text = $response->json()['choices'][0]['message']['content'] ?? '';
        return $this->parseJsonResponse($text);
    }

    protected function callOpenAI($prompt, $key)
    {
        $response = Http::withToken($key)->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o',
            'messages' => [['role' => 'user', 'content' => $prompt]],
            'response_format' => ['type' => 'json_object']
        ]);
        return $response->json()['choices'][0]['message']['content'] ? json_decode($response->json()['choices'][0]['message']['content'], true) : null;
    }

    protected function callAnthropic($prompt, $key)
    {
        $response = Http::withHeaders(['x-api-key' => $key, 'anthropic-version' => '2023-06-01'])->post('https://api.anthropic.com/v1/messages', [
            'model' => 'claude-3-5-sonnet-20240620',
            'max_tokens' => 4096,
            'messages' => [['role' => 'user', 'content' => $prompt . " \n\n IMPORTANT: Output ONLY raw JSON."]]
        ]);
        $text = $response->json()['content'][0]['text'] ?? '';
        return $this->parseJsonResponse($text);
    }

    protected function parseJsonResponse($text)
    {
        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return json_decode($matches[0], true);
        }
        return null;
    }
}
