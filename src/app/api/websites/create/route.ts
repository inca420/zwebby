import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const newWebsite = {
            user_id: user.id,
            name: `Untitled Site - ${new Date().toLocaleDateString()}`,
            content: [{ id: Math.random().toString(36).substring(7), type: 'text', content: 'Welcome to your new website! Click generate to let AI write for you.' }]
        };

        const { data, error } = await supabase
            .from('websites')
            .insert(newWebsite)
            .select()
            .single();

        if (error) throw error;

        // Redirect to the new builder page
        return NextResponse.redirect(`${new URL(req.url).origin}/builder/${data.id}`, { status: 303 });
    } catch (error: any) {
        console.error('Error creating website:', error);
        return new NextResponse(`Error: ${error?.message || 'Internal Server Error'}\nDetails: ${JSON.stringify(error)}`, { status: 500 });
    }
}
