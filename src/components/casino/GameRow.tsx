/**
 * GAME ROW
 * Standardized horizontal section for game lists.
 * Supports different density modes (landscape vs portrait).
 */

import { ArrowRight } from 'lucide-react';
import { GameDefinition } from '@/data/games';
import GameCard from './GameCard';
import { cn } from '@/lib/utils';

interface GameRowProps {
    title: string;
    icon?: any;
    games: GameDefinition[];
    type?: 'landscape' | 'portrait'; // Determines aspect ratio
    className?: string;
}

export default function GameRow({ title, icon: Icon, games, type = 'portrait', className }: GameRowProps) {
    return (
        <section className={cn("space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-white">
                    {Icon && <Icon className="h-5 w-5 text-brand-red-base" />}
                    <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                </div>

                <button className="group flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors">
                    View All
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            {/* Grid */}
            <div className={cn(
                "grid gap-4",
                type === 'landscape'
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" // Wider cards
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8" // Dense grid
            )}>
                {games.map((game, i) => (
                    <div key={game.id} className={cn(
                        /* Aspect Ratio Control override if needed, but GameCard handles internal aspect */
                    )}>
                        {/* 
                           For layout density, we might pass a 'variant' to GameCard 
                           if we want strictly different inner layouts.
                           For now, we just control grid columns.
                       */}
                        <GameCard game={game} featured={i < 2} variant={type} />
                    </div>
                ))}
            </div>
        </section>
    );
}
