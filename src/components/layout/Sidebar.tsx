/**
 * SIDEBAR — Persistent Navigation
 * Logo + Nav + Game List
 */

import { Link, useLocation } from 'react-router-dom';
import { Diamond, Home, Trophy, Gift, Dices, TrendingUp, CircleDot, Bomb, Disc, Spade, Ticket, Gamepad2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { label: 'Lobby', icon: Home, path: '/' },
    { label: 'Casino', icon: Gamepad2, path: '/?filter=all' },
    { label: 'Originals', icon: Sparkles, path: '/?filter=originals' },
    { label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { label: 'Promotions', icon: Gift, path: '/promotions' },
];

const GAMES = [
    { id: 'dice', label: 'Dice', icon: Dices },
    { id: 'crash', label: 'Crash', icon: TrendingUp },
    { id: 'mines', label: 'Mines', icon: Bomb },
    { id: 'plinko', label: 'Plinko', icon: CircleDot },
    { id: 'roulette', label: 'Roulette', icon: Disc },
    { id: 'blackjack', label: 'Blackjack', icon: Spade },
    { id: 'slots', label: 'Slots', icon: Ticket },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-[hsl(220,20%,8%)] border-r border-white/5 h-screen sticky top-0 z-30">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 px-6 py-6 transition-opacity hover:opacity-80">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[hsl(0,85%,55%)] to-[hsl(0,85%,45%)] flex items-center justify-center shadow-[0_0_20px_hsla(0,85%,55%,0.3)]">
                    <Diamond className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">GameHub</span>
            </Link>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-6">
                <div className="px-4 space-y-1">
                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (location.search.includes(item.path.split('?')[1] || 'xyz')); // Basic active check logic hack
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                                    isActive
                                        ? "bg-white/10 text-white shadow-inner"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-[hsl(0,85%,60%)]" : "text-white/40 group-hover:text-white")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="my-6 mx-6 border-t border-white/5" />

                {/* Games */}
                <div className="px-4 space-y-1">
                    <div className="px-4 py-3 text-xs font-bold text-white/30 uppercase tracking-widest">
                        Games
                    </div>
                    {GAMES.map(game => {
                        const Icon = game.icon;
                        const isActive = location.pathname === `/play/${game.id}`;
                        return (
                            <Link
                                key={game.id}
                                to={`/play/${game.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-[hsl(0,85%,60%)]" : "text-white/30 group-hover:text-white")} />
                                {game.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </aside>
    );
}
