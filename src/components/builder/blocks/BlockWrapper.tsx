import React from 'react';
import { LayoutTemplate, GripVertical, Trash2, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { BlockLayout } from '../types';

export default function BlockWrapper({
    children,
    isActive,
    onClick,
    onDelete,
    onMoveUp,
    onMoveDown,
    onDuplicate,
    isFirst,
    isLast,
    layout,
    viewport = 'desktop'
}: {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDuplicate: () => void;
    isFirst: boolean;
    isLast: boolean;
    layout?: BlockLayout;
    viewport?: 'desktop' | 'tablet' | 'mobile';
}) {
    const maxWClass = layout?.width === 'full' ? 'max-w-none' : layout?.width === 'narrow' ? 'max-w-3xl' : 'max-w-6xl';

    // Convert children to pass viewport prop if they are valid React elements
    const childrenWithViewport = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { viewport } as any);
        }
        return child;
    });

    return (
        <div
            className={`p-6 rounded-xl border bg-transparent cursor-pointer transition-all group relative mx-auto ${maxWClass} ${isActive ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'border-dashed border-gray-200 hover:border-blue-300'}`}
            onClick={onClick}
        >
            {/* The actual content */}
            <div className={`relative z-10 w-full`}>
                {childrenWithViewport}
            </div>
            <div className="absolute -top-3 -right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-md shadow-sm border z-10">
                <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1.5 text-gray-400 hover:text-blue-500"><Copy className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
        </div>
    );
}
