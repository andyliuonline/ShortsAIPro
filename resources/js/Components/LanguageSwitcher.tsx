import { useForm } from '@inertiajs/react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { post } = useForm();

    const languages = [
        { code: 'zh_TW', label: '繁體中文', flag: '🇹🇼' },
        { code: 'zh_CN', label: '简体中文', flag: '🇨🇳' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
    ];

    // Get current locale from HTML lang or session if available
    const currentLocale = document.documentElement.lang === 'zh-Hant' ? 'zh_TW' : 
                         (document.documentElement.lang === 'zh-Hans' ? 'zh_CN' : 
                         (document.documentElement.lang === 'es' ? 'es' : 'en'));

    const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

    const handleLanguageChange = (code: string) => {
        post(route('language.switch', { locale: code }), {
            preserveScroll: true,
            onSuccess: () => setIsOpen(false)
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all group"
            >
                <span className="text-sm">{currentLang.flag}</span>
                <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">{currentLang.code.split('_')[0]}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${currentLocale === lang.code ? 'bg-yellow-400 text-black' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm">{lang.flag}</span>
                                    <span className="text-xs font-bold">{lang.label}</span>
                                </div>
                                {currentLocale === lang.code && <Check size={14} className="text-black" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
