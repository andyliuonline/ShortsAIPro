<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class YouTubeService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.youtube.key');
    }

    public function searchShorts(string $query, int $maxResults = 12)
    {
        $response = Http::get('https://www.googleapis.com/youtube/v3/search', [
            'key' => $this->apiKey,
            'part' => 'snippet',
            'q' => $query . ' #shorts',
            'type' => 'video',
            'videoDuration' => 'short',
            'maxResults' => $maxResults,
            'relevanceLanguage' => 'zh-Hant',
            'order' => 'relevance',
        ]);

        if ($response->failed()) {
            throw new \Exception('YouTube API Error: ' . ($response->json()['error']['message'] ?? 'Unknown error'));
        }

        return collect($response->json()['items'] ?? [])->map(fn($item) => [
            'id' => $item['id']['videoId'],
            'title' => $item['snippet']['title'],
            'thumbnail' => $item['snippet']['thumbnails']['high']['url'] ?? $item['snippet']['thumbnails']['default']['url'],
            'channelTitle' => $item['snippet']['channelTitle'],
            'publishedAt' => $item['snippet']['publishedAt'],
        ]);
    }

    public function getVideoDetails(string $videoId)
    {
        $response = Http::get('https://www.googleapis.com/youtube/v3/videos', [
            'key' => $this->apiKey,
            'part' => 'snippet,statistics',
            'id' => $videoId,
        ]);

        return $response->json()['items'][0] ?? null;
    }
}
