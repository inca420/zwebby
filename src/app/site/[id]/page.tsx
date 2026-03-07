import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Block, BlockLayout, WebsiteSettings } from '@/components/builder/types';
import NavbarBlock from '@/components/builder/blocks/NavbarBlock';
import FooterBlock from '@/components/builder/blocks/FooterBlock';
import { getThemeStylesheet } from '@/lib/utils/themeToCss';
import { Quote, CreditCard, CheckCircle2 } from 'lucide-react';

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

    const themeStyle = getThemeStylesheet(settings);

    return (
        <main className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--brand-font)' }}>
            <style dangerouslySetInnerHTML={{ __html: themeStyle }} />

            {settings.showNavbar !== false && (
                <NavbarBlock settings={settings} isBuilder={false} />
            )}

            <div className="flex-1">
                {blocks.map((block) => {
                    const layout = block.layout;
                    const widthClass = getWidthClass(layout?.width);

                    if (block.type === 'hero') {
                        let paddingClass = 'py-24';
                        if (layout?.paddingY === 'none') paddingClass = 'py-0';
                        if (layout?.paddingY === 'small') paddingClass = 'py-6';
                        if (layout?.paddingY === 'large') paddingClass = 'py-24';
                        if (layout?.paddingY === 'xlarge') paddingClass = 'py-32';

                        let alignClass = 'text-center items-center';
                        if (layout?.alignment === 'left') alignClass = 'text-left items-start';
                        if (layout?.alignment === 'right') alignClass = 'text-right items-end';

                        const isSplit = layout?.variant === 'split';
                        const textGradientClass = "bg-clip-text text-transparent bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)]";

                        return (
                            <div key={block.id} className={`w-full ${paddingClass}`}>
                                <div className={`max-w-6xl mx-auto flex ${isSplit ? 'flex-col md:flex-row items-center gap-12 px-6' : `flex-col ${alignClass} gap-6 px-6`}`}>
                                    <div className={`flex flex-col gap-6 w-full ${isSplit ? 'md:w-1/2 items-start text-left' : 'max-w-4xl'}`}>
                                        <h1 className={`text-6xl font-extrabold ${isSplit ? 'text-left' : alignClass} ${textGradientClass}`}>
                                            {block.content?.heading || ''}
                                        </h1>
                                        <p className={`text-xl text-gray-600 dark:text-gray-300 opacity-90 leading-relaxed ${isSplit ? 'text-left' : alignClass}`}>
                                            {block.content?.subheading || ''}
                                        </p>
                                        <div className="flex gap-4 mt-2">
                                            <button className="theme-button px-8 py-3 rounded-md text-sm font-medium">Get Started</button>
                                            <button className="px-8 py-3 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">Learn More</button>
                                        </div>
                                    </div>
                                    {isSplit && (
                                        <div className="w-full md:w-1/2 flex justify-end mt-8 md:mt-0">
                                            <div className="w-full aspect-square md:aspect-[4/3] rounded-2xl theme-card flex items-center justify-center p-8 bg-gradient-to-tr from-gray-50 to-gray-100 overflow-hidden relative border shadow-2xl shadow-[var(--brand-primary)]/10">
                                                {block.content?.imageUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={block.content.imageUrl} alt="Hero mock" className="object-cover w-full h-full rounded-xl shadow-sm" />
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
                        let paddingClass = 'py-16';
                        if (layout?.paddingY === 'none') paddingClass = 'py-0';
                        if (layout?.paddingY === 'small') paddingClass = 'py-8';
                        if (layout?.paddingY === 'large') paddingClass = 'py-24';
                        if (layout?.paddingY === 'xlarge') paddingClass = 'py-32';

                        let alignClass = 'text-center';
                        if (layout?.alignment === 'left') alignClass = 'text-left';
                        if (layout?.alignment === 'right') alignClass = 'text-right';

                        const isBento = layout?.variant === 'bento';
                        const features = block.content?.features || [];

                        return (
                            <div key={block.id} className={`w-full px-6 ${paddingClass}`}>
                                <div className={`grid gap-8 grid-cols-1 md:grid-cols-3 ${isBento ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto'}`}>
                                    {features.map((feature: any, index: number) => (
                                        <div key={index} className={`flex flex-col gap-4 ${isBento ? 'theme-card p-8 items-start text-left' : `items-center text-center ${alignClass}`}`}>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center opacity-80 ${isBento ? 'mb-4 shadow-sm' : ''}`} style={{ backgroundColor: 'var(--brand-accent)', color: '#ffffff' }}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 w-full flex flex-col items-center">
                                                <h3 className={`w-full text-xl font-bold ${isBento ? 'text-left' : alignClass}`} style={{ color: 'var(--brand-text)' }}>
                                                    {feature.title}
                                                </h3>
                                                <p className={`w-full mt-3 opacity-70 leading-relaxed ${isBento ? 'text-left' : alignClass}`} style={{ color: 'inherit' }}>
                                                    {feature.description}
                                                </p>
                                            </div>
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

                    if (block.type === 'testimonial') {
                        const testimonials = block.content?.testimonials || [];
                        const isBento = layout?.variant === 'bento';
                        return (
                            <div key={block.id} className="w-full py-16">
                                <div className="flex items-center gap-2 mb-12 justify-center text-inherit opacity-60">
                                    <Quote className="w-5 h-5" />
                                    <span className="text-sm font-medium uppercase tracking-wider">Testimonials</span>
                                </div>
                                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto px-6">
                                    {testimonials.map((testi: any, index: number) => (
                                        <div key={index} className={`theme-card p-10 flex flex-col gap-6 relative ${isBento ? 'outline outline-1 outline-[var(--brand-primary)] outline-offset-4' : ''}`}>
                                            <Quote className="w-8 h-8 text-[var(--brand-accent)] opacity-50 absolute top-8 left-8" />
                                            <p className="w-full text-xl md:text-2xl font-medium z-10 pt-8" style={{ color: 'var(--brand-text)' }}>
                                                {testi.quote}
                                            </p>
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
                                                    <span className="font-bold text-sm" style={{ color: 'var(--brand-text)' }}>{testi.author}</span>
                                                    <span className="text-sm opacity-70" style={{ color: 'inherit' }}>{testi.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    if (block.type === 'pricing') {
                        const plans = block.content?.plans || [];
                        return (
                            <div key={block.id} className="w-full py-24 bg-[var(--brand-bg)]">
                                <div className="flex items-center gap-2 mb-16 justify-center text-inherit opacity-60">
                                    <CreditCard className="w-5 h-5" />
                                    <span className="text-sm font-medium uppercase tracking-wider">Pricing</span>
                                </div>
                                <div className="grid gap-8 max-w-6xl mx-auto px-6 grid-cols-1 md:grid-cols-3">
                                    {plans.map((plan: any, index: number) => (
                                        <div key={index} className={`theme-card relative p-8 flex flex-col ${plan.isPopular ? 'md:scale-105 border-2 border-[var(--brand-accent)]' : ''}`}>
                                            {plan.isPopular && (
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--brand-accent)] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                                    Most Popular
                                                </div>
                                            )}
                                            <div className="flex justify-center items-center mb-4">
                                                <h3 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>{plan.name}</h3>
                                            </div>
                                            <div className="flex items-end justify-center gap-1 mb-8">
                                                <span className="text-5xl font-extrabold" style={{ color: 'var(--brand-text)' }}>{plan.price}</span>
                                                <span className="text-gray-500">{plan.interval}</span>
                                            </div>
                                            <ul className="flex flex-col gap-4 mb-8 flex-1">
                                                {plan.features.map((feature: string, fIndex: number) => (
                                                    <li key={fIndex} className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-[var(--brand-accent)] shrink-0 mt-0.5" />
                                                        <span className="text-gray-600">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button className={`w-full py-4 rounded-lg font-bold transition-all ${plan.isPopular ? 'theme-button' : 'border-2 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white'}`} style={plan.isPopular ? {} : { borderColor: 'var(--brand-primary)' }}>
                                                Get Started
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>

            {settings.showFooter !== false && (
                <FooterBlock settings={settings} isBuilder={false} />
            )}
        </main>
    );
}
