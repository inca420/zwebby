import { LayoutGrid } from 'lucide-react';
import { BlockLayout } from '../types';

export default function FeatureBlock({ content, layout, onChange, viewport = 'desktop' }: { content: any, layout?: BlockLayout, onChange: (content: any) => void, viewport?: 'desktop' | 'tablet' | 'mobile' }) {
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
    let paddingClass = 'py-16';
    if (layout?.paddingY === 'none') paddingClass = 'py-0';
    if (layout?.paddingY === 'small') paddingClass = 'py-8';
    if (layout?.paddingY === 'large') paddingClass = 'py-24';
    if (layout?.paddingY === 'xlarge') paddingClass = 'py-32';

    const isMobileView = viewport !== 'desktop';
    const isBento = layout?.variant === 'bento';

    // Evaluate Alignment
    let alignClass = 'text-center'; // Default center
    if (layout?.alignment === 'left') alignClass = 'text-left';
    if (layout?.alignment === 'right') alignClass = 'text-right';

    return (
        <div className={`w-full ${paddingClass}`}>
            <div className={`flex items-center gap-2 mb-12 ${layout?.alignment === 'left' ? 'justify-start' : layout?.alignment === 'right' ? 'justify-end' : 'justify-center'} text-inherit opacity-60`}>
                <LayoutGrid className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Features</span>
            </div>
            {/* Features Grid */}
            <div className={`grid gap-8 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} ${isBento ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto'}`}>
                {content?.features ? (
                    content.features.map((feature: any, index: number) => (
                        <div key={index} className={`flex flex-col gap-4 ${isBento ? 'theme-card p-8' : ''} ${isMobileView ? 'items-center text-center' : isBento ? 'items-start text-left' : 'items-center text-center'}`}>
                            {/* Icon Placeholder */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center opacity-80 ${isBento ? 'mb-4 shadow-sm' : ''}`} style={{ backgroundColor: 'var(--brand-accent)', color: '#ffffff' }}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div className="flex-1 w-full flex flex-col items-center">
                                <input
                                    type="text"
                                    value={feature.title || ''}
                                    onChange={(e) => {
                                        const newFeatures = [...content.features];
                                        newFeatures[index].title = e.target.value;
                                        onChange({ ...content, features: newFeatures });
                                    }}
                                    className={`w-full text-xl font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded placeholder-inherit ${isMobileView ? 'text-center' : isBento ? 'text-left' : 'text-center'} transition-colors`}
                                    style={{ color: 'var(--brand-text)' }}
                                    placeholder="Feature Title"
                                />
                                <textarea
                                    value={feature.description || ''}
                                    onChange={(e) => {
                                        const newFeatures = [...content.features];
                                        newFeatures[index].description = e.target.value;
                                        onChange({ ...content, features: newFeatures });
                                    }}
                                    className={`w-full mt-3 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded resize-none overflow-hidden opacity-70 ${isMobileView ? 'text-center' : isBento ? 'text-left' : 'text-center'} transition-colors`}
                                    style={{ color: 'inherit' }}
                                    placeholder="Describe this feature..."
                                    rows={isBento ? 4 : 3}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No features defined. Add some features!</p>
                )}
            </div>
        </div>
    );
}
