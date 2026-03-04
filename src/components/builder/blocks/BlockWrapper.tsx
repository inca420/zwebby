import { Trash2, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { ReactNode } from 'react';
import { BlockLayout } from '../types';

type BlockWrapperProps = {
    id: string;
    isActive: boolean;
    layout?: BlockLayout;
    onClick: () => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDuplicate: () => void;
    children: ReactNode;
    isFirst: boolean;
    isLast: boolean;
};

export default function BlockWrapper({
    isActive, layout, onClick, onRemove, onMoveUp, onMoveDown, onDuplicate, children, isFirst, isLast
}: BlockWrapperProps) {

    // Evaluate Width Configuration
    let maxWClass = 'max-w-4xl'; // Default
    if (layout?.width === 'narrow') maxWClass = 'max-w-2xl';
    if (layout?.width === 'wide') maxWClass = 'max-w-6xl';
    if (layout?.width === 'full') maxWClass = 'max-w-full';

    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-xl border bg-white cursor-pointer transition-all group relative mx-auto ${maxWClass} ${isActive ? 'border-orange-500 ring-1 ring-orange-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
        >
            <div className="absolute -top-3 -right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-md shadow-sm border z-10">
                <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1.5 text-gray-400 hover:text-blue-500"><Copy className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            {children}
        </div>
    );
}
