import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id, name } = await req.json();

        if (!id || !name) {
            return new NextResponse('Missing project ID or name', { status: 400 });
        }

        const { data, error } = await supabase
            .from('websites')
            .update({ name: name, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', user.id) // Ensure users only rename their own projects
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, website: data });
    } catch (error: any) {
        console.error('Error renaming website:', error);
        return new NextResponse(`Error: ${error?.message || 'Internal Server Error'}\nDetails: ${JSON.stringify(error)}`, { status: 500 });
    }
}
