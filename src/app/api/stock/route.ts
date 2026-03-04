import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return new NextResponse('Missing search query', { status: 400 });
        }

        const API_KEY = process.env.PIXABAY_API_KEY;
        if (!API_KEY) {
            return new NextResponse('Pixabay API Key not configured', { status: 500 });
        }

        const res = await fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`);

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Pixabay API error: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Pixabay Search Error:', error);
        return new NextResponse(`Error: ${error?.message || 'Internal Server Error'}`, { status: 500 });
    }
}
