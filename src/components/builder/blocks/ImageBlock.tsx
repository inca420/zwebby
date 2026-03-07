import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { BlockLayout } from '../types';

export default function ImageBlock({ content, layout, onChange, viewport = 'desktop' }: { content: any, layout?: BlockLayout, onChange: (c: any) => void, viewport?: 'desktop' | 'tablet' | 'mobile' }) {
    const url = typeof content === 'string' ? content : content?.url || '';
    const alt = content?.alt || '';
    const caption = typeof content === 'string' ? null : content?.caption;

    // Evaluate Padding
    let paddingClass = 'py-4'; // Default small for images
    if (layout?.paddingY === 'none') paddingClass = 'py-0';
    if (layout?.paddingY === 'medium') paddingClass = 'py-8';
    if (layout?.paddingY === 'large') paddingClass = 'py-16';
    if (layout?.paddingY === 'xlarge') paddingClass = 'py-24';

    if (!url) {
        return (
            <div className={paddingClass}>
                <div className="w-full h-64 bg-black/5 border-2 border-dashed border-black/10 rounded-xl flex flex-col items-center justify-center text-inherit opacity-40">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <p className="text-sm">Click here to add an image</p>
                    <p className="text-xs mt-1">Select this block and use the AI Generator to create an image.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={paddingClass}>
            <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Generated block" className="w-full h-auto block" />
                {caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-2 text-center backdrop-blur-sm">
                        {caption}
                    </div>
                )}
            </div>
        </div>
    );
}
