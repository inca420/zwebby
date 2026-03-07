'use client';

import { WebsiteSettings } from '../types';
import { Menu } from 'lucide-react';

export default function NavbarBlock({ settings, isBuilder = false, viewport = 'desktop' }: { settings: WebsiteSettings, isBuilder?: boolean, viewport?: 'desktop' | 'tablet' | 'mobile' }) {
    if (settings.showNavbar === false) return null;

    const navLinks = settings.navigation || [];
    const isMobileView = viewport !== 'desktop';

    return (
        <nav
            className="w-full px-6 py-4 flex items-center justify-between border-b transition-colors relative z-40"
            style={{
                backgroundColor: 'var(--brand-bg)',
                borderColor: 'var(--brand-secondary)'
            }}
        >
            <div className="flex-shrink-0 flex items-center gap-3">
                {settings.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain" />
                ) : (
                    <span
                        className="text-xl font-bold tracking-tight"
                        style={{ color: 'var(--brand-primary)' }}
                    >
                        Your Brand
                    </span>
                )}
            </div>

            {/* Desktop Navigation */}
            <div className={`${isMobileView ? 'hidden' : 'hidden md:flex'} items-center gap-8`}>
                {navLinks.length > 0 ? (
                    navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={isBuilder ? '#' : link.url}
                            onClick={(e) => { if (isBuilder) e.preventDefault(); }}
                            className="text-sm font-medium hover:opacity-70 transition-opacity"
                            style={{ color: 'var(--brand-text)' }}
                        >
                            {link.label}
                        </a>
                    ))
                ) : (
                    <>
                        {/* Placeholder links if empty */}
                        <span className="text-sm font-medium opacity-50" style={{ color: 'var(--brand-text)' }}>Home</span>
                        <span className="text-sm font-medium opacity-50" style={{ color: 'var(--brand-text)' }}>About</span>
                        <span className="text-sm font-medium opacity-50" style={{ color: 'var(--brand-text)' }}>Contact</span>
                    </>
                )}

                <button
                    className="px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--brand-accent)', color: '#ffffff' }}
                >
                    Get Started
                </button>
            </div>

            {/* Mobile Menu Toggle (Visual only for builder) */}
            <div className={`${isMobileView ? 'flex' : 'md:hidden flex'} items-center`}>
                <button className="p-2 opacity-80" style={{ color: 'var(--brand-text)' }}>
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
