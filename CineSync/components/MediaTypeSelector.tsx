'use client';

import { Film, Tv, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MediaType = 'movie' | 'tv' | 'any';

interface MediaTypeSelectorProps {
    selectedType: MediaType;
    onSelect: (type: MediaType) => void;
}

const types: { id: MediaType; label: string; icon: React.ElementType }[] = [
    { id: 'movie', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'any', label: 'Any', icon: Sparkles },
];

export function MediaTypeSelector({ selectedType, onSelect }: MediaTypeSelectorProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">2. Choose Media Type</h3>
            <div className="grid grid-cols-3 gap-4">
                {types.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => onSelect(id)}
                        className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 gap-3",
                            selectedType === id
                                ? "bg-white/10 border-white text-white"
                                : "bg-transparent border-white/20 text-muted-foreground hover:border-white/50 hover:text-white"
                        )}
                    >
                        <Icon className="w-8 h-8" />
                        <span className="text-sm font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
