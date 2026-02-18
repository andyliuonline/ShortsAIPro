import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Key, Video, BrainCircuit, ExternalLink, HelpCircle, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function UpdateApiSettingsForm() {
    const { apiSettings } = usePage<any>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        video_model_provider: apiSettings?.video_model_provider || 'kie',
        video_model_id: apiSettings?.video_model_id || 'sora-2-text-to-video',
        user_kie_api_key: '',
        analysis_model_provider: apiSettings?.analysis_model_provider || 'system',
        analysis_model_id: apiSettings?.analysis_model_id || 'default',
        user_openai_api_key: '',
        user_anthropic_api_key: '',
        user_google_api_key: '',
    });

    const maskKey = (key: string): string => {
        if (!key) return '';
        if (key.length <= 8) return '********';
        return `${key.substring(0, 4)}****${key.substring(key.length - 4)}`;
    };

    const modelOptions: any = {
        openai: [
            { id: 'o3-mini', label: 'o3-mini (OpenAI 最新)' },
            { id: 'gpt-4o', label: 'GPT-4o (推薦)' },
            { id: 'o1-preview', label: 'o1-preview (強推理)' }
        ],
        anthropic: [
            { id: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet (最新)' },
            { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet v2' },
            { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' }
        ],
        google: [
            { id: 'gemini-2.0-pro-exp-02-05', label: 'Gemini 2.0 Pro (最新)' },
            { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' }
        ],
        system: [
            { id: 'default', label: '系統自動分配 (免費)' }
        ]
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.api-settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Clear password fields after success to maintain security feel
                setData({
                    ...data,
                    user_kie_api_key: '',
                    user_openai_api_key: '',
                    user_anthropic_api_key: '',
                    user_google_api_key: '',
                });
            }
        });
    };

    return (
        <section className="max-w-4xl relative">
            <form onSubmit={submit}>
                <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-600 dark:text-yellow-400">
                                <Key size={24} />
                            </div>
                            AI 服務金鑰設定
                        </h2>
                        <p className="mt-2 text-gray-500 dark:text-zinc-400 font-medium">
                            配置您個人的 API Key，享受不受限的極速生成體驗。
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0 translate-x-4"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0 -translate-x-4"
                        >
                            <p className="text-sm text-green-600 dark:text-green-400 font-black">✓ 已儲存</p>
                        </Transition>
                        
                        <button 
                            type="submit"
                            disabled={processing}
                            className="bg-gray-900 dark:bg-yellow-400 text-white dark:text-black px-6 py-3 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                        >
                            {processing ? <Loader2 className="animate-spin" size={18} /> : <><Sparkles size={18} /> 儲存設定</>}
                        </button>
                    </div>
                </header>

                <div className="space-y-10">
                    {/* Video Generation Settings */}
                    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-8 backdrop-blur-sm">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Video size={20} />
                            </div>
                            影片產生模型
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-[0.2em] mb-3">選擇生成引擎</label>
                                    <select 
                                        value={data.video_model_id}
                                        onChange={(e) => setData('video_model_id', e.target.value)}
                                        className="w-full rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white py-3 px-4 font-bold focus:ring-2 focus:ring-yellow-400/50 transition-all outline-none"
                                    >
                                        <optgroup label="Sora 系列">
                                            <option value="sora-2-text-to-video">Sora 2 (720p)</option>
                                        </optgroup>
                                        <optgroup label="Kling 系列 (Text-to-Video)">
                                            <option value="kling-v2-6-text-to-video-720p">Kling 2.6 (720p)</option>
                                            <option value="kling-v2-6-text-to-video-1080p">Kling 2.6 (1080p)</option>
                                            <option value="kling-v3-0-text-to-video-720p">Kling 3.0 (720p)</option>
                                            <option value="kling-v3-0-text-to-video-1080p">Kling 3.0 (1080p)</option>
                                        </optgroup>
                                        <optgroup label="Luma 系列">
                                            <option value="luma-dream-machine">Luma Dream Machine</option>
                                        </optgroup>
                                        <optgroup label="Haiper 系列">
                                            <option value="haiper-video-v2">Haiper V2 (1080p)</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-[0.2em]">Kie.ai API Key</label>
                                        {apiSettings?.user_kie_api_key ? (
                                            <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                                <CheckCircle2 size={10}/> 已配置
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                                                尚未配置
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={data.user_kie_api_key}
                                        onChange={(e) => setData('user_kie_api_key', e.target.value)}
                                        placeholder={apiSettings?.user_kie_api_key ? maskKey(apiSettings.user_kie_api_key) : "填入您的 sk-..."}
                                        className={`w-full rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-3 px-4 font-bold focus:ring-2 focus:ring-yellow-400/50 transition-all outline-none ${apiSettings?.user_kie_api_key && !data.user_kie_api_key ? 'text-green-500 placeholder:text-green-500/70' : 'text-gray-900 dark:text-white'}`}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/20 p-6 rounded-[2rem] h-full">
                                <h4 className="text-sm font-black text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-4">
                                    <HelpCircle size={16} /> 快速申請教學
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                                        <p className="text-xs text-blue-800/70 dark:text-blue-300/70 font-medium leading-relaxed">
                                            訪問 <a href="https://kie.ai?ref=35650a0f230acb573b544f8f0f3858b2" target="_blank" className="text-blue-600 dark:text-blue-400 underline font-bold inline-flex items-center gap-0.5">Kie.ai 官網 <ExternalLink size={10} /></a> 並完成註冊。
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                                        <p className="text-xs text-blue-800/70 dark:text-blue-300/70 font-medium leading-relaxed">前往 API 設定頁面，建立一個新的 API Key。</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">3</div>
                                        <p className="text-xs text-blue-800/70 dark:text-blue-300/70 font-medium leading-relaxed">將 Key 複製並貼回此處即可。建議保持額度充足。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Settings */}
                    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-8 backdrop-blur-sm">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                <BrainCircuit size={20} />
                            </div>
                            爆紅分析引擎
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-[0.2em] mb-4">1. 選擇服務供應商</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        { id: 'system', label: 'ShortsAI 系統', sub: '全自動/免費' },
                                        { id: 'openai', label: 'ChatGPT', sub: 'OpenAI' },
                                        { id: 'anthropic', label: 'Claude', sub: 'Anthropic' },
                                        { id: 'google', label: 'Gemini', sub: 'Google Cloud' }
                                    ].map((prov) => (
                                        <button
                                            key={prov.id}
                                            type="button"
                                            onClick={() => {
                                                setData('analysis_model_provider', prov.id);
                                                setData('analysis_model_id', modelOptions[prov.id][0].id);
                                            }}
                                            className={`p-4 rounded-2xl text-left border-2 transition-all group ${data.analysis_model_provider === prov.id ? 'bg-yellow-400 border-yellow-400 shadow-lg shadow-yellow-400/20' : 'bg-gray-50 dark:bg-zinc-950 border-transparent hover:border-gray-200 dark:hover:border-zinc-700'}`}
                                        >
                                            <p className={`text-sm font-black ${data.analysis_model_provider === prov.id ? 'text-black' : 'text-gray-900 dark:text-white'}`}>{prov.label}</p>
                                            <p className={`text-[10px] mt-1 font-bold ${data.analysis_model_provider === prov.id ? 'text-black/60' : 'text-gray-400 dark:text-zinc-500'}`}>{prov.sub}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {data.analysis_model_provider !== 'system' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-[0.2em] mb-3">2. 選擇具體語言模型</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {modelOptions[data.analysis_model_provider].map((model: any) => (
                                                    <button
                                                        key={model.id}
                                                        type="button"
                                                        onClick={() => setData('analysis_model_id', model.id)}
                                                        className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${data.analysis_model_id === model.id ? 'bg-white dark:bg-zinc-800 border-yellow-400 text-yellow-600' : 'bg-gray-50 dark:bg-zinc-950 border-transparent text-gray-500 dark:text-zinc-400'}`}
                                                    >
                                                        <span className="text-sm font-bold">{model.label}</span>
                                                        {data.analysis_model_id === model.id && <CheckCircle2 size={16} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="block text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-[0.2em]">3. 填寫 API Key</label>
                                                {data.analysis_model_provider === 'openai' && apiSettings?.user_openai_api_key && <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20"><CheckCircle2 size={10}/> 已配置</span>}
                                                {data.analysis_model_provider === 'anthropic' && apiSettings?.user_anthropic_api_key && <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20"><CheckCircle2 size={10}/> 已配置</span>}
                                                {data.analysis_model_provider === 'google' && apiSettings?.user_google_api_key && <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20"><CheckCircle2 size={10}/> 已配置</span>}
                                                {data.analysis_model_provider !== 'system' && !apiSettings?.[`user_${data.analysis_model_provider}_api_key`] && <span className="text-[10px] font-black text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">尚未配置</span>}
                                            </div>
                                            {data.analysis_model_provider === 'openai' && (
                                                <input
                                                    type="text"
                                                    value={data.user_openai_api_key}
                                                    onChange={(e) => setData('user_openai_api_key', e.target.value)}
                                                    placeholder={apiSettings?.user_openai_api_key ? maskKey(apiSettings.user_openai_api_key) : "填入您的 OpenAI Key"}
                                                    className={`w-full rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-3 px-4 font-bold focus:ring-2 focus:ring-yellow-400/50 transition-all outline-none ${apiSettings?.user_openai_api_key && !data.user_openai_api_key ? 'text-green-500 placeholder:text-green-500/70' : 'text-gray-900 dark:text-white'}`}
                                                />
                                            )}
                                            {data.analysis_model_provider === 'anthropic' && (
                                                <input
                                                    type="text"
                                                    value={data.user_anthropic_api_key}
                                                    onChange={(e) => setData('user_anthropic_api_key', e.target.value)}
                                                    placeholder={apiSettings?.user_anthropic_api_key ? maskKey(apiSettings.user_anthropic_api_key) : "填入您的 Anthropic Key"}
                                                    className={`w-full rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-3 px-4 font-bold focus:ring-2 focus:ring-yellow-400/50 transition-all outline-none ${apiSettings?.user_anthropic_api_key && !data.user_anthropic_api_key ? 'text-green-500 placeholder:text-green-500/70' : 'text-gray-900 dark:text-white'}`}
                                                />
                                            )}
                                            {data.analysis_model_provider === 'google' && (
                                                <input
                                                    type="text"
                                                    value={data.user_google_api_key}
                                                    onChange={(e) => setData('user_google_api_key', e.target.value)}
                                                    placeholder={apiSettings?.user_google_api_key ? maskKey(apiSettings.user_google_api_key) : "填入您的 Google API Key"}
                                                    className={`w-full rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-3 px-4 font-bold focus:ring-2 focus:ring-yellow-400/50 transition-all outline-none ${apiSettings?.user_google_api_key && !data.user_google_api_key ? 'text-green-500 placeholder:text-green-500/70' : 'text-gray-900 dark:text-white'}`}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100/50 dark:border-orange-800/20 p-6 rounded-[2rem] h-full">
                                        <h4 className="text-sm font-black text-orange-700 dark:text-orange-400 flex items-center gap-2 mb-4">
                                            <HelpCircle size={16} /> 獲取 API 教學
                                        </h4>
                                        <div className="space-y-4">
                                            <p className="text-xs text-orange-800/70 dark:text-orange-300/70 font-medium leading-relaxed">
                                                您可以使用自己的語言模型帳戶來獲取更精準的分析或更高的查詢頻率：
                                            </p>
                                            <ul className="space-y-3">
                                                <li>
                                                    <a href="https://platform.openai.com/api-keys" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200/50 dark:border-orange-800/30 hover:scale-[1.02] transition-all group shadow-sm">
                                                        <span className="text-xs font-black text-gray-700 dark:text-gray-200">OpenAI API 管理</span>
                                                        <ExternalLink size={12} className="text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://console.anthropic.com/settings/keys" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200/50 dark:border-orange-800/30 hover:scale-[1.02] transition-all group shadow-sm">
                                                        <span className="text-xs font-black text-gray-700 dark:text-gray-200">Anthropic 控制台</span>
                                                        <ExternalLink size={12} className="text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://aistudio.google.com/app/apikey" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200/50 dark:border-orange-800/30 hover:scale-[1.02] transition-all group shadow-sm">
                                                        <span className="text-xs font-black text-gray-700 dark:text-gray-200">Google AI Studio (Gemini)</span>
                                                        <ExternalLink size={12} className="text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}
