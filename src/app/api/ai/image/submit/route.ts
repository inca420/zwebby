import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const APIFREE_KEY = process.env.APIFREE_API_KEY;
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new NextResponse('Prompt is required', { status: 400 });
        }

        if (!APIFREE_KEY) {
            return new NextResponse('API Key not configured', { status: 500 });
        }

        // Step 1: Submit the request to APIFree Seedream 4.5
        const submitResponse = await fetch('https://api.apifree.ai/v1/image/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${APIFREE_KEY}`
            },
            body: JSON.stringify({
                model: 'bytedance/seedream-4.5',
                prompt: prompt,
            })
        });

        if (!submitResponse.ok) {
            const errorData = await submitResponse.text();
            console.error('APIFree HTTP Error:', errorData);
            throw new Error(`APIFree API responded with status ${submitResponse.status}`);
        }

        const data = await submitResponse.json();

        // APIFree can return HTTP 200 even for model errors, so we check data.code
        if (data.code && data.code !== 200) {
            console.error('APIFree Model Error:', data);
            throw new Error(data.error?.message || 'Model encountered an internal error.');
        }

        // Return the request_id so the client can start polling
        const requestId = data.resp_data?.request_id || data.request_id; // Support both just in case

        if (!requestId) {
            throw new Error('No request_id returned from APIFree');
        }

        return NextResponse.json({ request_id: requestId });

    } catch (error: any) {
        console.error('Image Generation Error:', error);
        return new NextResponse(`Error: ${error?.message || 'Internal Server Error'}`, { status: 500 });
    }
}
