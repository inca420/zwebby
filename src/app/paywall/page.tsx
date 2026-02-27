import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShieldAlert, LogOut } from 'lucide-react';

export default async function PaywallPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center flex flex-col items-center">

                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>

                    <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Subscription Required
                    </h2>

                    <p className="mt-6 text-lg/8 text-gray-600">
                        You have successfully logged in as <span className="font-semibold text-gray-900">{user.email}</span>,
                        but you need an active Zwebby subscription to access the builder workspace.
                    </p>

                    <div className="mt-10">
                        <p className="text-sm text-gray-400 mb-8">(Payment integration coming soon!)</p>

                        <form action="/auth/signout" method="post">
                            <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 text-sm font-medium transition-colors">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
