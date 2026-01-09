/**
 * LOBBY CONTENT — Casino Lobby (extracted from Home)
 * High Density / Liquid Glass visuals
 */

import { useState } from 'react';
import { Sparkles, Gamepad2, Disc, LayoutGrid } from 'lucide-react';
import { getAllGames } from '@/data/games';
import GameGrid from '@/components/casino/GameGrid';
import RecentBets from '@/components/casino/RecentBets';
import LiveWinsTicker from '@/components/casino/LiveWinsTicker';
import PromoBanner from '@/components/casino/PromoBanner';
import FeaturedCarousel from '@/components/casino/FeaturedCarousel';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'originals' | 'table' | 'slots';

const FILTERS: { id: Filter; label: string; icon: any }[] = [
    { id: 'all', label: 'Lobby', icon: LayoutGrid },
    { id: 'originals', label: 'Originals', icon: Sparkles },
    { id: 'table', label: 'Table Games', icon: Disc },
    { id: 'slots', label: 'Slots', icon: Gamepad2 },
];

export default function LobbyContent() {
    const [filter, setFilter] = useState<Filter>('all');
    const allGames = getAllGames();

    const filteredGames = filter === 'all'
        ? allGames
        : allGames.filter(g => g.category === filter); // Assuming 'category' field matches filter logic, or we expand logic

    return (
        <>
            {/* Section 1: Live Wins Ticker (Slim Header Integration) */}
            <div className="border-b border-white/5 bg-black/20 backdrop-blur-md">
                <LiveWinsTicker />
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-8 pb-24 lg:pb-12">

                {/* Section 2: Hero & Promo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Banner (2/3 width) */}
                    <div className="lg:col-span-2">
                        <PromoBanner />
                    </div>

                    {/* Featured Mini-Carousel (1/3 width) */}
                    <div className="hidden lg:block h-full min-h-[200px] bg-[hsl(220,20%,10%)] rounded-xl border border-white/5 p-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,20%,12%)] to-[hsl(220,20%,8%)]" />
                        <div className="relative z-10 h-full flex flex-col">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-auto">
                                <Sparkles className="h-4 w-4 text-amber-400" />
                                Trending Now
                            </h3>
                            {/* Simplified Featured View for Density */}
                            <div className="mt-4">
                                <FeaturedCarousel games={allGames.slice(0, 3)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Main Game Grid with Glass Filters */}
                <div className="space-y-6">
                    {/* Filters Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 py-2 -mx-2 px-2 md:static md:p-0 bg-[hsl(220,20%,8%)]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none">
                        <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm overflow-x-auto scrollbar-hide">
                            {FILTERS.map((f) => {
                                const Icon = f.icon;
                                const active = filter === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => setFilter(f.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap",
                                            active
                                                ? "bg-[hsl(0,85%,60%)] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                                : "text-white/40 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <Icon className={cn("h-3.5 w-3.5", active ? "text-white" : "text-white/40")} />
                                        {f.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Search or Sort (Future) */}
                        <div className="text-xs font-medium text-white/30 hidden sm:block">
                            Showing {filteredGames.length} Games
                        </div>
                    </div>

                    <GameGrid games={filteredGames} />
                </div>

                {/* Section 4: Live Bets Table (Obsidian Style) */}
                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse relative z-10" />
                            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75" />
                        </div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Live Feed</h2>
                    </div>
                    <div className="glass-panel rounded-xl overflow-hidden">
                        <RecentBets />
                    </div>
                </div>
            </div>
        </>
    );
}
