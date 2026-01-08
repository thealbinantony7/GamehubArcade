/**
 * HOME — V3 CASINO LOBBY
 * High density, constant motion, graphic visuals
 */

import { useState, useEffect } from 'react';
import { getAllGames } from '@/data/games';
import TopBar from '@/components/layout/TopBar';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import GameGrid from '@/components/casino/GameGrid';
import RecentBets from '@/components/casino/RecentBets';
import LiveWinsTicker from '@/components/casino/LiveWinsTicker';
import PromoBanner from '@/components/casino/PromoBanner';
import FeaturedCarousel from '@/components/casino/FeaturedCarousel';

type Filter = 'all' | 'originals' | 'table';

export default function Home() {
    const [filter, setFilter] = useState<Filter>('all');
    // Open by default on desktop (lg = 1024px)
    const [sidebarOpen, setSidebarOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
    );
    const allGames = getAllGames();

    // Handle resize to auto-open on desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && !sidebarOpen) {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    const filteredGames = filter === 'all'
        ? allGames
        : allGames.filter(g => g.category === filter);

    return (
        <div className="flex min-h-screen bg-[hsl(220,24%,7%)] text-white font-sans antialiased overflow-hidden">
            <CollapsibleSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <TopBar onMenuClick={() => setSidebarOpen(true)} showMenuButton={!sidebarOpen} />

                {/* Main Content Area - Scrollable */}
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                    {/* Section 1: Live Wins Ticker (Social Proof) */}
                    <LiveWinsTicker />

                    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-10">

                        {/* Section 2: Promo & Featured - Split Layout or Stacked */}
                        <div className="flex flex-col gap-6">
                            <PromoBanner />

                            {/* Featured Carousel (Originals) */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <span className="text-[hsl(0,85%,60%)]">🔥</span> Featured
                                    </h2>
                                </div>
                                <FeaturedCarousel games={allGames} />
                            </div>
                        </div>

                        {/* Section 3: Main Game Grid */}
                        <div className="space-y-6">
                            {/* Filters */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
                                    {(['all', 'originals', 'table'] as Filter[]).map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${filter === f
                                                ? 'bg-[hsl(0,85%,60%)] text-white shadow-lg shadow-red-500/20'
                                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {f === 'all' ? 'Lobby' : f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <GameGrid games={filteredGames} />
                        </div>

                        {/* Section 4: Live Bets Table */}
                        <div className="pb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <h2 className="text-base font-bold text-white/80">Live Bets</h2>
                            </div>
                            <RecentBets />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
