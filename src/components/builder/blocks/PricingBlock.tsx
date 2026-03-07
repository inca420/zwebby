import { CheckCircle2, CreditCard } from 'lucide-react';
import { BlockLayout } from '../types';

export default function PricingBlock({ content, layout, onChange, viewport = 'desktop' }: { content: any, layout?: BlockLayout, onChange: (content: any) => void, viewport?: 'desktop' | 'tablet' | 'mobile' }) {
    const plans = content?.plans || [
        { name: 'Starter', price: '$9', interval: '/mo', features: ['1 User', 'Basic Analytics', 'Community Support'], isPopular: false },
        { name: 'Pro', price: '$29', interval: '/mo', features: ['5 Users', 'Advanced Analytics', 'Priority Support'], isPopular: true },
        { name: 'Enterprise', price: '$99', interval: '/mo', features: ['Unlimited Users', 'Custom Reporting', '24/7 Phone Support'], isPopular: false },
    ];

    const paddingClass = 'py-24';
    const isMobileView = viewport !== 'desktop';

    const updatePlan = (index: number, key: string, value: any) => {
        const newPlans = [...plans];
        newPlans[index] = { ...newPlans[index], [key]: value };
        onChange({ ...content, plans: newPlans });
    };

    return (
        <div className={`w-full ${paddingClass} bg-[var(--brand-bg)]`}>
            <div className="flex items-center gap-2 mb-16 justify-center text-inherit opacity-60">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Pricing</span>
            </div>

            <div className={`grid gap-8 max-w-6xl mx-auto px-6 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                {plans.map((plan: any, index: number) => (
                    <div key={index} className={`theme-card relative p-8 flex flex-col ${plan.isPopular ? 'md:scale-105 border-2 border-[var(--brand-accent)]' : ''}`}>
                        {plan.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--brand-accent)] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                Most Popular
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                value={plan.name}
                                onChange={(e) => updatePlan(index, 'name', e.target.value)}
                                className="text-xl font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 w-full text-center"
                                style={{ color: 'var(--brand-primary)' }}
                                placeholder="Plan Name"
                            />
                        </div>

                        <div className="flex items-end justify-center gap-1 mb-8">
                            <input
                                type="text"
                                value={plan.price}
                                onChange={(e) => updatePlan(index, 'price', e.target.value)}
                                className="text-5xl font-extrabold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 w-24 text-center"
                                style={{ color: 'var(--brand-text)' }}
                                placeholder="$X"
                            />
                            <input
                                type="text"
                                value={plan.interval}
                                onChange={(e) => updatePlan(index, 'interval', e.target.value)}
                                className="text-gray-500 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 w-16"
                                placeholder="/mo"
                            />
                        </div>

                        <ul className="flex flex-col gap-4 mb-8 flex-1">
                            {plan.features.map((feature: string, fIndex: number) => (
                                <li key={fIndex} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-accent)] shrink-0 mt-0.5" />
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => {
                                            const newFeatures = [...plan.features];
                                            newFeatures[fIndex] = e.target.value;
                                            updatePlan(index, 'features', newFeatures);
                                        }}
                                        className="text-gray-600 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                                        placeholder="Feature description"
                                    />
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-4 rounded-lg font-bold transition-all ${plan.isPopular ? 'theme-button' : 'border-2 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white'}`} style={plan.isPopular ? {} : { borderColor: 'var(--brand-primary)' }}>
                            Get Started
                        </button>

                        <label className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400 cursor-pointer">
                            <input type="checkbox" checked={plan.isPopular} onChange={(e) => updatePlan(index, 'isPopular', e.target.checked)} className="rounded text-blue-500 focus:ring-0" />
                            Mark as Popular
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
