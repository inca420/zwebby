import { BlockLayout } from '../types';

export default function HeroBlock({ content, layout, onChange, viewport = 'desktop' }: { content: any, layout?: BlockLayout, onChange: (c: any) => void, viewport?: 'desktop' | 'tablet' | 'mobile' }) {

    // Evaluate Padding
    let paddingClass = 'py-24';
    if (layout?.paddingY === 'none') paddingClass = 'py-0';
    if (layout?.paddingY === 'small') paddingClass = 'py-6';
    if (layout?.paddingY === 'large') paddingClass = 'py-24';
    if (layout?.paddingY === 'xlarge') paddingClass = 'py-32';

    // Evaluate Alignment
    let alignClass = 'text-center items-center'; // Default center
    if (layout?.alignment === 'left') alignClass = 'text-left items-start';
    if (layout?.alignment === 'right') alignClass = 'text-right items-end';

    const isMobileView = viewport !== 'desktop';
    const isSplit = layout?.variant === 'split' && !isMobileView;

    // Optional gradient handling (just applies to all modern headers for now)
    const textGradientClass = "bg-clip-text text-transparent bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)]";

    return (
        <div className={`w-full ${paddingClass}`}>
            <div className={`max-w-6xl mx-auto flex ${isSplit ? 'flex-row items-center gap-12' : `flex-col ${isMobileView ? 'text-center items-center' : alignClass} gap-6`}`}>

                {/* Text Content Area */}
                <div className={`flex flex-col gap-6 ${isSplit ? 'w-1/2 items-start text-left' : 'w-full w-full max-w-4xl'}`}>
                    <textarea
                        value={content?.heading || ''}
                        onChange={(e) => onChange({ ...content, heading: e.target.value })}
                        className={`text-6xl font-extrabold w-full outline-none bg-transparent placeholder:text-inherit placeholder:opacity-50 ${isSplit ? 'text-left' : isMobileView ? 'text-center' : alignClass} ${textGradientClass}`}
                        rows={isSplit ? 3 : 1}
                        placeholder="Hero Heading"
                    />
                    <textarea
                        value={content?.subheading || ''}
                        onChange={(e) => onChange({ ...content, subheading: e.target.value })}
                        className={`text-xl text-gray-600 dark:text-gray-300 opacity-90 w-full outline-none bg-transparent resize-none overflow-hidden placeholder:text-inherit placeholder:opacity-50 ${isSplit ? 'text-left' : isMobileView ? 'text-center' : alignClass}`}
                        rows={isSplit ? 4 : 2}
                        placeholder="Hero Subheading"
                    />
                    {/* Placeholder for future buttons */}
                    <div className="flex gap-4 mt-2">
                        <button className="theme-button px-8 py-3 rounded-md text-sm font-medium">Get Started</button>
                        <button className="px-8 py-3 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">Learn More</button>
                    </div>
                </div>

                {/* Optional Image Area for Split Layout */}
                {isSplit && (
                    <div className="w-1/2 flex justify-end">
                        <div className="w-full aspect-square md:aspect-[4/3] rounded-2xl theme-card flex items-center justify-center p-8 bg-gradient-to-tr from-gray-50 to-gray-100 overflow-hidden relative border shadow-2xl shadow-[var(--brand-primary)]/10">
                            {content?.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={content.imageUrl} alt="Hero mock" className="object-cover w-full h-full rounded-xl shadow-sm" />
                            ) : (
                                <div className="text-gray-400 font-medium tracking-wide flex flex-col items-center gap-2">
                                    <span className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">✨</span>
                                    <span>AI Placeholder Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
