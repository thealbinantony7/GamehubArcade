/**
 * FEATURED CAROUSEL — Horizontal scroll
 * Large game tiles for featured games
 */

import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameDefinition } from '@/data/games';
import { useRef } from 'react';
import { CrashThumbnail, DiceThumbnail, MinesThumbnail, PlinkoThumbnail, TableThumbnail } from './GameThumbnails';

interface FeaturedCarouselProps {
    games: GameDefinition[];
}

export default function FeaturedCarousel({ games }: FeaturedCarouselProps) {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getThumbnail = (gameId: string) => {
        switch (gameId) {
            case 'crash': return <CrashThumbnail className="bg-transparent" />;
            case 'dice': return <DiceThumbnail className="bg-transparent" />;
            case 'mines': return <MinesThumbnail className="bg-transparent" />;
            case 'plinko': return <PlinkoThumbnail className="bg-transparent" />;
            case 'roulette': return <TableThumbnail type="roulette" />;
            case 'blackjack': return <TableThumbnail type="blackjack" />;
            case 'slots': return <TableThumbnail type="slots" />;
            default: return <TableThumbnail />;
        }
    };

    return (
        <div className="relative group">
            {/* Scroll Buttons */}
            <button
                onClick={() => scroll('left')}
                aria-label="Previous games"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
                onClick={() => scroll('right')}
                aria-label="Next games"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="h-5 w-5 text-white" />
            </button>

            {/* Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {games.slice(0, 5).map(game => {
                    return (
                        <div
                            key={game.id}
                            onClick={() => navigate(`/casino/${game.id}`)}
                            className="group/card relative flex-shrink-0 w-[320px] h-[180px] bg-gradient-to-br from-[hsl(220,16%,16%)] to-[hsl(220,16%,12%)] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/5 hover:border-white/10"
                        >
                            {/* Graphic Background (CSS Art) */}
                            <div className="absolute inset-0 opacity-80 group-hover/card:scale-105 transition-transform duration-500">
                                {getThumbnail(game.id)}
                            </div>

                            {/* Content Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent" />

                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 p-5 w-full">
                                <h3 className="text-xl font-bold text-white mb-1 tracking-tight drop-shadow-md">
                                    {game.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-white/70 uppercase tracking-wider">
                                        {game.category}
                                    </p>
                                    <span className="text-xs font-bold text-[hsl(145,70%,45%)] bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                                        Live
                                    </span>
                                </div>
                            </div>

                            {/* Hover Overlay with Play Button */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="flex items-center gap-2 px-5 py-3 bg-brand-red-base rounded-full shadow-red-glow transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 active:scale-95">
                                    <Play className="h-5 w-5 text-white" fill="white" />
                                    <span className="text-sm font-bold text-white uppercase tracking-wide">Play Now</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
