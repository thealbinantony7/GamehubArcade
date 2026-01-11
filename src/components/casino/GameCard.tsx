/**
 * GAME CARD v2 — Premium Casino Tile
 * 16:10 aspect ratio, interactive hover state, liquid glass finish.
 * Replaces the basic div blocks in GameGrid.
 */

import { useState, memo } from 'react';
import { Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GameDefinition } from '@/data/games';
import {
    CrashThumbnail,
    DiceThumbnail,
    MinesThumbnail,
    PlinkoThumbnail,
    TableThumbnail
} from './GameThumbnails';
import { cn } from '@/lib/utils';

interface GameCardProps {
    game: GameDefinition;
    featured?: boolean;
}

export default memo(function GameCard({ game, featured, variant = 'landscape' }: GameCardProps & { variant?: 'landscape' | 'portrait' | 'square' }) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const getThumbnail = (gameId: string) => {
        switch (gameId) {
            case 'crash': return <CrashThumbnail />;
            case 'dice': return <DiceThumbnail />;
            case 'mines': return <MinesThumbnail />;
            case 'plinko': return <PlinkoThumbnail />;
            case 'roulette': return <TableThumbnail type="roulette" />;
            case 'blackjack': return <TableThumbnail type="blackjack" />;
            case 'slots': return <TableThumbnail type="slots" />;
            default: return <TableThumbnail />;
        }
    };

    const aspectRatioClass = {
        landscape: 'aspect-[16/10]',
        portrait: 'aspect-[3/4]',
        square: 'aspect-square'
    }[variant];

    return (
        <Link
            to={`/casino/${game.id}`}
            aria-label={`Play ${game.name}, ${game.category || 'casino'} game`}
            className="block w-full h-full outline-none focus-visible:ring-2 focus-visible:ring-brand-red-base rounded-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="group relative w-full cursor-pointer isolate">
                {/* Card Container */}
                <div className={cn(
                    "relative overflow-hidden rounded-xl bg-brand-obsidian-glass border transition-all duration-300",
                    featured
                        ? "border-brand-red-base/20 group-hover:border-brand-red-base/40 group-hover:shadow-red-glow"
                        : "border-white/5 group-hover:border-white/10 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]",
                    "group-hover:-translate-y-1"
                )}>

                    {/* 1. Thumbnail Layer */}
                    <div className={cn("w-full relative overflow-hidden", aspectRatioClass)}>
                        {/* The Visual */}
                        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                            {getThumbnail(game.id)}
                        </div>

                        {/* Gradient Overlay (Always on for text readability) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,8%)] via-transparent to-transparent opacity-60" />

                        {/* Hover Overlay (Darkens for button pop) */}
                        <div className={cn(
                            "absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}>
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transform scale-75 transition-all duration-300 group-hover:scale-100",
                                featured
                                    ? "bg-brand-red-base shadow-red-glow"
                                    : "bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            )}>
                                <Play className={cn("w-5 h-5 ml-0.5", featured ? "text-white" : "text-black")} fill="currentColor" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Info Footer */}
                    <div className="px-3 py-3 border-t border-white/5 bg-[#171b21] group-hover:bg-[#1e232b] transition-colors relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-white transition-colors">
                                    {game.name}
                                </h3>
                                <p className="text-[10px] uppercase font-bold text-white/30 mt-0.5 tracking-wider group-hover:text-white/50 transition-colors">
                                    Original
                                </p>
                            </div>

                            {/* Example 'Live' or 'RTP' Badge potential */}
                            {featured && (
                                <div className="px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                                    <span className="text-[9px] font-bold text-amber-500 uppercase">Hot</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
});
