import { usePage } from '@inertiajs/react';

export const useTranslate = () => {
    const { translations }: any = usePage().props;

    const t = (key: string, replacements: any = {}) => {
        let translation = translations.ui[key] || key;

        Object.keys(replacements).forEach((r) => {
            translation = translation.replace(`:${r}`, replacements[r]);
        });

        return translation;
    };

    return { t };
};
