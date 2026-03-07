'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Loader2, LayoutTemplate, Briefcase, Type } from 'lucide-react';
import { THEME_PRESETS } from '@/lib/constants/themes';

const STEPS = [
    { title: 'Project Details', icon: LayoutTemplate },
    { title: 'Industry & Purpose', icon: Briefcase },
    { title: 'Theme & Tone', icon: Type }
];

export default function WizardForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        path: '',
        industry: '',
        purpose: '',
        themeId: 'modern-minimalist',
        tone: 'Professional'
    });

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/websites/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to generate website');
            }

            const { websiteId } = await response.json();
            router.push(`/site/${websiteId}/builder`);
        } catch (error) {
            console.error('Error generating site:', error);
            alert('There was an error generating your site. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Stepper */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    ></div>

                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isPast = index < currentStep;

                        return (
                            <div key={step.title} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center transition-colors ${isActive || isPast ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
                {currentStep === 0 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Let's start off strong</h2>
                            <p className="text-gray-500 mt-2">What are we calling this masterpiece?</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Acme Studio"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL Path</label>
                                <div className="flex bg-gray-50 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                                    <span className="px-4 py-3 text-gray-500 border-r bg-gray-100">zwebby.com/site/</span>
                                    <input
                                        type="text"
                                        value={formData.path}
                                        onChange={(e) => setFormData({ ...formData, path: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                        className="w-full px-4 py-3 outline-none bg-transparent"
                                        placeholder="acme-studio"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">What's the mission?</h2>
                            <p className="text-gray-500 mt-2">Our AI uses this to generate the perfect structural copy.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Industry / Niche</label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Photography, SaaS Startup, Local Bakery"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Goal / Purpose</label>
                                <textarea
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-32"
                                    placeholder="e.g. I want to showcase my portfolio and attract new clients to book photoshoots."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Set the vibe</h2>
                            <p className="text-gray-500 mt-2">Choose your starting theme and copywriting tone.</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Color & Typography Theme</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {THEME_PRESETS.map((theme) => (
                                        <div
                                            key={theme.id}
                                            onClick={() => setFormData({ ...formData, themeId: theme.id })}
                                            className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.themeId === theme.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
                                        >
                                            <div className="flex gap-2">
                                                <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: theme.settings.primaryColor }}></div>
                                                <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: theme.settings.accentColor }}></div>
                                            </div>
                                            <span className="text-sm font-medium text-center">{theme.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Copywriting Tone</label>
                                <select
                                    value={formData.tone}
                                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                >
                                    <option>Professional & Trustworthy</option>
                                    <option>Friendly & Approachable</option>
                                    <option>Bold & Punchy</option>
                                    <option>Humorous & Playful</option>
                                    <option>Minimalist & Direct</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Controls */}
                <div className="mt-8 pt-6 border-t flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0 || isSubmitting}
                        className={`font-medium flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep === 0 ? 'text-transparent pointer-events-none' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    {currentStep < STEPS.length - 1 ? (
                        <button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 0 && (!formData.name || !formData.path)) ||
                                (currentStep === 1 && (!formData.industry || !formData.purpose))
                            }
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Generating Site...
                                </>
                            ) : (
                                <>
                                    Generate via AI <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
