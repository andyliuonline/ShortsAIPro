import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    Zap, 
    TrendingUp, 
    Play, 
    Upload, 
    Star, 
    ShieldCheck, 
    Clock, 
    CheckCircle2, 
    BarChart3, 
    Globe, 
    MessageSquare,
    Youtube
} from "lucide-react";
import Pricing from "@/Components/Pricing";

export default function Welcome({
    auth,
}: PageProps) {
    const testimonials = [
        {
            name: "陳小明",
            role: "YouTube 創作者 (10萬訂閱)",
            content: "自從使用了 ShortsAIPro，我每天只需要花 10 分鐘就能產出高品質短影音。頻道觀看數在一個月內成長了 400%！",
            avatar: "陳"
        },
        {
            name: "Sarah Lin",
            role: "電商經營者",
            content: "以前請剪輯師每月要花好幾萬，現在靠 ShortsAIPro 自動重製爆紅影片，成本降低了 90%，轉單率反而更高了。",
            avatar: "S"
        },
        {
            name: "張大衛",
            role: "全職自媒體人",
            content: "AI 重製的邏輯非常強，完全避開了版權風險，視覺效果甚至比原片更吸引人。這是我看過最強的生產力工具。",
            avatar: "張"
        }
    ];

    const stats = [
        { label: "已生成影片", value: "1,248,500+" },
        { label: "平均觀看成長", value: "350%" },
        { label: "節省剪輯時間", value: "95%" },
        { label: "全球創作者", value: "50,000+" }
    ];

    return (
        <>
            <Head title="ShortsAIPro - 全自動 AI 短影音獲利機器" />
            <div className="bg-zinc-950 text-zinc-50 min-h-screen flex flex-col selection:bg-yellow-400 selection:text-black">
                {/* Navigation */}
                <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center gap-2">
                                <Zap className="text-yellow-400 fill-yellow-400" size={24} />
                                <span className="text-xl font-bold tracking-tight italic">Shorts<span className="text-yellow-400">Pro</span></span>
                            </div>
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">功能特性</a>
                                <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">運作原理</a>
                                <a href="#testimonials" className="text-sm text-zinc-400 hover:text-white transition-colors">使用者見證</a>
                                <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">方案定價</a>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                                    >
                                        進入主控台
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium hover:text-yellow-400 transition-colors"
                                        >
                                            登入
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                                        >
                                            立即免費開始
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_70%)] pointer-events-none"></div>
                        <div className="max-w-5xl mx-auto text-center relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-yellow-400 text-xs font-bold mb-8 animate-bounce">
                                <Star size={14} className="fill-yellow-400" />
                                <span>2026 短影音藍海策略：全自動 AI 獲利機器</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
                                讓 AI 為你製造 <br />
                                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">百萬流量大軍</span>
                            </h1>
                            <p className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
                                自動搜尋熱門影片、AI 智慧重製視覺、SEO 標題優化、一鍵發布。
                                <span className="text-white font-bold"> 無需露臉、無需剪輯、無需經驗。</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link 
                                    href={route('register')}
                                    className="w-full sm:w-auto bg-yellow-400 text-black px-10 py-5 rounded-2xl font-black text-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95"
                                >
                                    立即免費啟動 <Play size={24} className="fill-black" />
                                </Link>
                                <div className="flex items-center gap-4 text-zinc-500 text-sm">
                                    <div className="flex -space-x-2">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center font-bold text-[10px]">U{i}</div>
                                        ))}
                                    </div>
                                    <span>已有 50,000+ 創作者加入</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="py-16 border-y border-zinc-900 bg-zinc-900/20">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {stats.map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-zinc-500 text-sm mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="py-32 px-4" id="features">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-20">
                                <h2 className="text-4xl md:text-5xl font-black mb-6">為什麼選擇 ShortsAIPro？</h2>
                                <p className="text-zinc-500 text-lg">我們整合了全球最強大的 AI 模型，專為獲利而生。</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-yellow-400/50 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <TrendingUp size={120} />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center mb-8 text-yellow-400">
                                        <TrendingUp size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">大數據爆紅偵測</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        實時監控全球短影音趨勢，自動篩選具備「百萬觀看基因」的影片原型，讓你贏在起跑點。
                                    </p>
                                </div>
                                <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-yellow-400/50 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Zap size={120} />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-orange-400/10 flex items-center justify-center mb-8 text-orange-400">
                                        <Zap size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Sora 級重製技術</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        AI 自動分析分鏡邏輯，完美保留爆紅節奏，並以全新視覺效果重製，徹底解決原創度與版權問題。
                                    </p>
                                </div>
                                <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-yellow-400/50 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <BarChart3 size={120} />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-blue-400/10 flex items-center justify-center mb-8 text-blue-400">
                                        <BarChart3 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">SEO 自動優化</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Gemini AI 為你撰寫極具吸引力的標題與標籤，並自動同步至 YouTube，打造 24/7 的自動流量機器。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How it works Section */}
                    <section className="py-32 bg-zinc-900/30" id="how-it-works">
                        <div className="max-w-5xl mx-auto px-4">
                            <div className="flex flex-col md:flex-row gap-16 items-center">
                                <div className="flex-1 space-y-8">
                                    <h2 className="text-4xl md:text-5xl font-black">只需三步，<br />啟動你的流量工廠</h2>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black shrink-0">1</div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">輸入關鍵字搜尋</h4>
                                                <p className="text-zinc-400">輸入你想做的領域，系統自動找出當下最熱門的爆紅原型。</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black shrink-0">2</div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">AI 一鍵重製</h4>
                                                <p className="text-zinc-400">點擊重製，AI 將自動分析並生成全新的 8K 高清影片。</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black shrink-0">3</div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">自動發布獲利</h4>
                                                <p className="text-zinc-400">設定發布頻道，剩下的交給 ShortsAIPro。你只需要觀察流量成長。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 w-full aspect-square rounded-3xl border-4 border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                                    <div className="p-8 text-center">
                                        <div className="flex justify-center mb-6">
                                            <Youtube size={80} className="text-red-500 animate-pulse" />
                                        </div>
                                        <p className="text-xl font-bold">全自動營運中...</p>
                                        <p className="text-zinc-500 text-sm mt-2">Connecting to Sora 2 & YouTube API</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="py-32 px-4" id="testimonials">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-20">
                                <h2 className="text-4xl md:text-5xl font-black mb-6">創作者的一致好評</h2>
                                <p className="text-zinc-500">聽聽那些已經達成財富自由的創作者怎麼說。</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {testimonials.map((t, i) => (
                                    <div key={i} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
                                        <div className="flex text-yellow-400 gap-1">
                                            {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                        </div>
                                        <p className="text-zinc-300 italic leading-relaxed text-lg">"{t.content}"</p>
                                        <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                                            <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center font-bold text-yellow-400">{t.avatar}</div>
                                            <div>
                                                <p className="font-bold text-white">{t.name}</p>
                                                <p className="text-xs text-zinc-500">{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section className="py-32 px-4 bg-zinc-950 relative overflow-hidden" id="pricing">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05),transparent_70%)] pointer-events-none"></div>
                        <div className="max-w-7xl mx-auto text-center relative z-10">
                            <h2 className="text-5xl font-black mb-6 italic">立即解鎖你的 <span className="text-yellow-400 underline decoration-zinc-800 underline-offset-8">流量密碼</span></h2>
                            <p className="text-zinc-500 text-xl mb-20 max-w-2xl mx-auto">
                                每天不到一杯咖啡的錢，換取 24 小時不間斷工作的 AI 短影音團隊。
                            </p>
                            <Pricing />
                        </div>
                    </section>

                    {/* FAQ Quick CTA */}
                    <section className="py-20 px-4 bg-yellow-400 text-black">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl font-black mb-8">準備好建立你的短影音帝國了嗎？</h2>
                            <Link 
                                href={route('register')}
                                className="inline-block bg-black text-white px-12 py-5 rounded-2xl font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                            >
                                我要立即註冊
                            </Link>
                            <p className="mt-6 font-bold flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} /> 無需信用卡，立即免費試用
                            </p>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-zinc-900 py-20 px-4 bg-zinc-950">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                            <div className="col-span-1 md:col-span-2 space-y-6">
                                <div className="flex items-center gap-2">
                                    <Zap className="text-yellow-400 fill-yellow-400" size={32} />
                                    <span className="text-3xl font-black tracking-tighter italic">Shorts<span className="text-yellow-400">Pro</span></span>
                                </div>
                                <p className="text-zinc-500 max-w-sm">
                                    ShortsAIPro 是全球領先的 AI 短影音全自動化平台。我們利用尖端的生成式 AI 技術，幫助創作者與企業快速建立影響力並實現獲利。
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-sm">產品</h4>
                                <ul className="space-y-4 text-zinc-500 text-sm">
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">爆紅偵測器</a></li>
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">AI 重製工坊</a></li>
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">自動發布系統</a></li>
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">方案定價</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-sm">支援</h4>
                                <ul className="space-y-4 text-zinc-500 text-sm">
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">幫助中心</a></li>
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">API 文件</a></li>
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">服務條款</a></li>
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">隱私政策</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-zinc-500 text-sm">© 2026 ShortsAIPro. All rights reserved. 專為百萬創作者打造。</p>
                            <div className="flex gap-6">
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors"><Globe size={20} /></Link>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors"><Youtube size={20} /></Link>
                                <Link href="#" className="text-zinc-500 hover:text-white transition-colors"><MessageSquare size={20} /></Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </>
    );
}
