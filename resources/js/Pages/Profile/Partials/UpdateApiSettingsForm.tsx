import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Key, Video, BrainCircuit, ExternalLink, HelpCircle } from 'lucide-react';

export default function UpdateApiSettingsForm() {
    const { apiSettings } = usePage<any>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        video_model_provider: apiSettings?.video_model_provider || 'kie',
        video_model_id: apiSettings?.video_model_id || 'sora-2-text-to-video',
        user_kie_api_key: apiSettings?.user_kie_api_key || '',
        analysis_model_provider: apiSettings?.analysis_model_provider || 'minimax',
        user_openai_api_key: apiSettings?.user_openai_api_key || '',
        user_anthropic_api_key: apiSettings?.user_anthropic_api_key || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.api-settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className="max-w-xl">
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Key size={20} className="text-yellow-500" />
                    AI 服務設定 (API Keys)
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    設定您自己的 AI 模型金鑰，享受更彈性、不受限的生成體驗。
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-8">
                {/* Video Generation Settings */}
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-6">
                    <h3 className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2">
                        <Video size={16} /> 影片生成模型
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">選擇模型引擎</label>
                            <select 
                                value={data.video_model_id}
                                onChange={(e) => setData('video_model_id', e.target.value)}
                                className="w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white focus:ring-yellow-500 transition-all"
                            >
                                <option value="sora-2-text-to-video">Sora 2 (Kie.ai 支援)</option>
                                <option value="kling-v1-text-to-video">Kling V1 (Kie.ai 支援)</option>
                                <option value="luma-dream-machine">Luma Dream Machine</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kie.ai API Key</label>
                            <input
                                type="password"
                                value={data.user_kie_api_key}
                                onChange={(e) => setData('user_kie_api_key', e.target.value)}
                                placeholder="sk-..."
                                className="w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white focus:ring-yellow-500 transition-all"
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                            <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1 mb-2">
                                <HelpCircle size={14} /> 如何申請？
                            </h4>
                            <ol className="text-xs text-blue-600 dark:text-blue-300 space-y-1 list-decimal ml-4">
                                <li>註冊 <a href="https://kie.ai" target="_blank" className="underline font-bold">Kie.ai 官網</a>。</li>
                                <li>進入 Dashboard ➔ API Keys。</li>
                                <li>點擊「Create New Key」並複製到此處。</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Analysis Settings */}
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-6">
                    <h3 className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2">
                        <BrainCircuit size={16} /> 爆紅分析模型
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">選擇分析引擎</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'minimax', label: 'MiniMax (預設免費)' },
                                    { id: 'openai', label: 'ChatGPT-4o' },
                                    { id: 'anthropic', label: 'Claude 3.5' }
                                ].map((prov) => (
                                    <button
                                        key={prov.id}
                                        type="button"
                                        onClick={() => setData('analysis_model_provider', prov.id)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${data.analysis_model_provider === prov.id ? 'bg-yellow-400 text-black border-yellow-400 shadow-sm' : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-white/10 text-gray-500'}`}
                                    >
                                        {prov.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {data.analysis_model_provider === 'openai' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">OpenAI API Key</label>
                                <input
                                    type="password"
                                    value={data.user_openai_api_key}
                                    onChange={(e) => setData('user_openai_api_key', e.target.value)}
                                    placeholder="sk-..."
                                    className="w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white focus:ring-yellow-500 transition-all"
                                />
                                <a href="https://platform.openai.com/api-keys" target="_blank" className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-yellow-500 transition-colors">
                                    前往 OpenAI 申請 <ExternalLink size={12} />
                                </a>
                            </div>
                        )}

                        {data.analysis_model_provider === 'anthropic' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Anthropic API Key</label>
                                <input
                                    type="password"
                                    value={data.user_anthropic_api_key}
                                    onChange={(e) => setData('user_anthropic_api_key', e.target.value)}
                                    placeholder="sk-ant-..."
                                    className="w-full rounded-xl border-gray-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white focus:ring-yellow-500 transition-all"
                                />
                                <a href="https://console.anthropic.com/settings/keys" target="_blank" className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-yellow-500 transition-colors">
                                    前往 Anthropic 申請 <ExternalLink size={12} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        儲存 API 設定
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 dark:text-green-400 font-bold">✓ 設定已更新</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
