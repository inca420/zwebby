import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Block, BlockLayout, WebsiteSettings } from '@/components/builder/types';

export default async function PublishedSitePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the website without needing authentication! Public route.
    const { data: website } = await supabase
        .from('websites')
        .select('*')
        .eq('id', id)
        .single();

    if (!website) {
        notFound();
    }

    const isLegacy = Array.isArray(website.content);
    const blocks: Block[] = isLegacy ? website.content : (website.content?.blocks || []);
    const settings: WebsiteSettings = isLegacy ? {} : (website.content?.settings || {});

    const getWidthClass = (width?: string) => {
        if (width === 'narrow') return 'max-w-2xl';
        if (width === 'wide') return 'max-w-6xl';
        if (width === 'full') return 'max-w-full';
        return 'max-w-4xl'; // Default auto
    };

    const themeStyle = `
        :root {
            --brand-primary: ${settings.primaryColor || '#000000'};
            --brand-font: '${settings.font || 'Inter'}', sans-serif;
        }
    `;

    return (
        <main className="min-h-screen" style={{ fontFamily: 'var(--brand-font)' }}>
            <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
            {blocks.map((block) => {
                const layout = block.layout;
                const widthClass = getWidthClass(layout?.width);

                if (block.type === 'hero') {
                    let paddingClass = 'py-12';
                    if (layout?.paddingY === 'none') paddingClass = 'py-0';
                    if (layout?.paddingY === 'small') paddingClass = 'py-6';
                    if (layout?.paddingY === 'large') paddingClass = 'py-24';
                    if (layout?.paddingY === 'xlarge') paddingClass = 'py-32';

                    let alignClass = 'text-center';
                    if (layout?.alignment === 'left') alignClass = 'text-left';
                    if (layout?.alignment === 'right') alignClass = 'text-right';

                    return (
                        <div key={block.id} className="w-full bg-gray-50">
                            <div className={`mx-auto px-4 ${widthClass} ${paddingClass} ${alignClass}`}>
                                <h1 className="text-5xl font-extrabold mb-6" style={{ color: 'var(--brand-primary)' }}>{block.content?.heading || ''}</h1>
                                <p className="text-xl text-gray-600 leading-relaxed">{block.content?.subheading || ''}</p>
                            </div>
                        </div>
                    );
                }

                if (block.type === 'text') {
                    let paddingClass = 'py-8';
                    if (layout?.paddingY === 'none') paddingClass = 'py-0';
                    if (layout?.paddingY === 'small') paddingClass = 'py-4';
                    if (layout?.paddingY === 'large') paddingClass = 'py-16';
                    if (layout?.paddingY === 'xlarge') paddingClass = 'py-24';

                    let alignClass = 'text-left';
                    if (layout?.alignment === 'center') alignClass = 'text-center';
                    if (layout?.alignment === 'right') alignClass = 'text-right';

                    return (
                        <div key={block.id} className={`mx-auto px-6 ${widthClass} ${paddingClass} ${alignClass}`}>
                            <p className="text-lg text-gray-800 whitespace-pre-wrap">{block.content}</p>
                        </div>
                    );
                }

                if (block.type === 'feature') {
                    let paddingClass = 'py-8';
                    if (layout?.paddingY === 'none') paddingClass = 'py-0';
                    if (layout?.paddingY === 'small') paddingClass = 'py-4';
                    if (layout?.paddingY === 'large') paddingClass = 'py-16';
                    if (layout?.paddingY === 'xlarge') paddingClass = 'py-24';

                    let alignClass = 'text-center';
                    if (layout?.alignment === 'left') alignClass = 'text-left';
                    if (layout?.alignment === 'right') alignClass = 'text-right';

                    const features = block.content?.features || [];

                    return (
                        <div key={block.id} className={`w-full px-6 ${paddingClass}`}>
                            <div className={`mx-auto flex flex-col md:flex-row items-start gap-12 w-full ${widthClass} ${layout?.alignment === 'left' ? 'justify-start' : layout?.alignment === 'right' ? 'justify-end' : 'justify-center'}`}>
                                {features.map((feature: any, i: number) => (
                                    <div key={i} className={`flex-1 min-w-[200px] ${alignClass}`}>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                if (block.type === 'image') {
                    const imageUrl = typeof block.content === 'string' ? block.content : block.content?.url;
                    const caption = typeof block.content === 'string' ? null : block.content?.caption;

                    let paddingClass = 'py-4';
                    if (layout?.paddingY === 'none') paddingClass = 'py-0';
                    if (layout?.paddingY === 'medium') paddingClass = 'py-8';
                    if (layout?.paddingY === 'large') paddingClass = 'py-16';
                    if (layout?.paddingY === 'xlarge') paddingClass = 'py-24';

                    if (!imageUrl) return null;

                    return (
                        <div key={block.id} className={`mx-auto px-6 ${widthClass} ${paddingClass}`}>
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageUrl} alt="" className="w-full h-auto block" />
                                {caption && (
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-3 text-center backdrop-blur-sm">
                                        {caption}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </main>
    );
}
