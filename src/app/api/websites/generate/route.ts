import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { THEME_PRESETS } from '@/lib/constants/themes';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await request.json();
        const { name, path, industry, purpose, themeId, tone } = body;

        if (!name || !path || !industry || !purpose || !themeId || !tone) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Base system prompt to instruct the LLM on the JSON structure we need
        const systemPrompt = `
You are an expert copywriter and web designer. The user is using a website builder to create a new site.
You must return a raw JSON object containing the initial content blocks for their landing page.
Return ONLY valid JSON. No markdown backticks, no markdown formatting.

The JSON format MUST exactly match this structure:
{
  "contentBlocks": [
    {
      "id": "hero-1",
      "type": "hero",
      "content": {
        "heading": "Catchy Hero Headline here",
        "subheading": "A strong, persuasive subheadline explaining the value proposition."
      },
      "layout": { "paddingY": "xlarge", "alignment": "center" }
    },
    {
      "id": "features-1",
      "type": "features",
      "content": {
        "features": [
          { "title": "Feature 1", "description": "Description of feature 1" },
          { "title": "Feature 2", "description": "Description of feature 2" },
          { "title": "Feature 3", "description": "Description of feature 3" }
        ]
      },
      "layout": { "paddingY": "large", "alignment": "center" }
    },
    {
      "id": "text-1",
      "type": "text",
      "content": {
        "text": "A compelling 'About Us' or 'Mission' paragraph that builds trust."
      },
      "layout": { "paddingY": "large", "alignment": "left" }
    }
  ],
  "navigation": [
    { "id": "nav-1", "label": "Home", "url": "/" },
    { "id": "nav-2", "label": "About", "url": "/#about" },
    { "id": "nav-3", "label": "Contact", "url": "/#contact" }
  ]
}

Tailor the text to the user's specific industry, purpose, and tone provided below. Avoid generic lorem ipsum entirely.
        `;

        const userPrompt = `
Project Name: ${name}
Industry/Niche: ${industry}
Primary Goal/Purpose: ${purpose}
Copywriting Tone: ${tone}

Please generate the structured JSON for the landing page.
        `;

        let generatedSettings: any = null;

        // Call OpenRouter API
        if (process.env.OPENROUTER_API_KEY) {
            try {
                const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'Zwebby Builder',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-4o-mini', // Fast, cheap, and excellent at JSON
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ],
                        response_format: { type: 'json_object' }
                    })
                });

                if (aiResponse.ok) {
                    const data = await aiResponse.json();
                    let responseContent = data.choices[0].message.content;

                    // Sometimes LLMs still wrap in standard markdown JSON blocks despite instructions, so we clean it.
                    responseContent = responseContent.replace(/^\`\`\`json\n/g, '').replace(/\n\`\`\`$/g, '');

                    const parsedData = JSON.parse(responseContent);

                    if (parsedData.contentBlocks && parsedData.navigation) {
                        generatedSettings = {
                            contentBlocks: parsedData.contentBlocks,
                            navigation: parsedData.navigation,
                            showNavbar: true,
                            showFooter: true,
                            logoUrl: '',
                            socialLinks: { twitter: '', facebook: '', instagram: '', linkedin: '' }
                        };
                    }
                } else {
                    console.error("OpenRouter API error:", await aiResponse.text());
                }
            } catch (err) {
                console.error("Failed to fetch or parse AI content", err);
            }
        }

        // Fallback to basic generic content if AI fails or no API key is present
        if (!generatedSettings) {
            generatedSettings = {
                contentBlocks: [
                    { type: 'hero', id: 'hero-fallback', content: { heading: `Welcome to ${name}`, subheading: `We are the leading ${industry} platform.` }, layout: { paddingY: 'xlarge', alignment: 'center' } },
                    { type: 'features', id: 'features-fallback', content: { features: [{ title: 'Feature 1', description: 'Describe your feature here.' }] }, layout: { paddingY: 'large', alignment: 'center' } }
                ],
                navigation: [
                    { id: '1', label: 'Home', url: '/' }
                ],
                showNavbar: true,
                showFooter: true,
                logoUrl: '',
                socialLinks: { twitter: '', facebook: '', instagram: '', linkedin: '' }
            };
        }

        // Apply the selected theme preset
        const selectedTheme = THEME_PRESETS.find(p => p.id === themeId);
        const themeSettings = selectedTheme ? selectedTheme.settings : THEME_PRESETS[0].settings;

        // The database expects a single JSON 'content' column containing 'blocks' and 'settings'
        const initialContentBlob = {
            blocks: generatedSettings.contentBlocks,
            settings: {
                ...generatedSettings,
                ...themeSettings
            }
        };

        // Remove the duplicated contentBlocks array from settings to keep it clean
        delete initialContentBlob.settings.contentBlocks;

        // Create the website in the database overriding theme and settings
        const { data: website, error } = await supabase
            .from('websites')
            .insert({
                user_id: user.id,
                name: name,
                slug: path,
                content: initialContentBlob
            })
            .select()
            .single();

        if (error) {
            console.error("Database insert error:", error);
            // Handle slug uniqueness conflicts explicitly if needed, but for now standard error
            return new NextResponse(error.message, { status: 500 });
        }

        return NextResponse.json({ websiteId: website.id });
    } catch (error) {
        console.error('Error generating website:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
