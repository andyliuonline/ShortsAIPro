<?php

namespace App\Http\Controllers;

use App\Services\YouTubeService;
use App\Services\MiniMaxService;
use App\Services\KieAIService;
use App\Services\YouTubeUploadService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscoveryController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'hasYouTube' => (bool) auth()->user()->google_refresh_token,
        ]);
    }

    public function search(Request $request, YouTubeService $youtube)
    {
        $query = $request->query('q', 'trending shorts');
        $order = $request->query('order', 'viewCount');
        $language = $request->query('language', 'zh-Hant');
        
        $videos = $youtube->searchShorts($query, 12, $order, $language);
        
        return response()->json(['videos' => $videos]);
    }

    public function remake(Request $request, YouTubeService $youtube, MiniMaxService $minimax)
    {
        $videoId = $request->input('videoId');
        $videoData = $youtube->getVideoDetails($videoId);

        if (!$videoData) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $context = [
            'title' => $videoData['snippet']['title'],
            'description' => $videoData['snippet']['description'],
            'locale' => session('locale', 'zh_TW'),
        ];

        $plan = $minimax->analyzeVideo($context);

        return response()->json([
            'success' => true,
            'plan' => $plan,
            'originalVideo' => $context
        ]);
    }

    public function generate(Request $request, KieAIService $kie, \App\Services\GamificationService $gamification)
    {
        $prompt = $request->input('prompt');
        $plan = $request->input('plan');
        $video = $request->input('selectedVideo');
        
        $taskId = $kie->createVideoTask($prompt);

        // 持久化任務
        \App\Models\RemakeTask::create([
            'user_id' => auth()->id(),
            'original_video_id' => $video['id'] ?? null,
            'original_title' => $video['title'] ?? null,
            'task_id' => $taskId,
            'status' => 'pending',
            'visual_prompt' => $prompt,
            'optimized_title' => $plan['optimizedTitle'] ?? null,
            'seo_description' => $plan['seoDescription'] ?? null,
        ]);

        // Gamification: Award XP and update streak
        $user = auth()->user();
        $gamification->awardXp($user, 10, 'Generate Video');
        $gamification->updateStreak($user);

        return response()->json([
            'success' => true,
            'taskId' => $taskId
        ]);
    }

    public function status(Request $request, KieAIService $kie, \App\Services\GamificationService $gamification)
    {
        $taskId = $request->query('taskId');
        $status = $kie->getTaskStatus($taskId);

        // 同步狀態到資料庫
        $task = \App\Models\RemakeTask::where('task_id', $taskId)->first();
        if ($task) {
            $oldStatus = $task->status;
            $task->update([
                'status' => $status['state'],
                'progress' => $status['progress'],
                'video_url' => $status['video_url'],
            ]);

            if ($oldStatus !== 'success' && $status['state'] === 'success') {
                $gamification->checkVideoAchievements($task->user);
            }
        }

        return response()->json($status);
    }

    public function history()
    {
        $tasks = \App\Models\RemakeTask::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['tasks' => $tasks]);
    }

    public function publish(Request $request, YouTubeUploadService $publisher, \App\Services\GamificationService $gamification)
    {
        $videoUrl = $request->input('videoUrl');
        $metadata = $request->input('plan');
        $taskId = $request->input('taskId'); // 接收 taskId

        try {
            $publisher->upload(auth()->user(), $videoUrl, [
                'title' => $metadata['optimizedTitle'],
                'description' => $metadata['seoDescription'],
                'tags' => ['#shorts', '#ai', '#viral']
            ], $taskId);

            // Gamification: Award XP
            $gamification->awardXp(auth()->user(), 20, 'Publish to YouTube');

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
