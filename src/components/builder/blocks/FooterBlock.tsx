'use client';

import { WebsiteSettings } from '../types';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function FooterBlock({ settings, isBuilder = false, viewport = 'desktop' }: { settings: WebsiteSettings, isBuilder?: boolean, viewport?: 'desktop' | 'tablet' | 'mobile' }) {
    if (settings.showFooter === false) return null;

    const navLinks = settings.navigation || [];
    const social = settings.socialLinks || {};
    const isMobileView = viewport !== 'desktop';

    // We lightly tint the footer using a mix of the background and secondary color
    const footerStyle = {
        backgroundColor: 'var(--brand-secondary)',
        color: 'var(--brand-text)',
        opacity: 0.95 // Subtle differentiation from main bg
    };

    return (
        <footer className="w-full pt-16 pb-8 px-6 transition-colors" style={footerStyle}>
            <div className={`max-w-6xl mx-auto grid gap-12 mb-12 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'}`}>

                {/* Brand Column */}
                <div className="col-span-1 md:col-span-1 flex flex-col items-start">
                    {settings.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain mb-4" />
                    ) : (
                        <span
                            className="text-2xl font-bold tracking-tight mb-4 inline-block"
                            style={{ color: 'var(--brand-primary)' }}
                        >
                            Your Brand
                        </span>
                    )}
                    <p className="text-sm opacity-70 leading-relaxed max-w-xs">
                        Building a better web experience, one block at a time.
                    </p>
                </div>

                {/* Quick Links Column */}
                <div className="col-span-1">
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-3">
                        {navLinks.length > 0 ? (
                            navLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={isBuilder ? '#' : link.url}
                                        onClick={(e) => { if (isBuilder) e.preventDefault(); }}
                                        className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <>
                                <li><span className="text-sm opacity-50">Home</span></li>
                                <li><span className="text-sm opacity-50">About Us</span></li>
                                <li><span className="text-sm opacity-50">Services</span></li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Legal Column */}
                <div className="col-span-1">
                    <h4 className="font-bold mb-4">Legal</h4>
                    <ul className="space-y-3">
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="text-sm opacity-70 hover:opacity-100 transition-opacity">Privacy Policy</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="text-sm opacity-70 hover:opacity-100 transition-opacity">Terms of Service</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="text-sm opacity-70 hover:opacity-100 transition-opacity">Cookie Policy</a></li>
                    </ul>
                </div>

                {/* Social Column */}
                <div className="col-span-1">
                    <h4 className="font-bold mb-4">Connect</h4>
                    <div className="flex gap-4">
                        <a href={isBuilder ? '#' : (social.twitter || '#')} onClick={(e) => { if (!social.twitter || isBuilder) e.preventDefault(); }} className={`p-2 rounded-full border border-current opacity-70 hover:opacity-100 transition-opacity ${!social.twitter && !isBuilder ? 'hidden' : ''}`}>
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href={isBuilder ? '#' : (social.facebook || '#')} onClick={(e) => { if (!social.facebook || isBuilder) e.preventDefault(); }} className={`p-2 rounded-full border border-current opacity-70 hover:opacity-100 transition-opacity ${!social.facebook && !isBuilder ? 'hidden' : ''}`}>
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href={isBuilder ? '#' : (social.instagram || '#')} onClick={(e) => { if (!social.instagram || isBuilder) e.preventDefault(); }} className={`p-2 rounded-full border border-current opacity-70 hover:opacity-100 transition-opacity ${!social.instagram && !isBuilder ? 'hidden' : ''}`}>
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href={isBuilder ? '#' : (social.linkedin || '#')} onClick={(e) => { if (!social.linkedin || isBuilder) e.preventDefault(); }} className={`p-2 rounded-full border border-current opacity-70 hover:opacity-100 transition-opacity ${!social.linkedin && !isBuilder ? 'hidden' : ''}`}>
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>

            </div>

            <div className={`max-w-6xl mx-auto pt-8 border-t border-current border-opacity-10 flex flex-col items-center justify-between gap-4 ${isMobileView ? 'text-center' : 'md:flex-row'}`}>
                <p className="text-xs opacity-60">
                    &copy; {new Date().getFullYear()} Your Brand Inc. All rights reserved.
                </p>
                <p className="text-xs opacity-40">
                    Powered by Zwebby
                </p>
            </div>
        </footer>
    );
}
