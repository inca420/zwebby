'use client';

import { useState } from 'react';
import { Sparkles, Plus, Trash2, Loader2, RefreshCw } from 'lucide-react';

type Block = {
    id: string;
    type: 'text';
    content: string;
};

export default function BuilderWorkspace() {
    const [blocks, setBlocks] = useState<Block[]>([
        { id: '1', type: 'text', content: 'Welcome to your new website! Click generate to let AI write for you.' }
    ]);
    const [prompt, setPrompt] = useState('');
    const [activeBlockId, setActiveBlockId] = useState<string | null>('1');
    const [isGenerating, setIsGenerating] = useState(false);

    const addBlock = () => {
        const newBlock: Block = {
            id: Math.random().toString(36).substring(7),
            type: 'text',
            content: 'New empty block',
        };
        setBlocks([...blocks, newBlock]);
        setActiveBlockId(newBlock.id);
    };

    const removeBlock = (idToRemove: string) => {
        setBlocks(blocks.filter(b => b.id !== idToRemove));
        if (activeBlockId === idToRemove) {
            setActiveBlockId(null);
        }
    };

    const updateBlockContent = (id: string, newContent: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
    };

    const handleGenerateText = async () => {
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
            updateBlockContent(activeBlockId, data.text);
            setPrompt(''); // clear prompt after success
        } catch (error) {
            console.error('AI Generation Error:', error);
            alert('Failed to generate text. Please check server logs.');
        } finally {
            setIsGenerating(false);
        }
    };

    const activeBlock = blocks.find(b => b.id === activeBlockId);

    return (
        <div className="flex bg-gray-50 h-[calc(100vh-73px)]">
            {/* Left Canvas Area */}
            <div className="flex-1 overflow-y-auto p-8 border-r">
                <div className="max-w-4xl mx-auto space-y-4">

                    {blocks.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500 mb-4">No blocks yet. Start building your site!</p>
                            <button onClick={addBlock} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                                <Plus className="w-4 h-4" /> Add First Block
                            </button>
                        </div>
                    )}

                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            onClick={() => setActiveBlockId(block.id)}
                            className={`p-6 rounded-xl border bg-white cursor-pointer transition-all group relative ${activeBlockId === block.id ? 'border-orange-500 ring-1 ring-orange-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <textarea
                                value={block.content}
                                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                className="w-full text-gray-900 resize-none outline-none bg-transparent"
                                rows={Math.max(3, block.content.split('\n').length)}
                            />
                        </div>
                    ))}

                    {blocks.length > 0 && (
                        <button
                            onClick={addBlock}
                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Block
                        </button>
                    )}

                </div>
            </div>

            {/* Right AI Sidebar */}
            <div className="w-96 bg-white flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        AI Generator
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Select a block on the left and describe what you want to write.</p>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-4">
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
            </div>
        </div>
    );
}
