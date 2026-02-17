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
        $prompt = "
            You are an expert viral short video creator. 
            I will give you details of a trending YouTube Short. 
            Your goal is to create a 'Remake Plan' that will perform even better.

            Original Video Info:
            Title: {$context['title']}
            Description: " . ($context['description'] ?? '') . "

            Please provide a JSON response with the following fields:
            1. 'visualPrompt': A highly detailed 3-4 sentence prompt for an AI video generator (Sora/Kling). It should describe the scene, lighting, camera movement, and action. Do not mention copyright characters. Focus on visual impact and high quality.
            2. 'optimizedTitle': A viral, high-CTR title (Chinese).
            3. 'seoDescription': A short, SEO-optimized description with hashtags (Chinese).
            4. 'viralHook': Why this video will go viral (analysis).

            Format: Strictly JSON.
        ";

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
        
        // Clean up markdown code blocks if any
        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            return json_decode($matches[0], true);
        }

        return null;
    }
}
