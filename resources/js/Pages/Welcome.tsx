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
    Youtube,
    Sparkles,
    Users,
    Trophy,
    Award,
    Gift,
    Medal
} from "lucide-react";
import Pricing from "@/Components/Pricing";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { useTranslate } from "@/Helpers/useTranslate";

export default function Welcome({
    auth,
}: PageProps) {
    const { t } = useTranslate();
    
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
            <Head>
                <title>{t('seo_title')}</title>
                <meta name="description" content={t('seo_description')} />
                <meta name="keywords" content={t('seo_keywords')} />
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.shortsaipro.com/" />
                <meta property="og:title" content={t('seo_title')} />
                <meta property="og:description" content={t('seo_description')} />
                <meta property="og:image" content="https://www.shortsaipro.com/og-image.jpg" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://www.shortsaipro.com/" />
                <meta property="twitter:title" content={t('seo_title')} />
                <meta property="twitter:description" content={t('seo_description')} />
                <meta property="twitter:image" content="https://www.shortsaipro.com/og-image.jpg" />
            </Head>
            <div className="bg-zinc-950 text-zinc-50 min-h-screen flex flex-col selection:bg-yellow-400 selection:text-black">
                {/* Navigation */}
                <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center gap-2">
                                <Zap className="text-yellow-400 fill-yellow-400" size={24} />
                                <span className="text-xl font-bold tracking-tight italic">ShortsAI<span className="text-yellow-400">Pro</span></span>
                            </div>
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('why_choose_us')}</a>
                                <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">運作原理</a>
                                <a href="#gamification" className="text-sm text-zinc-400 hover:text-white transition-colors">成長體系</a>
                                <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">{t('pricing')}</a>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                                    >
                                        {t('dashboard')}
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium hover:text-yellow-400 transition-colors"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                                        >
                                            立即免費開始
                                        </Link>
                                    </>
                                )}
                                <LanguageSwitcher />
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
                                {t('hero_title_1')} <br />
                                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">{t('hero_title_2')}</span>
                            </h1>
                            <p className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
                                {t('hero_subtitle')}
                            </p>
                            
                            {/* Mock Input Box for PLG */}
                            <div className="max-w-2xl mx-auto mb-12 relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative flex flex-col sm:flex-row gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl">
                                    <input 
                                        type="text" 
                                        placeholder={t('search_placeholder')} 
                                        className="flex-grow bg-transparent border-none text-white px-4 py-3 focus:ring-0 outline-none text-lg"
                                        readOnly
                                    />
                                    <Link 
                                        href={route('register')}
                                        className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-black hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        {t('explore_btn')} <Sparkles size={20} />
                                    </Link>
                                </div>
                                <p className="mt-4 text-zinc-500 text-sm">{t('plg_hint')}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <div className="flex items-center gap-8 text-zinc-400 text-sm font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        20+ 語言支援
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        99% 避開版權偵測
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        全自動發布
                                    </div>
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
                                <h2 className="text-4xl md:text-5xl font-black mb-6">{t('why_choose_us')}</h2>
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
                                    <h3 className="text-2xl font-bold mb-4">{t('feature_detection_title')}</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        {t('feature_detection_desc')}
                                    </p>
                                </div>
                                <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-yellow-400/50 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Zap size={120} />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-orange-400/10 flex items-center justify-center mb-8 text-orange-400">
                                        <Zap size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{t('feature_sora_title')}</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        {t('feature_sora_desc')}
                                    </p>
                                </div>
                                <div className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-yellow-400/50 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <BarChart3 size={120} />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-blue-400/10 flex items-center justify-center mb-8 text-blue-400">
                                        <BarChart3 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{t('feature_seo_title')}</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        {t('feature_seo_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Gamification & Referral Section */}
                    <section className="py-32 px-4 relative overflow-hidden" id="gamification">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_10%,rgba(249,115,22,0.05),transparent_50%)]"></div>
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Gamification */}
                                <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-[3rem] space-y-8 hover:border-orange-500/30 transition-all relative group">
                                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                                        <Trophy size={40} />
                                    </div>
                                    <h2 className="text-4xl font-black leading-tight">{t('gamification_title')}</h2>
                                    <p className="text-zinc-400 text-lg leading-relaxed">
                                        {t('gamification_desc')}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
                                            <TrendingUp className="text-orange-500" />
                                            <span className="font-bold text-sm">XP 成長體系</span>
                                        </div>
                                        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
                                            <Medal className="text-yellow-500" />
                                            <span className="font-bold text-sm">榮譽成就勳章</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full group-hover:bg-orange-500/20 transition-all"></div>
                                </div>

                                {/* Referral */}
                                <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-[3rem] space-y-8 hover:border-green-500/30 transition-all relative group">
                                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                                        <Gift size={40} />
                                    </div>
                                    <h2 className="text-4xl font-black leading-tight">{t('referral_feature_title')}</h2>
                                    <p className="text-zinc-400 text-lg leading-relaxed">
                                        {t('referral_feature_desc')}
                                    </p>
                                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-zinc-950 border border-zinc-800">
                                        <div className="flex-1">
                                            <div className="text-green-500 font-black text-3xl">20%</div>
                                            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">現金分潤</div>
                                        </div>
                                        <div className="w-px h-10 bg-zinc-800"></div>
                                        <div className="flex-1 text-right">
                                            <div className="text-white font-black text-3xl">+50</div>
                                            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">好友贈送額度</div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-500/10 blur-3xl rounded-full group-hover:bg-green-500/20 transition-all"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How it works Section */}
                    <section className="py-32 bg-zinc-900/30" id="how-it-works">
                        <div className="max-w-5xl mx-auto px-4">
                            <div className="flex flex-col md:flex-row gap-16 items-center">
                                <div className="flex-1 space-y-8">
                                    <h2 className="text-4xl md:text-5xl font-black">{t('how_it_works')}</h2>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black shrink-0">1</div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">{t('step_1_title')}</h4>
                                                <p className="text-zinc-400">{t('step_1_desc')}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black shrink-0">2</div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">{t('step_2_title')}</h4>
                                                <p className="text-zinc-400">{t('step_2_desc')}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black shrink-0">3</div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">{t('step_3_title')}</h4>
                                                <p className="text-zinc-400">{t('step_3_desc')}</p>
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
                            <h2 className="text-4xl font-black mb-8">{t('cta_title')}</h2>
                            <Link 
                                href={route('register')}
                                className="inline-block bg-black text-white px-12 py-5 rounded-2xl font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                            >
                                {t('cta_btn')}
                            </Link>
                            <p className="mt-6 font-bold flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} /> {t('cta_hint')}
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
                                    <span className="text-3xl font-black tracking-tighter italic">ShortsAI<span className="text-yellow-400">Pro</span></span>
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
                                    <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('pricing')}</a></li>
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
                html {
                    scroll-behavior: smooth;
                }
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
