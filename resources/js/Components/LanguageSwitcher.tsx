import { usePage, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function LanguageSwitcher() {
    const { locale }: any = usePage().props;

    const switchLanguage = (newLocale: string) => {
        axios.post(route('language.switch'), { locale: newLocale })
            .then(() => {
                window.location.reload();
            });
    };

    return (
        <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
            <button 
                onClick={() => switchLanguage('zh_TW')}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${locale === 'zh_TW' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                中
            </button>
            <button 
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${locale === 'en' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                EN
            </button>
        </div>
    );
}
