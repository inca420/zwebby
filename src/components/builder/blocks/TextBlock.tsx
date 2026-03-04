import { BlockLayout } from '../types';

export default function TextBlock({ content, layout, onChange }: { content: string, layout?: BlockLayout, onChange: (c: string) => void }) {

    // Evaluate Padding
    let paddingClass = 'py-8'; // Default medium
    if (layout?.paddingY === 'none') paddingClass = 'py-0';
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
            className={`w-full text-gray-900 resize-none outline-none bg-transparent ${paddingClass} ${alignClass}`}
            rows={Math.max(3, (content || '').split('\n').length)}
            placeholder="Type your text here..."
        />
    );
}
