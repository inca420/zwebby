export type BlockType = 'text' | 'hero' | 'feature' | 'image' | 'testimonial' | 'pricing';

export type BlockLayout = {
    width?: 'auto' | 'full' | 'wide' | 'narrow';
    paddingY?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
    alignment?: 'left' | 'center' | 'right';
    variant?: string;
};

export type Block = {
    id: string;
    type: BlockType;
    content: any; // Flexible content structure
    layout?: BlockLayout;
};

export type WebsiteSettings = {
    font?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    logoUrl?: string;

    // Phase 7: Navigation & Structure
    showNavbar?: boolean;
    showFooter?: boolean;
    navigation?: { label: string; url: string }[];
    socialLinks?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
    };

    // Phase 9: Advanced Styling Tokens
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    cardStyle?: 'flat' | 'shadow' | 'glass' | 'brutal';
    buttonStyle?: 'solid' | 'outline' | 'glass';
};

export type WebsiteContent = {
    blocks: Block[];
    settings: WebsiteSettings;
};
