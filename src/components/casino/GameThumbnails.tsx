/**
 * GAME THUMBNAILS — CSS Micro-Art
 * Graphic representations of games to replace generic icons
 */

import { cn } from "@/lib/utils";

// ============================================================================
// CRASH — Rising Graph
// ============================================================================
export function CrashThumbnail({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-full h-full bg-[#1A1D24] overflow-hidden", className)}>
            {/* Grid Lines */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Rocket Curve */}
            <svg className="absolute bottom-0 left-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                    d="M0,100 Q40,90 60,60 T100,0"
                    fill="none"
                    stroke="hsl(0, 85%, 60%)"
                    strokeWidth="4"
                    className="drop-shadow-[0_0_8px_rgba(255,50,50,0.5)]"
                />
                {/* Glow under curve */}
                <path
                    d="M0,100 Q40,90 60,60 T100,0 V100 H0 Z"
                    fill="url(#crashGradient)"
                    opacity="0.2"
                />
                <defs>
                    <linearGradient id="crashGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(0, 85%, 60%)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Multiplier Text */}
            <div className="absolute top-4 right-4 text-white font-bold text-lg drop-shadow-md">
                2.45x
            </div>
        </div>
    );
}

// ============================================================================
// DICE — Slider Bar
// ============================================================================
export function DiceThumbnail({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-full h-full bg-[#1A1D24] overflow-hidden flex items-center justify-center px-4", className)}>
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(280,70%,20%)] to-transparent opacity-50" />

            {/* Slider Track */}
            <div className="w-full h-3 bg-white/10 rounded-full relative overflow-hidden">
                {/* Fill */}
                <div className="absolute left-0 top-0 h-full w-[60%] bg-[hsl(280,70%,60%)] shadow-[0_0_10px_hsl(280,70%,60%)]" />
            </div>

            {/* Current Value */}
            <div className="absolute top-1/2 left-[60%] -translate-y-[150%] -translate-x-1/2 bg-white text-[hsl(280,70%,40%)] text-xs font-bold px-2 py-0.5 rounded shadow-lg">
                60.00
            </div>
        </div>
    );
}

// ============================================================================
// MINES — Grid
// ============================================================================
export function MinesThumbnail({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-full h-full bg-[#1A1D24] overflow-hidden p-6", className)}>
            {/* Radial Gradient BG */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(30,80%,15%),transparent)]" />

            {/* Grid */}
            <div className="grid grid-cols-5 gap-1.5 h-full w-full opacity-80">
                {[...Array(25)].map((_, i) => (
                    <div key={i} className={`rounded-sm ${i === 12 ? 'bg-[hsl(30,80%,55%)] shadow-[0_0_8px_hsl(30,80%,55%)]' : 'bg-white/10'}`}>
                        {i === 12 && (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// PLINKO — Pyramid
// ============================================================================
export function PlinkoThumbnail({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-full h-full bg-[#1A1D24] overflow-hidden flex flex-col items-center justify-end pb-2", className)}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[hsl(200,70%,10%)]" />

            {/* Pins */}
            <div className="flex flex-col gap-1 items-center pb-4">
                <div className="w-1 h-1 bg-white/30 rounded-full" />
                <div className="flex gap-2"><div className="w-1 h-1 bg-white/30 rounded-full" /><div className="w-1 h-1 bg-white/30 rounded-full" /></div>
                <div className="flex gap-2"><div className="w-1 h-1 bg-white/30 rounded-full" /><div className="w-1 h-1 bg-white/30 rounded-full" /><div className="w-1 h-1 bg-white/30 rounded-full" /></div>

                {/* Falling Ball */}
                <div className="w-2 h-2 bg-[hsl(200,70%,60%)] rounded-full shadow-[0_0_6px_hsl(200,70%,60%)] absolute top-[30%] left-[52%]" />
            </div>

            {/* Buckets */}
            <div className="flex gap-1 w-full justify-center px-4">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-sm ${i === 3 ? 'bg-[hsl(0,80%,55%)]' : 'bg-[hsl(200,70%,30%)]'}`} />
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// GENERIC / TABLE — Cards/Chips
// ============================================================================
export function TableThumbnail({ className, type = 'blackjack' }: { className?: string, type?: 'blackjack' | 'roulette' | 'slots' }) {
    const color = type === 'roulette' ? 'hsl(145, 70%, 45%)' : type === 'slots' ? 'hsl(50, 90%, 55%)' : 'hsl(0, 0%, 40%)';

    return (
        <div className={cn("relative w-full h-full bg-[#1A1D24] overflow-hidden", className)}>
            <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(45deg, ${color}, transparent)` }} />

            {/* Center Graphic */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[60%] h-[60%] border-2 border-white/10 rounded-lg flex items-center justify-center transform rotate-12 bg-white/5 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shadow-inner" style={{ background: `${color}20` }}>
                        {/* Chip or Symbol */}
                        <div className="w-8 h-8 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
