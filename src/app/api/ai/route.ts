import { OpenAI } from 'openai';
import { createClient } from '@/lib/supabase/server';

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    try {
        // 1. Authenticate the request
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // 2. Parse the request body
        const { prompt, model = 'google/gemini-2.5-flash' } = await req.json();

        if (!prompt) {
            return new Response('Missing prompt', { status: 400 });
        }

        // 3. Call OpenRouter using the OpenAI SDK
        const completion = await openai.chat.completions.create(
            {
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert copywriter helping to build website content blocks. Provide raw, concise, high-quality text without any markdown wrapper text unless explicitly requested by the user.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    'HTTP-Referer': 'http://localhost:3001',
                    'X-Title': 'Zwebby MVP',
                },
            }
        );

        const outputText = completion.choices[0]?.message?.content || '';

        return Response.json({ text: outputText });
    } catch (error) {
        console.error('OpenRouter Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
