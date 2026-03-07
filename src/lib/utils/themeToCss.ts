import { WebsiteSettings } from "@/components/builder/types";

export function getThemeStylesheet(settings: WebsiteSettings): string {
    const radiusMap: Record<string, string> = {
        'none': '0px',
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px'
    };

    const radiusValue = radiusMap[settings.borderRadius || 'md'];

    // Map Card Styles
    let cardShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
    let cardBorder = '1px solid var(--brand-secondary)';
    let cardBg = 'var(--brand-bg)';
    let cardBackdrop = 'none';

    switch (settings.cardStyle) {
        case 'flat':
            cardShadow = 'none';
            cardBorder = '1px solid var(--brand-secondary)';
            break;
        case 'brutal':
            cardShadow = '4px 4px 0px 0px var(--brand-text)';
            cardBorder = '2px solid var(--brand-text)';
            break;
        case 'glass':
            cardShadow = '0 8px 32px 0 rgba(0,0,0,0.1)';
            cardBorder = '1px solid rgba(255,255,255,0.1)';
            cardBg = 'rgba(255, 255, 255, 0.05)';
            // If dark mode text, it's a dark theme, use a darker glass
            if (settings.backgroundColor === '#0f172a' || settings.backgroundColor === '#000000') {
                cardBg = 'rgba(255, 255, 255, 0.05)';
            } else {
                cardBg = 'rgba(255, 255, 255, 0.4)';
                cardBorder = '1px solid rgba(255,255,255,0.4)';
            }
            cardBackdrop = 'blur(12px)';
            break;
        case 'shadow':
        default:
            break;
    }

    // Map Button Styles
    let btnBg = 'var(--brand-primary)';
    let btnText = '#ffffff'; // Assuming light text on primary by default
    let btnBorder = '2px solid transparent';
    let btnBackdrop = 'none';

    switch (settings.buttonStyle) {
        case 'outline':
            btnBg = 'transparent';
            btnText = 'var(--brand-primary)';
            btnBorder = '2px solid var(--brand-primary)';
            break;
        case 'glass':
            btnBg = 'rgba(255, 255, 255, 0.1)';
            btnText = 'var(--brand-text)';
            btnBorder = '1px solid rgba(255,255,255,0.2)';
            btnBackdrop = 'blur(10px)';
            break;
        case 'solid':
        default:
            break; // Keep standard variables
    }

    return `
        :root {
            --brand-primary: ${settings.primaryColor || '#000000'};
            --brand-secondary: ${settings.secondaryColor || '#f3f4f6'};
            --brand-accent: ${settings.accentColor || '#3b82f6'};
            --brand-bg: ${settings.backgroundColor || '#ffffff'};
            --brand-text: ${settings.textColor || '#111827'};
            --brand-font: '${settings.font || 'Inter'}', sans-serif;
            
            --brand-radius: ${radiusValue};
            
            --card-shadow: ${cardShadow};
            --card-border: ${cardBorder};
            --card-bg: ${cardBg};
            --card-backdrop: ${cardBackdrop};
            
            --btn-bg: ${btnBg};
            --btn-text: ${btnText};
            --btn-border: ${btnBorder};
            --btn-backdrop: ${btnBackdrop};
        }
        
        .theme-card {
            background-color: var(--card-bg);
            border: var(--card-border);
            box-shadow: var(--card-shadow);
            backdrop-filter: var(--card-backdrop);
            border-radius: var(--brand-radius);
            transition: all 0.3s ease;
        }
        
        .theme-button {
            background-color: var(--btn-bg);
            color: var(--btn-text);
            border: var(--btn-border);
            backdrop-filter: var(--btn-backdrop);
            border-radius: var(--brand-radius);
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .theme-button:hover {
            opacity: 0.9;
        }
    `;
}
