import { WebsiteSettings } from '@/components/builder/types';

export type ThemePreset = {
    id: string;
    name: string;
    settings: WebsiteSettings;
};

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: 'modern-minimalist',
        name: 'Modern Minimalist',
        settings: {
            font: 'Inter',
            primaryColor: '#000000',
            secondaryColor: '#f3f4f6', // gray-100
            accentColor: '#3b82f6', // blue-500
            backgroundColor: '#ffffff',
            textColor: '#111827', // gray-900
            borderRadius: 'none',
            cardStyle: 'flat',
            buttonStyle: 'solid'
        }
    },
    {
        id: 'biographical',
        name: 'Biographical',
        settings: {
            font: 'Playfair Display',
            primaryColor: '#7c2d12', // orange-900
            secondaryColor: '#fcd34d', // amber-300
            accentColor: '#1e3a8a', // blue-900
            backgroundColor: '#fefce8', // yellow-50 (warm off-white)
            textColor: '#431407', // orange-950 (deep brown)
            borderRadius: 'sm',
            cardStyle: 'shadow',
            buttonStyle: 'outline'
        }
    },
    {
        id: 'company-light',
        name: 'Company Light',
        settings: {
            font: 'Roboto',
            primaryColor: '#1d4ed8', // blue-700
            secondaryColor: '#e0f2fe', // sky-100
            accentColor: '#ea580c', // orange-600
            backgroundColor: '#ffffff',
            textColor: '#1f2937', // gray-800
            borderRadius: 'md',
            cardStyle: 'shadow',
            buttonStyle: 'solid'
        }
    },
    {
        id: 'company-dark',
        name: 'Company Dark',
        settings: {
            font: 'Inter',
            primaryColor: '#ffffff',
            secondaryColor: '#374151', // gray-700
            accentColor: '#f97316', // orange-500
            backgroundColor: '#0f172a', // slate-900
            textColor: '#f8fafc', // slate-50
            borderRadius: 'xl',
            cardStyle: 'glass',
            buttonStyle: 'solid'
        }
    },
    {
        id: 'product',
        name: 'Product',
        settings: {
            font: 'Inter',
            primaryColor: '#000000',
            secondaryColor: '#f1f5f9', // slate-100
            accentColor: '#10b981', // emerald-500
            backgroundColor: '#ffffff',
            textColor: '#0f172a', // slate-900
            borderRadius: '2xl',
            cardStyle: 'flat',
            buttonStyle: 'glass'
        }
    },
    {
        id: 'service',
        name: 'Service',
        settings: {
            font: 'Roboto',
            primaryColor: '#0f766e', // teal-700
            secondaryColor: '#ccfbf1', // teal-50
            accentColor: '#0ea5e9', // sky-500
            backgroundColor: '#f8fafc', // slate-50
            textColor: '#334155', // slate-700
            borderRadius: 'lg',
            cardStyle: 'shadow',
            buttonStyle: 'solid'
        }
    },
    {
        id: 'informational',
        name: 'Informational',
        settings: {
            font: 'Merriweather',
            primaryColor: '#1e40af', // blue-800
            secondaryColor: '#f3f4f6', // gray-100
            accentColor: '#14b8a6', // teal-500
            backgroundColor: '#fafafa', // neutral-50
            textColor: '#262626', // neutral-800
            borderRadius: 'md',
            cardStyle: 'flat',
            buttonStyle: 'outline'
        }
    }
];
