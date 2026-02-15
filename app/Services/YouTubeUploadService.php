<?php

namespace App\Services;

use App\Models\User;
use App\Models\RemakeTask;
use Google\Client;
use Google\Service\YouTube;
use Google\Service\YouTube\Video;
use Google\Service\YouTube\VideoSnippet;
use Google\Service\YouTube\VideoStatus;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class YouTubeUploadService
{
    public function upload(User $user, string $videoUrl, array $metadata, ?string $taskId = null)
    {
        $client = new Client();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        
        $accessToken = [
            'access_token' => $user->google_token,
            'refresh_token' => $user->google_refresh_token,
            'expires_in' => $user->google_token_expires_at ? $user->google_token_expires_at->diffInSeconds(now()) : 3600,
        ];
        
        $client->setAccessToken($accessToken);

        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($user->google_refresh_token);
            $newTokens = $client->getAccessToken();
            $user->update([
                'google_token' => $newTokens['access_token'],
                'google_token_expires_at' => now()->addSeconds($newTokens['expires_in']),
            ]);
        }

        $youtube = new YouTube($client);

        // Download video
        $videoData = Http::get($videoUrl)->body();
        $tempPath = 'temp/video_' . time() . '.mp4';
        Storage::disk('local')->put($tempPath, $videoData);
        $fullPath = storage_path('app/private/' . $tempPath);

        $video = new Video();
        $snippet = new VideoSnippet();
        $snippet->setTitle($metadata['title'] ?? 'AI Generated Short');
        $snippet->setDescription($metadata['description'] ?? '');
        $snippet->setTags($metadata['tags'] ?? ['#shorts', '#ai']);
        $snippet->setCategoryId("22");
        
        $status = new VideoStatus();
        $status->setPrivacyStatus('public');
        $status->setSelfDeclaredMadeForKids(false);

        $video->setSnippet($snippet);
        $video->setStatus($status);

        $chunkSizeBytes = 1 * 1024 * 1024;
        $client->setDefer(true);
        $insertRequest = $youtube->videos->insert('status,snippet', $video);
        
        $media = new \Google\Http\MediaFileUpload(
            $client,
            $insertRequest,
            'video/*',
            null,
            true,
            $chunkSizeBytes
        );
        $media->setFileSize(filesize($fullPath));

        $uploadStatus = false;
        $handle = fopen($fullPath, "rb");
        while (!$uploadStatus && !feof($handle)) {
            $chunk = fread($handle, $chunkSizeBytes);
            $uploadStatus = $media->nextChunk($chunk);
        }
        fclose($handle);
        $client->setDefer(false);

        Storage::disk('local')->delete($tempPath);

        // 如果上傳成功且有 taskId，更新資料庫
        if ($uploadStatus && isset($uploadStatus['id']) && $taskId) {
            $youtubeUrl = "https://youtube.com/shorts/" . $uploadStatus['id'];
            RemakeTask::where('task_id', $taskId)->update([
                'youtube_url' => $youtubeUrl,
                'published_at' => now(),
            ]);
        }

        return $uploadStatus;
    }
}
