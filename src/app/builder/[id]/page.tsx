import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogOut, ArrowLeft } from 'lucide-react';
import { isSuperAdmin } from '@/lib/constants/auth';
import BuilderWorkspace from '@/components/builder/BuilderWorkspace';
import Link from 'next/link';

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    // Double check authorization on the server component side
    if (!isSuperAdmin(user.email)) {
        redirect('/paywall');
    }

    const { data: website } = await supabase
        .from('websites')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!website) {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">{website.name}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <form action="/auth/signout" method="post">
                        <button className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </header>

            <main className="flex-1">
                <BuilderWorkspace websiteId={website.id} initialContent={website.content} />
            </main>
        </div>
    );
}
