import { Quote } from 'lucide-react';
import { BlockLayout } from '../types';

export default function TestimonialBlock({ content, layout, onChange, viewport = 'desktop' }: { content: any, layout?: BlockLayout, onChange: (content: any) => void, viewport?: 'desktop' | 'tablet' | 'mobile' }) {
    const testimonials = content?.testimonials || [
        { quote: 'This product changed my life!', author: 'Jane Doe', role: 'CEO at Company' },
        { quote: 'Incredible service, highly recommended.', author: 'John Smith', role: 'CTO at Startup' },
    ];

    const paddingClass = 'py-16';
    const isMobileView = viewport !== 'desktop';
    const isBento = layout?.variant === 'bento';

    return (
        <div className={`w-full ${paddingClass}`}>
            <div className="flex items-center gap-2 mb-12 justify-center text-inherit opacity-60">
                <Quote className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Testimonials</span>
            </div>

            <div className={`grid gap-8 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} max-w-5xl mx-auto`}>
                {testimonials.map((testi: any, index: number) => (
                    <div key={index} className={`theme-card p-10 flex flex-col gap-6 relative ${isBento ? 'outline outline-1 outline-[var(--brand-primary)] outline-offset-4' : ''}`}>
                        <Quote className="w-8 h-8 text-[var(--brand-accent)] opacity-50 absolute top-8 left-8" />

                        <textarea
                            value={testi.quote || ''}
                            onChange={(e) => {
                                const newT = [...testimonials];
                                newT[index].quote = e.target.value;
                                onChange({ ...content, testimonials: newT });
                            }}
                            className="w-full text-xl lg:text-2xl font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded resize-none overflow-hidden placeholder-inherit z-10 pt-8"
                            style={{ color: 'var(--brand-text)' }}
                            placeholder="A compelling quote..."
                            rows={3}
                        />

                        <div className="flex items-center gap-4 mt-auto">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 shadow-inner flex items-center justify-center text-gray-400 font-bold overflow-hidden">
                                {testi.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={testi.avatarUrl} alt={testi.author} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="opacity-50 text-xs">AI</span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    value={testi.author || ''}
                                    onChange={(e) => {
                                        const newT = [...testimonials];
                                        newT[index].author = e.target.value;
                                        onChange({ ...content, testimonials: newT });
                                    }}
                                    className="font-bold bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded text-sm placeholder-inherit"
                                    style={{ color: 'var(--brand-text)' }}
                                    placeholder="Author Name"
                                />
                                <input
                                    type="text"
                                    value={testi.role || ''}
                                    onChange={(e) => {
                                        const newT = [...testimonials];
                                        newT[index].role = e.target.value;
                                        onChange({ ...content, testimonials: newT });
                                    }}
                                    className="text-sm opacity-70 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded placeholder-inherit"
                                    style={{ color: 'inherit' }}
                                    placeholder="Job Title"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
