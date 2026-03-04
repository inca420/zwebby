import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogOut, Plus, Layout } from 'lucide-react';
import ProjectCard from '@/components/dashboard/ProjectCard';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    // Fetch user's websites
    const { data: websites, error } = await supabase
        .from('websites')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Zwebby Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <form action="/auth/signout" method="post">
                        <button className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </header>

            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage and edit your Zwebby websites.</p>
                        </div>
                        <form action="/api/websites/create" method="post">
                            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors">
                                <Plus className="w-4 h-4" /> New Project
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {websites && websites.length > 0 ? (
                            websites.map((site) => (
                                <ProjectCard key={site.id} site={site} />
                            ))
                        ) : (
                            <div className="col-span-full bg-white border border-dashed rounded-xl p-12 text-center">
                                <div className="mx-auto w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                                    <Layout className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
                                <p className="text-gray-500 mt-1 mb-6">Create your first website project to get started.</p>
                                <form action="/api/websites/create" method="post">
                                    <button className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-400 transition-colors">
                                        Create New Project
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
