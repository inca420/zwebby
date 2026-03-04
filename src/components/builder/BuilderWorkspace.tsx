'use client';

import { useState } from 'react';
import { Sparkles, Plus, Loader2, RefreshCw, Save, Image as ImageIcon, Type, LayoutTemplate, LayoutGrid, UploadCloud, Search, Settings2, AlignLeft, AlignCenter, AlignRight, Palette } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Block, BlockType, WebsiteSettings } from './types';
import BlockWrapper from './blocks/BlockWrapper';
import TextBlock from './blocks/TextBlock';
import HeroBlock from './blocks/HeroBlock';
import FeatureBlock from './blocks/FeatureBlock';
import ImageBlock from './blocks/ImageBlock';

export default function BuilderWorkspace({ websiteId, initialContent }: { websiteId: string, initialContent: any }) {
    // Backward Compatibility check
    const isLegacy = Array.isArray(initialContent);
    const initialBlocks = isLegacy ? initialContent : (initialContent?.blocks || []);
    const initialSettings = isLegacy ? {} : (initialContent?.settings || {});

    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);
    const [prompt, setPrompt] = useState('');
    const [activeBlockId, setActiveBlockId] = useState<string | null>(blocks.length > 0 ? blocks[0].id : null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Image Tab States
    const [imageTab, setImageTab] = useState<'ai' | 'upload' | 'stock'>('ai');
    const [stockQuery, setStockQuery] = useState('');
    const [stockResults, setStockResults] = useState<any[]>([]);
    const [isSearchingStock, setIsSearchingStock] = useState(false);
    const [includeAttribution, setIncludeAttribution] = useState(true);

    // Sidebar Tab State
    const [sidebarTab, setSidebarTab] = useState<'ai' | 'settings' | 'theme'>('ai');

    const supabase = createClient();

    const addBlock = (type: BlockType = 'text') => {
        const newBlock: Block = {
            id: Math.random().toString(36).substring(7),
            type,
            content: type === 'text' ? 'New text block' :
                type === 'hero' ? { heading: 'Hero Heading', subheading: 'Subheading text' } :
                    type === 'feature' ? { features: [{ title: 'Feature 1', description: 'Desc' }, { title: 'Feature 2', description: 'Desc' }] } : '',
        };
        setBlocks([...blocks, newBlock]);
        setActiveBlockId(newBlock.id);
    };

    const duplicateBlock = (idToDuplicate: string) => {
        const blockToDuplicate = blocks.find(b => b.id === idToDuplicate);
        if (!blockToDuplicate) return;

        const newBlock: Block = {
            ...blockToDuplicate,
            id: Math.random().toString(36).substring(7),
        };

        const index = blocks.findIndex(b => b.id === idToDuplicate);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);

        setBlocks(newBlocks);
        setActiveBlockId(newBlock.id);
    };

    const moveBlock = (id: string, direction: 'up' | 'down') => {
        const index = blocks.findIndex(b => b.id === id);
        if (index < 0) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap elements
        [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
        setBlocks(newBlocks);
    };

    const removeBlock = (idToRemove: string) => {
        setBlocks(blocks.filter(b => b.id !== idToRemove));
        if (activeBlockId === idToRemove) {
            setActiveBlockId(null);
        }
    };

    const updateBlockContent = (id: string, newContent: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
    };

    const updateBlockLayout = (id: string, layoutUpdates: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, layout: { ...(b.layout || {}), ...layoutUpdates } } : b));
    };

    const saveWebsite = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('websites')
                .update({ content: { blocks, settings }, updated_at: new Date().toISOString() })
                .eq('id', websiteId);

            if (error) throw error;
        } catch (error) {
            console.error('Error saving website:', error);
            alert('Failed to save website changes.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!activeBlockId || !prompt.trim()) return;

        try {
            setIsGenerating(true);

            // Step 1: Submit to API
            const submitRes = await fetch('/api/ai/image/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!submitRes.ok) throw new Error('Image submission failed');

            const { request_id } = await submitRes.json();

            // Step 2: Poll for completion
            let isComplete = false;
            let attempts = 0;
            const maxAttempts = 60; // 2 minutes max (every 2s)

            while (!isComplete && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds

                const statusRes = await fetch(`/api/ai/image/status?request_id=${request_id}`);
                if (!statusRes.ok) {
                    const errorText = await statusRes.text();
                    throw new Error(`Status check failed: ${errorText}`);
                }

                const statusData = await statusRes.json();
                console.log('Seedream Status Response:', statusData);

                if (statusData.status === 'success') {
                    isComplete = true;
                    if (statusData.image_url) {
                        updateBlockContent(activeBlockId, { url: statusData.image_url });
                    } else if (statusData.images && statusData.images.length > 0) {
                        updateBlockContent(activeBlockId, { url: statusData.images[0].url });
                    }
                    setPrompt('');
                } else if (statusData.status === 'failed' || statusData.status === 'error') {
                    throw new Error(statusData.error?.message || 'Image generation failed');
                }

                attempts++;
            }

            if (!isComplete) throw new Error('Generation timed out');

        } catch (error: any) {
            console.error('AI Generation Error:', error);
            alert(`Failed to generate image: ${error?.message || 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeBlockId) return;

        try {
            setIsGenerating(true); // Re-use spinner state for uploading
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            updateBlockContent(activeBlockId, { url: data.url });
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload image.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleStockSearch = async () => {
        if (!stockQuery.trim()) return;
        try {
            setIsSearchingStock(true);
            const res = await fetch(`/api/stock?q=${encodeURIComponent(stockQuery)}`);
            if (!res.ok) throw new Error('Stock search failed');
            const data = await res.json();
            setStockResults(data.hits || []);
        } catch (error) {
            console.error('Stock Search Error:', error);
            alert('Failed to search images.');
        } finally {
            setIsSearchingStock(false);
        }
    };

    const handleSelectStockImage = (url: string, user: string) => {
        if (!activeBlockId) return;
        const caption = includeAttribution ? `Photo by ${user} on Pixabay` : undefined;
        updateBlockContent(activeBlockId, { url, caption });
    };

    const handleGenerateText = async () => {
        if (activeBlock?.type === 'image') {
            return handleGenerateImage();
        }

        if (!activeBlockId || !prompt.trim()) return;

        try {
            setIsGenerating(true);
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) throw new Error('Generation failed');

            const data = await res.json();

            // Special handling for the feature block to return formatted array
            if (activeBlock?.type === 'feature') {
                try {
                    // Try to extract JSON if the AI returned it as markdown
                    const jsonMatch = data.text.match(/\[[\s\S]*\]/);
                    const features = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(data.text);
                    updateBlockContent(activeBlockId, { features });
                } catch (e) {
                    console.error("Failed to parse feature block JSON", e);
                    alert("The AI didn't format the features correctly. Try again.");
                }
            } else if (activeBlock?.type === 'hero') {
                // Example simple split if the AI returns "Heading \n Subheading"
                const parts = data.text.split('\n').filter((p: string) => p.trim() !== '');
                updateBlockContent(activeBlockId, {
                    heading: parts[0] || 'Hero Heading',
                    subheading: parts[1] || 'Subheading'
                });
            } else {
                updateBlockContent(activeBlockId, data.text);
            }

            setPrompt(''); // clear prompt after success
        } catch (error) {
            console.error('AI Generation Error:', error);
            alert('Failed to generate text. Please check server logs.');
        } finally {
            setIsGenerating(false);
        }
    };

    const activeBlock = blocks.find(b => b.id === activeBlockId);

    const themeStyle = `
        :root {
            --brand-primary: ${settings.primaryColor || '#000000'};
            --brand-font: '${settings.font || 'Inter'}', sans-serif;
        }
    `;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
            <div className="flex bg-gray-50 h-[calc(100vh-73px)]" style={{ fontFamily: 'var(--brand-font)' }}>
                {/* Left Canvas Area */}
                <div className="flex-1 overflow-y-auto p-8 border-r">
                    <div className="max-w-4xl mx-auto space-y-4">

                        <div className="flex justify-end mb-4">
                            <button
                                onClick={saveWebsite}
                                disabled={isSaving}
                                className="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        {blocks.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                                <p className="text-gray-500 mb-4">No blocks yet. Start building your site!</p>
                                <button onClick={() => addBlock('text')} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                                    <Plus className="w-4 h-4" /> Add First Block
                                </button>
                            </div>
                        )}

                        {blocks.map((block, index) => (
                            <BlockWrapper
                                key={block.id}
                                id={block.id}
                                isActive={activeBlockId === block.id}
                                layout={block.layout}
                                onClick={() => setActiveBlockId(block.id)}
                                onRemove={() => removeBlock(block.id)}
                                onMoveUp={() => moveBlock(block.id, 'up')}
                                onMoveDown={() => moveBlock(block.id, 'down')}
                                onDuplicate={() => duplicateBlock(block.id)}
                                isFirst={index === 0}
                                isLast={index === blocks.length - 1}
                            >
                                {block.type === 'text' && <TextBlock content={block.content} layout={block.layout} onChange={(c) => updateBlockContent(block.id, c)} />}
                                {block.type === 'hero' && <HeroBlock content={block.content} layout={block.layout} onChange={(c) => updateBlockContent(block.id, c)} />}
                                {block.type === 'feature' && <FeatureBlock content={block.content} layout={block.layout} onChange={(c) => updateBlockContent(block.id, c)} />}
                                {block.type === 'image' && <ImageBlock content={block.content} layout={block.layout} onChange={(c) => updateBlockContent(block.id, c)} />}
                            </BlockWrapper>
                        ))}

                        {blocks.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button onClick={() => addBlock('text')} className="py-4 border shadow-sm bg-white rounded-xl text-gray-700 hover:border-gray-300 transition-colors flex flex-col items-center justify-center gap-2 text-sm font-medium"><Type className="w-5 h-5 text-gray-400" /> Text</button>
                                <button onClick={() => addBlock('hero')} className="py-4 border shadow-sm bg-white rounded-xl text-gray-700 hover:border-gray-300 transition-colors flex flex-col items-center justify-center gap-2 text-sm font-medium"><LayoutTemplate className="w-5 h-5 text-gray-400" /> Hero</button>
                                <button onClick={() => addBlock('feature')} className="py-4 border shadow-sm bg-white rounded-xl text-gray-700 hover:border-gray-300 transition-colors flex flex-col items-center justify-center gap-2 text-sm font-medium"><LayoutGrid className="w-5 h-5 text-gray-400" /> Features</button>
                                <button onClick={() => addBlock('image')} className="py-4 border shadow-sm bg-white rounded-xl text-gray-700 hover:border-gray-300 transition-colors flex flex-col items-center justify-center gap-2 text-sm font-medium"><ImageIcon className="w-5 h-5 text-gray-400" /> Image</button>
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-96 bg-white flex flex-col border-l">
                    {/* Sidebar Navigation */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setSidebarTab('ai')}
                            className={`flex-1 flex-col md:flex-row py-4 px-2 text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${sidebarTab === 'ai' ? 'border-b-2 border-orange-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Sparkles className="w-4 h-4 hidden md:block" /> AI Setup
                        </button>
                        <button
                            onClick={() => setSidebarTab('settings')}
                            disabled={!activeBlockId}
                            className={`flex-1 flex-col md:flex-row py-4 px-2 text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${!activeBlockId ? 'opacity-50 cursor-not-allowed text-gray-400' : sidebarTab === 'settings' ? 'border-b-2 border-orange-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Settings2 className="w-4 h-4 hidden md:block" /> Layout
                        </button>
                        <button
                            onClick={() => setSidebarTab('theme')}
                            className={`flex-1 flex-col md:flex-row py-4 px-2 text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${sidebarTab === 'theme' ? 'border-b-2 border-orange-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Palette className="w-4 h-4 hidden md:block" /> Theme
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto">
                        {sidebarTab === 'theme' && (
                            <div className="p-6 flex flex-col gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Global Theme</h3>
                                    <p className="text-sm text-gray-500 mb-6">Customize the brand settings for your entire website.</p>

                                    {/* Font Control */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Primary Font</label>
                                        <select
                                            value={settings.font || 'Inter'}
                                            onChange={(e) => setSettings({ ...settings, font: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="Inter">Inter (Default)</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Playfair Display">Playfair Display (Serif)</option>
                                            <option value="Merriweather">Merriweather (Serif)</option>
                                        </select>
                                    </div>

                                    {/* Color Control */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Brand Color (Hex)</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={settings.primaryColor || '#ea580c'}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="w-10 h-10 p-1 rounded cursor-pointer border border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={settings.primaryColor || '#ea580c'}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                className="flex-1 rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:ring-orange-500 focus:border-orange-500 uppercase font-mono"
                                                placeholder="#hexcode"
                                                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Pick a color or paste a hex code. We apply this to icons, buttons, and high-impact elements.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {sidebarTab === 'settings' && activeBlock && (
                            <div className="p-6 flex flex-col gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Block Layout</h3>
                                    <p className="text-sm text-gray-500 mb-6">Customize the sizing and spacing for this specific block.</p>

                                    {/* Width Control */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Max Width Constraints</label>
                                        <select
                                            value={activeBlock.layout?.width || 'auto'}
                                            onChange={(e) => updateBlockLayout(activeBlock.id, { width: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="auto">Auto (Default content width)</option>
                                            <option value="narrow">Narrow (Centered readable text)</option>
                                            <option value="wide">Wide (Extended layout)</option>
                                            <option value="full">Full Width (Edge-to-edge)</option>
                                        </select>
                                    </div>

                                    {/* Padding Control */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Vertical Spacing (Padding)</label>
                                        <select
                                            value={activeBlock.layout?.paddingY || 'medium'}
                                            onChange={(e) => updateBlockLayout(activeBlock.id, { paddingY: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="none">None</option>
                                            <option value="small">Small</option>
                                            <option value="medium">Medium (Default)</option>
                                            <option value="large">Large</option>
                                            <option value="xlarge">Extra Large</option>
                                        </select>
                                    </div>

                                    {/* Alignment Control */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Content Alignment</label>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            <button
                                                onClick={() => updateBlockLayout(activeBlock.id, { alignment: 'left' })}
                                                className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${(!activeBlock.layout?.alignment || activeBlock.layout.alignment === 'left') ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                <AlignLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateBlockLayout(activeBlock.id, { alignment: 'center' })}
                                                className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${activeBlock.layout?.alignment === 'center' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                <AlignCenter className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => updateBlockLayout(activeBlock.id, { alignment: 'right' })}
                                                className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${activeBlock.layout?.alignment === 'right' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                <AlignRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {sidebarTab === 'ai' && (
                            <>
                                <div className="p-6 border-b">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        {activeBlock?.type === 'image' ? <ImageIcon className="w-5 h-5 text-blue-500" /> : <Sparkles className="w-5 h-5 text-orange-500" />}
                                        {activeBlock?.type === 'image' ? 'Image Source' : 'AI Generator'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {activeBlock?.type === 'image' ? 'Choose how to add an image to this block.' : 'Select a block on the left and describe what you want to create.'}
                                    </p>
                                </div>

                                {activeBlock?.type === 'image' ? (
                                    <div className="p-6 flex flex-col gap-6">
                                        {/* Tabs */}
                                        <div className="flex p-1 bg-gray-100 rounded-lg">
                                            <button onClick={() => setImageTab('ai')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${imageTab === 'ai' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>AI Model</button>
                                            <button onClick={() => setImageTab('upload')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${imageTab === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Upload</button>
                                            <button onClick={() => setImageTab('stock')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${imageTab === 'stock' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Stock</button>
                                        </div>

                                        {/* AI Tab */}
                                        {imageTab === 'ai' && (
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
                                                    <textarea
                                                        value={prompt}
                                                        onChange={(e) => setPrompt(e.target.value)}
                                                        placeholder="Describe the image you want to generate (e.g. A wide angle shot of a pristine beach)"
                                                        className="w-full h-32 rounded-xl border border-gray-300 p-4 text-sm focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900"
                                                        disabled={isGenerating}
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleGenerateImage}
                                                    disabled={!prompt.trim() || isGenerating}
                                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                    {isGenerating ? 'Generating...' : 'Generate AI Image'}
                                                </button>
                                            </div>
                                        )}

                                        {/* Upload Tab */}
                                        {imageTab === 'upload' && (
                                            <div className="flex flex-col gap-4">
                                                <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                                    <span className="text-sm font-medium text-gray-700">Click to browse</span>
                                                    <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP</span>
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isGenerating} />
                                                </label>
                                                {isGenerating && <p className="text-sm text-blue-600 text-center flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</p>}
                                            </div>
                                        )}

                                        {/* Stock Tab */}
                                        {imageTab === 'stock' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={stockQuery}
                                                        onChange={(e) => setStockQuery(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleStockSearch()}
                                                        placeholder="Search Pixabay..."
                                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                                        disabled={isSearchingStock}
                                                    />
                                                    <button onClick={handleStockSearch} disabled={isSearchingStock} className="bg-gray-100 text-gray-900 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                                                        {isSearchingStock ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                                    </button>
                                                </div>

                                                <label className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">
                                                    <input
                                                        type="checkbox"
                                                        checked={includeAttribution}
                                                        onChange={(e) => setIncludeAttribution(e.target.checked)}
                                                        className="mt-1 flex-shrink-0 rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="leading-snug">Pixabay makes these images free to use, and they appreciate a shout out. Add an attribution caption?</span>
                                                </label>

                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    {stockResults.map((img) => (
                                                        <button
                                                            key={img.id}
                                                            onClick={() => handleSelectStockImage(img.largeImageURL, img.user)}
                                                            className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 aspect-square"
                                                        >
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={img.previewURL} alt={img.tags} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                <span className="text-white text-xs font-medium">Use Image</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                {stockResults.length === 0 && !isSearchingStock && stockQuery && (
                                                    <p className="text-sm text-gray-500 text-center mt-4">No results found.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6 flex flex-col gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
                                            <textarea
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="e.g. Write a catchy hero section for a terpene extraction business."
                                                className="w-full h-48 rounded-xl border border-gray-300 p-4 text-sm focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900"
                                                disabled={!activeBlockId || isGenerating}
                                            />
                                            {!activeBlockId && (
                                                <p className="text-xs text-orange-500 mt-2">Please select a block on the canvas first.</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleGenerateText}
                                            disabled={!activeBlockId || !prompt.trim() || isGenerating}
                                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                            {isGenerating ? 'Generating...' : 'Generate Content'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
