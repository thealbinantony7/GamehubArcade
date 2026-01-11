/**
 * TRENDING ROW
 * Compact horizontal scroll showing hot games/events.
 * Replaces the old "Featured Carousel".
 */

import { Flame, TrendingUp, Users } from 'lucide-react';

const TRENDING_ITEMS = [
    { id: 1, label: 'Crash: 100x Multiplier Hit!', icon: Flame, color: 'text-amber-500' },
    { id: 2, label: 'Plinko: Live Event Starting', icon: TrendingUp, color: 'text-green-500' },
    { id: 3, label: 'Blackjack: High Roller Table Open', icon: Users, color: 'text-blue-500' },
    { id: 4, label: 'New Game: Space Miners', icon: Flame, color: 'text-red-500' },
    { id: 5, label: 'Tournament: $5k Prize Pool', icon: TrendingUp, color: 'text-purple-500' },
];

export default function TrendingRow() {
    return (
        <div className="w-full overflow-hidden bg-[hsl(220,20%,8%)] border-y border-white/5">
            <div className="max-w-[1600px] px-4 md:px-6 py-2 flex items-center gap-6 overflow-x-auto scrollbar-hide mask-edges" tabIndex={0} role="region" aria-label="Trending games">
                <div className="flex-shrink-0 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
                    <Flame className="h-3 w-3 text-brand-red-base" />
                    <span>Trending</span>
                </div>

                <div className="flex items-center gap-8">
                    {TRENDING_ITEMS.map((item) => (
                        <div key={item.id} className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
                            <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .mask-edges {
                    mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
                }
            `}</style>
        </div>
    );
}
