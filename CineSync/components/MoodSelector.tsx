'use client';

import { Smile, Flame, Coffee, Ghost, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Mood = 'Chill' | 'Hype' | 'Cozy' | 'Scared' | 'Emotional';

interface MoodSelectorProps {
    selectedMood: Mood | null;
    onSelect: (mood: Mood) => void;
}

const moods: { label: Mood; icon: React.ElementType }[] = [
    { label: 'Chill', icon: Smile },
    { label: 'Hype', icon: Flame },
    { label: 'Cozy', icon: Coffee },
    { label: 'Scared', icon: Ghost },
    { label: 'Emotional', icon: Heart },
];

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">1. Pick Your Mood</h3>
            <div className="flex flex-wrap gap-3">
                {moods.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        onClick={() => onSelect(label)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200",
                            selectedMood === label
                                ? "bg-white/10 border-white text-white"
                                : "bg-transparent border-white/20 text-muted-foreground hover:border-white/50 hover:text-white"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
