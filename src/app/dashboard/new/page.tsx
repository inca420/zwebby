import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WizardForm from '@/components/dashboard/WizardForm';

export default async function NewProjectPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <a href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">Dashboard</a>
                    <span className="text-gray-400">/</span>
                    <h1 className="text-xl font-bold text-gray-900">New Project</h1>
                </div>
                <span className="text-sm text-gray-500">{user.email}</span>
            </header>

            <main className="flex-1 p-8 flex items-center justify-center">
                <div className="w-full max-w-4xl py-12">
                    <div className="text-center mb-12">
                        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block tracking-wide">AI WEBSITE GENERATOR</span>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Let's build something brilliant.</h1>
                        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-lg">Answer a few quick questions, and our AI will architect and write the first draft of your website.</p>
                    </div>

                    <WizardForm />
                </div>
            </main>
        </div >
    );
}
