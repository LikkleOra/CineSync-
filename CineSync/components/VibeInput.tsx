'use client';

interface VibeInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function VibeInput({ value, onChange }: VibeInputProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">3. Match The Vibe (Optional)</h3>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='"Shrek", "Inception", "A quiet rainy day"'
                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/50 focus:ring-0 transition-colors"
            />
        </div>
    );
}
