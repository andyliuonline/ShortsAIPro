import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react";
import { Zap, Search, Play, Upload, TrendingUp, Loader2, Sparkles, X, CheckCircle2, AlertCircle, Youtube, History, Clock, FileVideo, CreditCard } from "lucide-react";
import axios from "axios";
import Pricing from "@/Components/Pricing";

export default function Dashboard() {
    const { auth, hasYouTube } = usePage<any>().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Remake State
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [remakePlan, setRemakePlan] = useState<any>(null);
    const [analyzing, setAnalyzing] = useState(false);
    
    // Generation State
    const [generating, setGenerating] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [taskStatus, setTaskStatus] = useState<any>(null);
    
    // History State
    const [history, setHistory] = useState<any[]>([]);
    const [view, setView] = useState<'search' | 'history' | 'pricing'>('search');

    // Publishing State
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    // Initial Fetch
    useEffect(() => {
        fetchHistory();
    }, []);

    // Status Polling
    useEffect(() => {
        let interval: any;
        if (currentTaskId && generating) {
            interval = setInterval(async () => {
                try {
                    const res = await axios.get(`/api/generate/status?taskId=${currentTaskId}`);
                    setTaskStatus(res.data);
                    if (res.data.state === 'success' || res.data.state === 'fail') {
                        setGenerating(false);
                        fetchHistory();
                        clearInterval(interval);
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [currentTaskId, generating]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/history');
            setHistory(res.data.tasks || []);
        } catch (err) {
            console.error("Failed to fetch history");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const res = await axios.get(`/api/discovery?q=${encodeURIComponent(searchQuery)}`);
            setVideos(res.data.videos || []);
        } catch (err: any) {
            console.error("Search failed:", err);
            alert(`搜尋失敗: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const startAnalysis = async (video: any) => {
        setSelectedVideo(video);
        setAnalyzing(true);
        setRemakePlan(null);
        setTaskStatus(null);
        setPublished(false);
        setCurrentTaskId(null);
        
        try {
            const res = await axios.post('/api/remake', { videoId: video.id });
            if (res.data.success) {
                setRemakePlan(res.data.plan);
            } else {
                throw new Error(res.data.error || "分析失敗");
            }
        } catch (err: any) {
            alert(`AI 分析失敗: ${err.response?.data?.error || err.message}`);
            setSelectedVideo(null);
        } finally {
            setAnalyzing(false);
        }
    };

    const startGeneration = async () => {
        if (!remakePlan) return;
        setGenerating(true);
        try {
            const res = await axios.post('/api/generate', { 
                prompt: remakePlan.visualPrompt,
                plan: remakePlan,
                selectedVideo: selectedVideo
            });
            if (res.data.success) {
                setCurrentTaskId(res.data.taskId);
            } else {
                throw new Error(res.data.error || "生成請求失敗");
            }
        } catch (err: any) {
            alert(`啟動生成失敗: ${err.response?.data?.error || err.message}`);
            setGenerating(false);
        }
    };

    const handlePublish = async () => {
        if (!hasYouTube) {
            if (confirm("尚未連接 YouTube 頻道，現在前往授權？")) {
                window.location.href = route('auth.google.redirect');
            }
            return;
        }

        setPublishing(true);
        try {
            const res = await axios.post('/api/publish', {
                videoUrl: taskStatus.video_url,
                plan: remakePlan,
                taskId: currentTaskId
            });
            if (res.data.success) {
                setPublished(true);
                alert("🎉 影片已成功發布至您的 YouTube 頻道！");
                fetchHistory();
            }
        } catch (err: any) {
            alert(`發布失敗: ${err.response?.data?.error || err.message}`);
        } finally {
            setPublishing(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        百萬短影音大軍 Dashboard
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                            <button 
                                onClick={() => setView('search')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'search' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                搜尋影片
                            </button>
                            <button 
                                onClick={() => setView('history')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'history' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                製作歷史
                            </button>
                            <button 
                                onClick={() => setView('pricing')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'pricing' ? 'bg-yellow-400 text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                升級方案
                            </button>
                        </div>
                        
                        {!hasYouTube && (
                            <a 
                                href={route('auth.google.redirect')}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                                <Youtube size={18} /> 連結 YouTube
                            </a>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* User Status Bar */}
                    <div className="mb-8 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                                <Zap size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">目前方案</p>
                                <p className="text-sm font-bold text-white uppercase">{auth.user.plan || 'Free'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">剩餘點數</p>
                                <p className="text-sm font-bold text-yellow-400">{auth.user.credits || 0} 片</p>
                            </div>
                            <button 
                                onClick={() => setView('pricing')}
                                className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-300"
                            >
                                儲值點數
                            </button>
                        </div>
                    </div>

                    {view === 'history' ? (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2"><Clock /> 您的 AI 創作歷史</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {history.length > 0 ? history.map((item: any) => (
                                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                item.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                                item.status === 'fail' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {item.status} {item.status === 'running' && `(${item.progress}%)`}
                                            </span>
                                            <span className="text-[10px] text-zinc-500">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="font-bold text-white text-sm line-clamp-1 mb-2">{item.optimized_title || item.original_title}</h4>
                                        {item.video_url ? (
                                            <video src={item.video_url} className="w-full aspect-[9/16] object-cover rounded-lg bg-black" />
                                        ) : (
                                            <div className="w-full aspect-[9/16] bg-zinc-800 flex items-center justify-center rounded-lg text-zinc-500">
                                                <FileVideo size={48} />
                                            </div>
                                        )}
                                        <div className="mt-4 flex gap-2">
                                            {item.video_url && (
                                                <a href={item.video_url} download className="flex-1 bg-zinc-800 text-center py-2 rounded-lg text-xs font-bold hover:bg-zinc-700 transition-all text-white">下載影片</a>
                                            )}
                                            {item.youtube_url && (
                                                <a href={item.youtube_url} target="_blank" className="bg-red-600/20 text-red-400 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1"><Youtube size={14}/> 已上傳</a>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-zinc-500 col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">尚未有製作紀錄，快去搜尋影片吧！</p>
                                )}
                            </div>
                        </div>
                    ) : view === 'pricing' ? (
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <h3 className="text-3xl font-black text-white mb-4">選擇適合您的規模</h3>
                                <p className="text-zinc-500">升級方案以解鎖更多影片生成額度與 AI 高級功能</p>
                            </div>
                            <Pricing />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {/* Search Bar */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <div className="relative w-full max-w-xl">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search className="text-zinc-500" size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        placeholder="輸入關鍵字搜尋爆紅影片 (例如: 料理, 健身, 搞笑)" 
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-4 pl-10 pr-4 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all outline-none"
                                    />
                                </div>
                                <button 
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>開始探索 <Play size={18} /></>}
                                </button>
                            </div>

                            {/* Discovery Results */}
                            {videos.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                                    {videos.map((video) => (
                                        <div key={video.id} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all">
                                            <div className="relative aspect-[9/16] bg-zinc-800">
                                                <img 
                                                    src={video.thumbnail} 
                                                    alt={video.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                    <button 
                                                        onClick={() => startAnalysis(video)}
                                                        className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold text-sm shadow-xl cursor-pointer"
                                                    >
                                                        一鍵重製此影片
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-sm text-zinc-100 line-clamp-2 mb-1">{video.title}</h4>
                                                <p className="text-zinc-500 text-xs">{video.channelTitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Remake Modal */}
            {(selectedVideo || analyzing) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-white text-left">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !analyzing && !generating && !publishing && setSelectedVideo(null)}></div>
                    <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-yellow-400" size={20} />
                                <h3 className="text-xl font-bold text-white">AI 重製計畫</h3>
                            </div>
                            <button onClick={() => setSelectedVideo(null)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {analyzing ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="animate-spin text-yellow-400" size={48} />
                                    <p className="text-zinc-400 animate-pulse">Gemini 正在深度分析影片爆紅基因...</p>
                                </div>
                            ) : remakePlan ? (
                                <div className="space-y-6 text-left">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="aspect-[9/16] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 relative">
                                            <img src={selectedVideo.thumbnail} className="w-full h-full object-cover" alt="Original" />
                                            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white">原片原型</div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">優化標題</label>
                                                <p className="text-lg font-bold text-yellow-400">{remakePlan.optimizedTitle}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">爆紅 Hook</label>
                                                <p className="text-sm text-zinc-300 leading-relaxed">{remakePlan.viralHook}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                                                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">AI 視覺 Prompt</label>
                                                <p className="text-xs text-zinc-400 mt-1 italic">"{remakePlan.visualPrompt}"</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-800">
                                        {generating ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="flex items-center gap-2"><Loader2 className="animate-spin text-yellow-400" size={16} /> Sora 2 正在生成影片...</span>
                                                    <span className="text-yellow-400 font-bold">{taskStatus?.progress || 0}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${taskStatus?.progress || 0}%` }}></div>
                                                </div>
                                            </div>
                                        ) : taskStatus?.state === 'success' ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-green-400">
                                                    <CheckCircle2 size={20} />
                                                    <span className="font-bold">生成完成！</span>
                                                </div>
                                                <video src={taskStatus.video_url} controls className="w-full rounded-xl border border-zinc-800 shadow-xl" />
                                                <div className="flex gap-4">
                                                    <button 
                                                        onClick={handlePublish}
                                                        disabled={publishing || published}
                                                        className="flex-1 bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {publishing ? <Loader2 className="animate-spin" size={18} /> : published ? <CheckCircle2 size={18} /> : <Upload size={18} />}
                                                        {published ? "已發布至 YouTube" : "一鍵發布至 YouTube"}
                                                    </button>
                                                    <a href={taskStatus.video_url} download className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                                        <Play size={20} className="rotate-90 text-white" />
                                                    </a>
                                                </div>
                                            </div>
                                        ) : taskStatus?.state === 'fail' ? (
                                            <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 flex items-start gap-3 text-left">
                                                <AlertCircle className="shrink-0" size={20} />
                                                <div>
                                                    <p className="font-bold text-sm">生成失敗</p>
                                                    <p className="text-xs opacity-80">{taskStatus.fail_msg}</p>
                                                    <button onClick={startGeneration} className="mt-2 text-xs underline font-bold">重試</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={startGeneration}
                                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-xl font-black text-lg shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                            >
                                                立即啟動 AI 高清重製 <Sparkles size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
