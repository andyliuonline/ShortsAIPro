import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        const root = window.document.documentElement;
        
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        if (theme === 'system') {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    return (
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${theme === 'light' ? 'bg-white dark:bg-gray-700 text-yellow-500 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                title="亮色模式"
            >
                <Sun size={18} />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-700 text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                title="暗色模式"
            >
                <Moon size={18} />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${theme === 'system' ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                title="跟隨系統"
            >
                <Monitor size={18} />
            </button>
        </div>
    );
}
