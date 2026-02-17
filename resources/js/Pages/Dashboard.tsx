import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react";
import { Zap, Search, Play, Upload, TrendingUp, Loader2, Sparkles, X, CheckCircle2, AlertCircle, Youtube, History, Clock, FileVideo, CreditCard, Users, Gift, Share2, Wallet, Landmark, Trophy, Medal, Award, Filter, Globe, ChevronDown } from "lucide-react";
import axios from "axios";
import Pricing from "@/Components/Pricing";
import { useTranslate } from "@/Helpers/useTranslate";

export default function Dashboard() {
    const { auth, hasYouTube, locale } = usePage<any>().props;
    const { t } = useTranslate();
    const [searchQuery, setSearchQuery] = useState("");
    const [order, setOrder] = useState("relevance");
    const [language, setLanguage] = useState("zh-Hant");
    const [showFilters, setShowFilters] = useState(false);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Referral Data State
    const [referralData, setReferralData] = useState<any>({ referrals: [], commissions: [] });
    const [showBankForm, setShowBankForm] = useState(false);
    const [bankInfo, setBankInfo] = useState({
        bank_code: auth.user.bank_code || "",
        bank_account: auth.user.bank_account || "",
        bank_name: auth.user.bank_name || "",
    });

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
    const [view, setView] = useState<'search' | 'history' | 'pricing' | 'referral' | 'leaderboard'>('search');

    // Publishing State
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    // Gamification Data State
    const [gamificationData, setGamificationData] = useState<any>({ leaderboard: [], achievements: [], stats: {} });

    // Initial Fetch
    useEffect(() => {
        fetchHistory();
        if (new URLSearchParams(window.location.search).get('view') === 'pricing') {
            setView('pricing');
        }
        if (view === 'referral') {
            fetchReferrals();
        }
        if (view === 'leaderboard') {
            fetchGamificationStats();
        }
    }, [view]);

    const fetchGamificationStats = async () => {
        try {
            const res = await axios.get('/api/gamification/stats');
            setGamificationData(res.data);
        } catch (err) {
            console.error("Failed to fetch gamification stats");
        }
    };

    const fetchReferrals = async () => {
        try {
            const res = await axios.get('/api/referrals');
            setReferralData(res.data);
        } catch (err) {
            console.error("Failed to fetch referrals");
        }
    };

    const handleUpdateBank = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/referrals/bank-info', bankInfo);
            alert("銀行資訊已儲存");
            setShowBankForm(false);
        } catch (err) {
            alert("儲存失敗");
        }
    };

    const handleWithdraw = async () => {
        try {
            const res = await axios.post('/api/referrals/withdraw');
            alert(res.data.message);
            fetchReferrals();
        } catch (err: any) {
            alert(err.response?.data?.error || "申請失敗");
        }
    };

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
            const res = await axios.get(`/api/discovery?q=${encodeURIComponent(searchQuery)}&order=${order}&language=${language}`);
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
                        {t('dashboard_title')}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                            <button 
                                onClick={() => setView('search')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'search' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {t('search_videos')}
                            </button>
                            <button 
                                onClick={() => setView('history')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'history' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {t('history')}
                            </button>
                            <button 
                                onClick={() => setView('pricing')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'pricing' ? 'bg-yellow-400 text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {t('pricing')}
                            </button>
                            <button 
                                onClick={() => setView('referral')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'referral' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {t('referral')}
                            </button>
                            <button 
                                onClick={() => setView('leaderboard')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'leaderboard' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {t('leaderboard')}
                            </button>
                        </div>
                        
                        {!hasYouTube && (
                            <a 
                                href={route('auth.google.redirect')}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                                <Youtube size={18} /> {t('connect_youtube')}
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
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-400 flex flex-col items-center justify-center text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                    <p className="text-[10px] font-black leading-none uppercase">LV</p>
                                    <p className="text-xl font-black leading-none">{auth.user.level}</p>
                                </div>
                                <div className="flex-1 min-w-[120px]">
                                    <div className="flex justify-between items-end mb-1">
                                        <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-500 tracking-wider">創作者等級</p>
                                        <p className="text-[10px] text-gray-400 dark:text-zinc-400 font-bold">{auth.user.xp} / {auth.gamification.next_level_xp} XP</p>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400" style={{ width: `${auth.gamification.xp_progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${auth.user.streak_count > 0 ? 'bg-orange-500 text-white animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'}`}>
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-500 tracking-wider">連續創作</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">{t('streak_days', { count: auth.user.streak_count || 0 })}</p>
                                </div>
                            </div>
                            {auth.user.streak_count >= 7 && <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded text-[10px] font-bold border border-orange-500/20">獲得 7 天獎勵</div>}
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-yellow-500">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-500 tracking-wider">{t('remaining_credits')}</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">{auth.user.credits || 0} {t('credits_unit')}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setView('pricing')}
                                className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-300 transition-all shadow-sm active:scale-95"
                            >
                                {t('recharge')}
                            </button>
                        </div>
                    </div>

                    {view === 'history' ? (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Clock /> 您的 AI 創作歷史</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {history.length > 0 ? history.map((item: any) => (
                                    <div key={item.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden p-4 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                item.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                                item.status === 'fail' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                                            }`}>
                                                {item.status} {item.status === 'running' && `(${item.progress}%)`}
                                            </span>
                                            <span className="text-[10px] text-gray-400 dark:text-zinc-500">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 mb-2">{item.optimized_title || item.original_title}</h4>
                                        {item.video_url ? (
                                            <video src={item.video_url} className="w-full aspect-[9/16] object-cover rounded-lg bg-black" />
                                        ) : (
                                            <div className="w-full aspect-[9/16] bg-gray-100 dark:bg-zinc-800 flex items-center justify-center rounded-lg text-gray-300 dark:text-zinc-500">
                                                <FileVideo size={48} />
                                            </div>
                                        )}
                                        <div className="mt-4 flex gap-2">
                                            {item.video_url && (
                                                <a href={item.video_url} download className="flex-1 bg-gray-100 dark:bg-zinc-800 text-center py-2 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-gray-700 dark:text-white">下載影片</a>
                                            )}
                                            {item.youtube_url && (
                                                <a href={item.youtube_url} target="_blank" className="bg-red-50 text-red-600 dark:bg-red-600/20 dark:text-red-400 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1"><Youtube size={14}/> 已上傳</a>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 dark:text-zinc-500 col-span-full py-20 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">尚未有製作紀錄，快去搜尋影片吧！</p>
                                )}
                            </div>
                        </div>
                    ) : view === 'pricing' ? (
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">選擇適合您的規模</h3>
                                <p className="text-gray-500 dark:text-zinc-500">升級方案以解鎖更多影片生成額度與 AI 高級功能</p>
                            </div>
                            <Pricing />
                        </div>
                    ) : view === 'referral' ? (
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4">推廣獲利計畫</h3>
                                <p className="text-gray-500 dark:text-zinc-500">邀請好友加入 ShortsAIPro，每筆訂閱您都可獲得 20% 獎金，好友還能多拿 50 片生成額度！</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 mb-2">
                                        <Users size={16} />
                                        <p className="text-[10px] font-bold uppercase tracking-wider">{t('referred_count')}</p>
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">{auth.referral.referrals_count || 0} <span className="text-sm font-normal text-gray-400 dark:text-zinc-500">{t('people_unit')}</span></p>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
                                        <Clock size={16} />
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">{t('pending_commissions')}</p>
                                    </div>
                                    <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400">NT$ {auth.referral.pending_commissions || 0}</p>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                                        <CheckCircle2 size={16} />
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">{t('total_commissions')}</p>
                                    </div>
                                    <p className="text-3xl font-black text-green-600 dark:text-green-400">NT$ {auth.referral.total_commissions || 0}</p>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
                                    <button 
                                        onClick={handleWithdraw}
                                        disabled={(auth.referral.pending_commissions || 0) < 1000}
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-zinc-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Wallet size={18} /> {t('request_withdrawal')}
                                    </button>
                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-2 text-center">{t('withdrawal_threshold')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Share2 className="text-yellow-500 dark:text-yellow-400" size={20} />
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">您的專屬推薦連結</h4>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    readOnly 
                                                    value={auth.referral.referral_link}
                                                    className="flex-1 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-700 dark:text-zinc-300 text-sm outline-none focus:ring-1 focus:ring-yellow-400"
                                                />
                                                <button 
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(auth.referral.referral_link);
                                                        alert("已複製推薦連結！");
                                                    }}
                                                    className="bg-gray-900 dark:bg-zinc-800 text-white px-4 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-zinc-700 transition-all shadow-sm"
                                                >
                                                    複製
                                                </button>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 mt-2">
                                                <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold">快速分享：</p>
                                                <button 
                                                    onClick={() => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(auth.referral.referral_link)}`)}
                                                    className="w-10 h-10 rounded-full bg-[#00B900] flex items-center justify-center hover:opacity-80 transition-all shadow-sm"
                                                >
                                                    <span className="text-white font-black text-[10px]">LINE</span>
                                                </button>
                                                <button 
                                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(auth.referral.referral_link)}`)}
                                                    className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition-all shadow-sm"
                                                >
                                                    <span className="text-white font-black text-[10px]">FB</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2">
                                                <Landmark className="text-blue-500 dark:text-blue-400" size={20} />
                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">銀行收款資訊</h4>
                                            </div>
                                            <button 
                                                onClick={() => setShowBankForm(!showBankForm)}
                                                className="text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white underline font-bold"
                                            >
                                                {showBankForm ? '取消' : '修改資訊'}
                                            </button>
                                        </div>

                                        {showBankForm ? (
                                            <form onSubmit={handleUpdateBank} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1 block">銀行代碼 (3碼)</label>
                                                        <input 
                                                            type="text" 
                                                            value={bankInfo.bank_code}
                                                            onChange={e => setBankInfo({...bankInfo, bank_code: e.target.value})}
                                                            placeholder="例如: 822"
                                                            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1 block">分行/銀行名稱</label>
                                                        <input 
                                                            type="text" 
                                                            value={bankInfo.bank_name}
                                                            onChange={e => setBankInfo({...bankInfo, bank_name: e.target.value})}
                                                            placeholder="中國信託"
                                                            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1 block">帳號</label>
                                                    <input 
                                                        type="text" 
                                                        value={bankInfo.bank_account}
                                                        onChange={e => setBankInfo({...bankInfo, bank_account: e.target.value})}
                                                        placeholder="帳號"
                                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white"
                                                        required
                                                    />
                                                </div>
                                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl font-bold shadow-md">儲存資訊</button>
                                            </form>
                                        ) : (
                                            <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-4 rounded-xl">
                                                {auth.user.bank_account ? (
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-500 dark:text-zinc-300 flex justify-between"><span>銀行:</span> <span className="text-gray-900 dark:text-white font-bold">{auth.user.bank_code} {auth.user.bank_name}</span></p>
                                                        <p className="text-sm text-gray-500 dark:text-zinc-300 flex justify-between"><span>帳號:</span> <span className="text-gray-900 dark:text-white font-bold">{auth.user.bank_account}</span></p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-400 dark:text-zinc-500 italic text-center py-4">尚未設定收款帳戶</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl h-full flex flex-col shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <TrendingUp className="text-green-500 dark:text-green-400" size={20} />
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">推薦動態</h4>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                        {referralData.referrals.length > 0 ? referralData.referrals.map((ref: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{ref.name}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500">{ref.date}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${ref.status === '已訂閱' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                                                    {ref.status}
                                                </span>
                                            </div>
                                        )) : (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-zinc-600 py-20">
                                                <Gift size={48} className="mb-4 opacity-20" />
                                                <p className="text-sm font-bold">分享連結，開始賺取被動收入！</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : view === 'leaderboard' ? (
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4">創作者名人堂</h3>
                                <p className="text-gray-500 dark:text-zinc-500">與頂尖創作者競爭，累積 XP 提升等級，解鎖專屬勳章與獎勵！</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Leaderboard */}
                                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                                    <div className="flex items-center gap-2 mb-8">
                                        <Trophy className="text-yellow-500 dark:text-yellow-400" size={24} />
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">全球創作者排行 (Top 10)</h4>
                                    </div>

                                    <div className="space-y-4">
                                        {gamificationData.leaderboard.map((item: any) => (
                                            <div key={item.rank} className={`flex items-center gap-4 p-4 rounded-2xl border ${item.id === auth.user.id ? 'bg-yellow-400/5 border-yellow-400/30' : 'bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800'}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                                                    item.rank === 1 ? 'bg-yellow-400 text-black' :
                                                    item.rank === 2 ? 'bg-gray-300 text-black' :
                                                    item.rank === 3 ? 'bg-orange-400 text-black' : 'text-gray-400 dark:text-zinc-500'
                                                }`}>
                                                    {item.rank}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-wider">LV {item.level} 創作者</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white">{item.xp.toLocaleString()} XP</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">{item.streak} 天連勝</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="space-y-8">
                                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl h-full flex flex-col shadow-sm">
                                        <div className="flex items-center gap-2 mb-8">
                                            <Award className="text-orange-500 dark:text-orange-400" size={24} />
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">我的勳章館</h4>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            {gamificationData.achievements.length > 0 ? gamificationData.achievements.map((achievement: any) => (
                                                <div key={achievement.id} className="group p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 hover:border-orange-400/50 transition-all flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                                        <Medal size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{achievement.badge_name}</p>
                                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-tight">{achievement.description}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-zinc-600 py-20 text-center">
                                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4 opacity-20">
                                                        <Award size={32} />
                                                    </div>
                                                    <p className="text-sm font-bold">尚未解鎖勳章，<br/>趕快開始您的第一次製作吧！</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {/* Prominent Search Section */}
                            <div className="py-12 px-4 relative overflow-hidden text-center rounded-[3rem] bg-gray-50/50 dark:bg-transparent">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05),transparent_70%)] pointer-events-none"></div>
                                
                                <div className="max-w-3xl mx-auto relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-6">
                                        <Sparkles size={12} className="fill-current" />
                                        <span>AI 爆紅影片偵測器</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                                        搜尋您的 <span className="bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-500 bg-clip-text text-transparent">流量密碼</span>
                                    </h3>
                                    <p className="text-gray-500 dark:text-zinc-500 text-sm mb-10 max-w-lg mx-auto">輸入關鍵字，讓 AI 幫您從 YouTube 海量 Shorts 中精選出最具重製潛力的爆紅素材。</p>

                                    <div className="relative group max-w-2xl mx-auto">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                        <div className="relative flex flex-col sm:flex-row gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-2xl shadow-xl">
                                            <div className="relative flex-1 flex items-center">
                                                <div className="absolute left-4 text-gray-400 dark:text-zinc-500">
                                                    <Search size={20} />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                                    placeholder={t('search_placeholder')} 
                                                    className="w-full bg-transparent border-none text-gray-900 dark:text-white pl-12 pr-12 py-3 text-lg focus:ring-0 outline-none placeholder:text-gray-300 dark:placeholder:text-zinc-600"
                                                />
                                                <button 
                                                    onClick={() => setShowFilters(!showFilters)}
                                                    className={`absolute right-2 p-2 rounded-xl transition-all ${showFilters ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'}`}
                                                >
                                                    <Filter size={20} />
                                                </button>
                                            </div>
                                            <button 
                                                onClick={handleSearch}
                                                disabled={loading}
                                                className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-black hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 disabled:opacity-50 min-w-[140px]"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={20} /> : <>{t('start_exploring')} <Play size={20} fill="currentColor" /></>}
                                            </button>
                                        </div>

                                        {showFilters && (
                                            <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                                                <div className="space-y-3 text-left">
                                                    <label className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-[0.2em] flex items-center gap-2">
                                                        <TrendingUp size={14} className="text-yellow-500" /> 排序方式
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {[
                                                            { id: 'relevance', label: '相關性' },
                                                            { id: 'date', label: '最新上傳' },
                                                            { id: 'viewCount', label: '觀看次數' },
                                                            { id: 'rating', label: '評分高低' }
                                                        ].map((opt) => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => setOrder(opt.id)}
                                                                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${order === opt.id ? 'bg-yellow-50 dark:bg-yellow-400/10 border-yellow-400 text-yellow-600 dark:text-yellow-400' : 'bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-500 hover:border-gray-200 dark:hover:border-zinc-700'}`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-3 text-left">
                                                    <label className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-[0.2em] flex items-center gap-2">
                                                        <Globe size={14} className="text-yellow-500" /> 語言設定
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {[
                                                            { id: 'zh-Hant', label: '繁體中文' },
                                                            { id: 'zh-Hans', label: '簡體中文' },
                                                            { id: 'en', label: '英文' },
                                                            { id: 'all', label: '不限語言' }
                                                        ].map((opt) => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => setLanguage(opt.id)}
                                                                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${language === opt.id ? 'bg-yellow-50 dark:bg-yellow-400/10 border-yellow-400 text-yellow-600 dark:text-yellow-400' : 'bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-500 hover:border-gray-200 dark:hover:border-zinc-700'}`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Discovery Results */}
                            {videos.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                                    {videos.map((video) => (
                                        <div key={video.id} className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400 dark:hover:border-yellow-400/50 transition-all shadow-sm">
                                            <div className="relative aspect-[9/16] bg-gray-100 dark:bg-zinc-800">
                                                <img 
                                                    src={video.thumbnail} 
                                                    alt={video.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                    <button 
                                                        onClick={() => startAnalysis(video)}
                                                        className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold text-sm shadow-xl cursor-pointer active:scale-95 transition-transform"
                                                    >
                                                        一鍵重製此影片
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-zinc-100 line-clamp-2 mb-1">{video.title}</h4>
                                                <p className="text-gray-400 dark:text-zinc-500 text-xs">{video.channelTitle}</p>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-left">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !analyzing && !generating && !publishing && setSelectedVideo(null)}></div>
                    <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-yellow-500 dark:text-yellow-400" size={20} />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI 重製計畫</h3>
                            </div>
                            <button onClick={() => setSelectedVideo(null)} className="text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {analyzing ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="animate-spin text-yellow-500 dark:text-yellow-400" size={48} />
                                    <p className="text-gray-500 dark:text-zinc-400 animate-pulse font-bold">MiniMax 正在深度分析影片爆紅基因...</p>
                                </div>
                            ) : remakePlan ? (
                                <div className="space-y-6 text-left">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 relative shadow-inner">
                                            <img src={selectedVideo.thumbnail} className="w-full h-full object-cover" alt="Original" />
                                            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white backdrop-blur-md">原片原型</div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-black">優化標題</label>
                                                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{remakePlan.optimizedTitle}</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-black">爆紅 Hook</label>
                                                <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">{remakePlan.viralHook}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800">
                                                <label className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-black">AI 視覺 Prompt</label>
                                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 italic leading-relaxed">"{remakePlan.visualPrompt}"</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                                        {generating ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm font-bold">
                                                    <span className="flex items-center gap-2 text-gray-600 dark:text-white"><Loader2 className="animate-spin text-yellow-500 dark:text-yellow-400" size={16} /> Sora 2 正在生成影片...</span>
                                                    <span className="text-yellow-600 dark:text-yellow-400 font-black">{taskStatus?.progress || 0}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                                                    <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${taskStatus?.progress || 0}%` }}></div>
                                                </div>
                                            </div>
                                        ) : taskStatus?.state === 'success' ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                    <CheckCircle2 size={20} />
                                                    <span className="font-bold text-lg">生成完成！</span>
                                                </div>
                                                <video src={taskStatus.video_url} controls className="w-full rounded-xl border border-gray-100 dark:border-zinc-800 shadow-xl" />
                                                <div className="flex gap-4">
                                                    <button 
                                                        onClick={handlePublish}
                                                        disabled={publishing || published}
                                                        className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-black dark:hover:bg-gray-100 transition-all shadow-lg"
                                                    >
                                                        {publishing ? <Loader2 className="animate-spin" size={18} /> : published ? <CheckCircle2 size={18} /> : <Upload size={18} />}
                                                        {published ? "已發布至 YouTube" : "一鍵發布至 YouTube"}
                                                    </button>
                                                    <a href={taskStatus.video_url} download className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                                                        <Play size={20} className="rotate-90 text-gray-900 dark:text-white" />
                                                    </a>
                                                </div>
                                            </div>
                                        ) : taskStatus?.state === 'fail' ? (
                                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-400/10 border border-red-100 dark:border-red-400/20 text-red-600 dark:text-red-400 flex items-start gap-3 text-left">
                                                <AlertCircle className="shrink-0" size={20} />
                                                <div>
                                                    <p className="font-bold text-sm">生成失敗</p>
                                                    <p className="text-xs opacity-80">{taskStatus.fail_msg}</p>
                                                    <button onClick={startGeneration} className="mt-2 text-xs underline font-black">重試</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={startGeneration}
                                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-xl font-black text-lg shadow-[0_10px_30px_rgba(250,204,21,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
