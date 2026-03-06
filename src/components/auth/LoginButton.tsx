'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogIn, Loader2, Mail } from 'lucide-react';
import { isSuperAdmin } from '@/lib/constants/auth';
import { useRouter } from 'next/navigation';

export default function LoginButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const supabase = createClient();
    const router = useRouter();

    const handleGithubLogin = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error);
            setIsLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            setIsLoading(true);
            setMessage('');

            // Developer Shortcut: Auto-login for superadmins if a dev password is set in env
            const devPassword = process.env.NEXT_PUBLIC_DEV_PASSWORD;
            if (isSuperAdmin(email) && devPassword) {
                const { error: devError } = await supabase.auth.signInWithPassword({
                    email,
                    password: devPassword,
                });

                if (!devError) {
                    setMessage('Dev shortcut: Logged in automatically!');
                    router.push('/dashboard');
                    return;
                }

                // If it fails (e.g., password doesn't match the DB), silently fall back to OTP
                console.warn('Dev shortcut failed, falling back to magic link', devError);
            }

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                },
            });
            if (error) throw error;
            setMessage('Check your email for the magic link!');
        } catch (error) {
            console.error('Error sending magic link:', error);
            setMessage('Failed to send magic link.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="flex-1 rounded-xl border-gray-300 shadow-sm px-4 py-3 text-sm focus:border-orange-500 focus:ring-orange-500 bg-gray-50 border text-gray-900"
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                        Email Log In
                    </button>
                </div>
                {message && <p className="text-sm font-medium text-orange-600 text-center">{message}</p>}
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-500">Or</span>
                </div>
            </div>

            <button
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                Continue with GitHub
            </button>
        </div>
    );
}
