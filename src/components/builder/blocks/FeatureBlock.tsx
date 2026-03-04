import { LayoutGrid } from 'lucide-react';
import { BlockLayout } from '../types';

export default function FeatureBlock({ content, layout, onChange }: { content: any, layout?: BlockLayout, onChange: (c: any) => void }) {
    const features = content?.features || [
        { title: 'Feature 1', description: 'Description here' },
        { title: 'Feature 2', description: 'Description here' },
        { title: 'Feature 3', description: 'Description here' },
    ];

    const updateFeature = (index: number, key: 'title' | 'description', value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [key]: value };
        onChange({ ...content, features: newFeatures });
    };

    // Evaluate Padding
    let paddingClass = 'py-8'; // Default medium
    if (layout?.paddingY === 'none') paddingClass = 'py-0';
    if (layout?.paddingY === 'small') paddingClass = 'py-4';
    if (layout?.paddingY === 'large') paddingClass = 'py-16';
    if (layout?.paddingY === 'xlarge') paddingClass = 'py-24';

    // Evaluate Alignment
    let alignClass = 'text-center'; // Default center
    if (layout?.alignment === 'left') alignClass = 'text-left';
    if (layout?.alignment === 'right') alignClass = 'text-right';

    return (
        <div className={paddingClass}>
            <div className={`flex items-center gap-2 mb-8 ${layout?.alignment === 'left' ? 'justify-start' : layout?.alignment === 'right' ? 'justify-end' : 'justify-center'} text-gray-400`}>
                <LayoutGrid className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                <span className="text-sm font-medium uppercase tracking-wider">Features</span>
            </div>
            <div className={`flex flex-col md:flex-row ${layout?.alignment === 'left' ? 'justify-start' : layout?.alignment === 'right' ? 'justify-end' : 'justify-center'} items-start gap-12 w-full max-w-5xl mx-auto`}>
                {features.map((feature: any, i: number) => (
                    <div key={i} className={`flex-1 min-w-[200px] ${alignClass}`}>
                        <input
                            value={feature.title}
                            onChange={(e) => updateFeature(i, 'title', e.target.value)}
                            className={`font-bold text-lg text-gray-900 w-full outline-none bg-transparent mb-2 ${alignClass}`}
                        />
                        <textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(i, 'description', e.target.value)}
                            className={`text-gray-500 text-sm w-full outline-none bg-transparent resize-none ${alignClass}`}
                            rows={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
