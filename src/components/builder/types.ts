export type BlockType = 'text' | 'hero' | 'feature' | 'image';

export type BlockLayout = {
    width?: 'auto' | 'full' | 'wide' | 'narrow';
    paddingY?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
    alignment?: 'left' | 'center' | 'right';
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
};

export type WebsiteContent = {
    blocks: Block[];
    settings: WebsiteSettings;
};
