import { BlockLayout } from '../types';

export default function HeroBlock({ content, layout, onChange }: { content: any, layout?: BlockLayout, onChange: (c: any) => void }) {

    // Evaluate Padding
    let paddingClass = 'py-12'; // Default medium
    if (layout?.paddingY === 'none') paddingClass = 'py-0';
    if (layout?.paddingY === 'small') paddingClass = 'py-6';
    if (layout?.paddingY === 'large') paddingClass = 'py-24';
    if (layout?.paddingY === 'xlarge') paddingClass = 'py-32';

    // Evaluate Alignment
    let alignClass = 'text-center'; // Hero default
    if (layout?.alignment === 'left') alignClass = 'text-left';
    if (layout?.alignment === 'right') alignClass = 'text-right';

    return (
        <div className={`px-4 ${paddingClass} ${alignClass}`}>
            <input
                type="text"
                value={content?.heading || ''}
                onChange={(e) => onChange({ ...content, heading: e.target.value })}
                placeholder="Hero Heading"
                className={`text-4xl font-extrabold w-full outline-none bg-transparent mb-4 placeholder:text-gray-300 ${alignClass}`}
                style={{ color: 'var(--brand-primary)' }}
            />
            <textarea
                value={content?.subheading || ''}
                onChange={(e) => onChange({ ...content, subheading: e.target.value })}
                placeholder="Subheading..."
                className={`text-lg text-gray-500 w-full outline-none bg-transparent resize-none overflow-hidden placeholder:text-gray-300 ${alignClass}`}
                rows={2}
            />
        </div>
    );
}
