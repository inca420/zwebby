import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new NextResponse('No file provided', { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return new NextResponse('File must be an image', { status: 400 });
        }

        // Generate a unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('user_uploads')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from('user_uploads')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return new NextResponse(`Error: ${error?.message || 'Internal Server Error'}\nDetails: ${JSON.stringify(error)}`, { status: 500 });
    }
}
