import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = formData.get('id');

        if (!id || typeof id !== 'string') {
            return new NextResponse('Missing or invalid ID', { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Delete the website, relying on RLS to ensure they only delete their own
        const { error } = await supabase
            .from('websites')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id); // Extra safety check

        if (error) throw error;

        // Redirect back to dashboard
        return NextResponse.redirect(`${new URL(req.url).origin}/dashboard`, { status: 303 });
    } catch (error) {
        console.error('Error deleting website:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
