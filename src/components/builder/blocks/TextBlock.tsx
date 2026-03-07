import { BlockLayout } from '../types';

export default function TextBlock({ content, layout, onChange, viewport = 'desktop' }: { content: any, layout?: BlockLayout, onChange: (c: any) => void, viewport?: 'desktop' | 'tablet' | 'mobile' }) {

    let paddingClass = layout?.paddingY === 'none' ? 'p-0' : layout?.paddingY === 'small' ? 'py-4' : layout?.paddingY === 'large' ? 'py-16' : 'py-8';
    if (layout?.paddingY === 'small') paddingClass = 'py-4';
    if (layout?.paddingY === 'large') paddingClass = 'py-16';
    if (layout?.paddingY === 'xlarge') paddingClass = 'py-24';

    // Evaluate Alignment
    let alignClass = 'text-left'; // default
    if (layout?.alignment === 'center') alignClass = 'text-center';
    if (layout?.alignment === 'right') alignClass = 'text-right';

    return (
        <textarea
            value={content || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full text-inherit resize-none outline-none bg-transparent ${paddingClass} ${alignClass}`}
            rows={Math.max(3, (content || '').split('\n').length)}
            placeholder="Type your text here..."
        />
    );
}
