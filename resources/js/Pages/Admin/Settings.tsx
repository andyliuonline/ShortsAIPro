import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Settings as SettingsIcon, ShieldAlert, Save, Key, CreditCard, Receipt } from "lucide-react";

export default function AdminSettings({ settings }: any) {
    // Initial values for the form
    const initialData: any = {};
    Object.values(settings).forEach((group: any) => {
        group.forEach((s: any) => {
            initialData[s.key] = s.value || "";
        });
    });

    const { data, setData, post, processing } = useForm(initialData);

    const submit = (e: any) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            onSuccess: () => alert('系統設定已儲存')
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-200">系統參數設定</h2>}
        >
            <Head title="System Settings" />

            <div className="py-12 text-white">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-8">
                        {/* NewebPay Group */}
                        <SettingsGroup 
                            title="藍新金流設定" 
                            icon={<CreditCard className="text-yellow-400" />} 
                            settings={settings.payment} 
                            data={data} 
                            setData={setData} 
                        />

                        {/* Invoice Group */}
                        <SettingsGroup 
                            title="Giveme 發票設定" 
                            icon={<Receipt className="text-blue-400" />} 
                            settings={settings.invoice} 
                            data={data} 
                            setData={setData} 
                        />

                        {/* AI Group */}
                        <SettingsGroup 
                            title="AI 生成設定" 
                            icon={<Key className="text-green-400" />} 
                            settings={settings.ai} 
                            data={data} 
                            setData={setData} 
                        />

                        <div className="flex justify-end pt-6">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="bg-yellow-400 text-black px-10 py-4 rounded-2xl font-black text-lg hover:bg-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.2)] transition-all flex items-center gap-2"
                            >
                                {processing ? <Loader2 className="animate-spin" /> : <Save />}
                                儲存所有設定
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SettingsGroup({ title, icon, settings, data, setData }: any) {
    if (!settings) return null;
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex items-center gap-3">
                {icon}
                <h3 className="font-bold text-white">{title}</h3>
            </div>
            <div className="p-8 space-y-6">
                {settings.map((s: any) => (
                    <div key={s.key}>
                        <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">{s.description}</label>
                        <input 
                            type="text" 
                            value={data[s.key]}
                            onChange={e => setData(s.key, e.target.value)}
                            placeholder={`請輸入 ${s.description}`}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-6 text-zinc-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 outline-none transition-all"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Loader2(props: any) {
    return <SettingsIcon {...props} className={`animate-spin ${props.className}`} />
}
