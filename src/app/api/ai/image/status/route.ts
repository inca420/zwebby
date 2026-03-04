import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const APIFREE_KEY = process.env.APIFREE_API_KEY;
    try {
        const { searchParams } = new URL(req.url);
        const requestId = searchParams.get('request_id');

        if (!requestId) {
            return new NextResponse('request_id is required', { status: 400 });
        }

        if (!APIFREE_KEY) {
            return new NextResponse('API Key not configured', { status: 500 });
        }

        // Step 2: Poll APIFree for the status using the result endpoint format
        const statusResponse = await fetch(`https://api.apifree.ai/v1/image/${requestId}/result`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${APIFREE_KEY}`
            }
        });

        if (!statusResponse.ok) {
            const errorData = await statusResponse.text();
            console.error('APIFree Status Check Error:', errorData);
            throw new Error(`APIFree API responded with status ${statusResponse.status}`);
        }

        const data = await statusResponse.json();

        // Check if APIFree itself returned a logical error wrapped in a 200 OK
        if (data.code && data.code !== 200) {
            return NextResponse.json({
                status: 'error',
                error: { message: data.code_msg || 'Image API error.' }
            });
        }

        // Map the payload from APIFree's resp_data to the Zwebby BuilderWorkspace structure
        const respData = data.resp_data || {};
        const clientPayload: any = {
            status: respData.status || 'processing'
        };

        if (clientPayload.status === 'success' && respData.image_list && respData.image_list.length > 0) {
            clientPayload.image_url = respData.image_list[0];
        } else if (clientPayload.status === 'error' || clientPayload.status === 'failed') {
            clientPayload.error = { message: respData.error || 'Generation failed' };
        }

        return NextResponse.json(clientPayload);

    } catch (error: any) {
        console.error('Image Status Check Error:', error);
        return new NextResponse(`Error: ${error?.message || 'Internal Server Error'}\nDetails: ${JSON.stringify(error)}`, { status: 500 });
    }
}
