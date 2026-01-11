/**
 * LOBBY CONTENT — Casino Lobby
 * High Density, Left-Aligned, Professional Layout
 */

import { useState } from 'react';
import { Sparkles, Gamepad2, Disc, LayoutGrid, Flame, Zap, Trophy, TrendingUp } from 'lucide-react';
import { getAllGames } from '@/data/games';
import PromoBanner from '@/components/casino/PromoBanner';
import LiveWinsTicker from '@/components/casino/LiveWinsTicker';
import RoundAuditTable from '@/components/casino/RoundAuditTable';
import TrendingRow from '@/components/casino/TrendingRow';
import GameRow from '@/components/casino/GameRow';
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

    // Derived content lists (simulated for now)
    const originalsGames = allGames.filter((g) => g.id === 'crash' || g.id === 'plinko' || g.id === 'mines' || g.id === 'dice');
    const popularGames = allGames.filter((g) => g.category === 'slots' || g.category === 'table');
    const newReleases = [...allGames].reverse().slice(0, 5);

    // Fallback if specific filtered lists are empty (mock logic to ensure density)
    const displayOriginals = originalsGames.length > 0 ? originalsGames : allGames.slice(0, 4);
    const displayPopular = popularGames.length > 0 ? popularGames : allGames;

    return (
        <div id="main-content" className="w-full flex flex-col relative" style={{ contain: 'layout' }}>          {/* 1. Ticker (Edge-to-Edge) */}
            <div className="border-b border-white/5 bg-black/20 backdrop-blur-md relative z-30">
                <LiveWinsTicker />
            </div>

            <div className="flex flex-col space-y-8 pb-24 lg:pb-12">

                {/* 2. Hero Section (Compact Padding) */}
                <div className="space-y-4 pt-4 md:pt-6">
                    <PromoBanner />
                    <TrendingRow />
                </div>

                {/* 3. Filters Sticky Bar */}
                <div className="sticky top-16 z-40 bg-[hsl(220,24%,7%)]/95 backdrop-blur-xl py-2 border-b border-white/5 md:border-none">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        {FILTERS.map((f) => {
                            const Icon = f.icon;
                            const active = filter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    aria-pressed={active}
                                    aria-label={`${f.label} filter, ${active ? 'active' : 'inactive'}`}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap",
                                        active
                                            ? "bg-brand-red-base text-white shadow-red-glow"
                                            : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <Icon className={cn("h-3.5 w-3.5", active ? "text-white" : "text-white/70")} />
                                    {f.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* 4. Game Content Stack */}
                <div className="space-y-10">

                    {/* Originals Row (Landscape) */}
                    {(filter === 'all' || filter === 'originals') && (
                        <GameRow
                            title="CORE MODULES"
                            icon={Sparkles}
                            games={displayOriginals}
                            type="landscape"
                        />
                    )}

                    {/* High Rollers (Portrait) */}
                    {(filter === 'all' || filter === 'table') && (
                        <GameRow
                            title="HIGH VALUE"
                            icon={Trophy}
                            games={displayPopular.slice(0, 4)}
                            type="portrait"
                        />
                    )}

                    {/* New Releases (Portrait) */}
                    {(filter === 'all' || filter === 'slots') && (
                        <GameRow
                            title="LATEST LOG"
                            icon={Zap}
                            games={newReleases}
                            type="portrait"
                        />
                    )}

                    {/* Recommended / All Games (Portrait) */}
                    {(filter === 'all') && (
                        <GameRow
                            title="SYSTEM REGISTRY"
                            icon={TrendingUp}
                            games={allGames}
                            type="portrait"
                        />
                    )}

                    {/* Filtered View (Generic Grid) */}
                    {filter !== 'all' && filter !== 'originals' && (
                        <GameRow
                            title={`${filter.charAt(0).toUpperCase() + filter.slice(1)} Games`}
                            games={allGames.filter(g => g.category === filter)}
                            type="portrait"
                        />
                    )}
                </div>

                {/* 5. Live Bets Section (Obsidian) */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse relative z-10" />
                            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75" />
                        </div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Live Feed</h2>
                    </div>
                    <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
                        <RoundAuditTable />
                    </div>
                </div>
            </div>
        </div>
    );
}