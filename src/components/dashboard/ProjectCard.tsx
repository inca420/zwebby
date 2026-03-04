'use client';

import { useState } from 'react';
import { Layout, Globe, Trash2, Edit2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProjectCard({ site }: { site: any }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(site.name);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim() || name === site.name) {
            setIsEditing(false);
            setName(site.name);
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/websites/rename', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: site.id, name: name.trim() })
            });

            if (!res.ok) throw new Error('Failed to rename project');

            setIsEditing(false);
            router.refresh(); // Refresh the dashboard server component
        } catch (error) {
            console.error('Error renaming:', error);
            setName(site.name); // Revert on error
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setIsEditing(false);
            setName(site.name);
        }
    };

    return (
        <div className="bg-white rounded-xl border p-6 flex flex-col hover:border-orange-500 hover:shadow-sm transition-all group relative">
            <form action={`/api/websites/delete`} method="post" className="absolute top-4 right-4">
                <input type="hidden" name="id" value={site.id} />
                <button className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Project">
                    <Trash2 className="w-4 h-4" />
                </button>
            </form>
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Layout className="w-6 h-6" />
            </div>

            <div className="mb-6 min-h-[48px] pr-8 flex flex-col justify-center group/title relative">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isSaving}
                            autoFocus
                            className="flex-1 text-lg font-semibold text-gray-900 border-b-2 border-orange-500 focus:outline-none bg-transparent px-1 py-0.5"
                        />
                        <button onClick={handleSave} disabled={isSaving} className="text-green-500 hover:text-green-600 p-1">
                            <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setIsEditing(false); setName(site.name); }} disabled={isSaving} className="text-gray-400 hover:text-red-500 p-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{site.name}</h3>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="ml-2 text-gray-300 hover:text-orange-500 opacity-0 group-hover/title:opacity-100 transition-opacity p-1"
                            title="Rename Project"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {!isEditing && (
                    <p className="text-sm text-gray-500 mt-1">
                        Updated {new Date(site.updated_at).toLocaleDateString()}
                    </p>
                )}
            </div>

            <div className="mt-auto flex gap-2">
                <Link
                    href={`/builder/${site.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium py-2 rounded-lg text-center transition-colors"
                >
                    Edit Site
                </Link>
                <Link
                    href={`/site/${site.id}`}
                    className="flex-1 bg-white border hover:bg-gray-50 text-gray-900 text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    target="_blank"
                >
                    <Globe className="w-4 h-4" /> View
                </Link>
            </div>
        </div>
    );
}
