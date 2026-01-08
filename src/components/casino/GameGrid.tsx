/**
 * GAME GRID — V3 Graphic Cards
 * Replaces icons with strict Stake-style graphic tiles + hover play
 */

import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { GameDefinition } from '@/data/games';
import { CrashThumbnail, DiceThumbnail, MinesThumbnail, PlinkoThumbnail, TableThumbnail } from './GameThumbnails';

interface GameGridProps {
    games: GameDefinition[];
}

export default function GameGrid({ games }: GameGridProps) {
    const navigate = useNavigate();

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

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map(game => (
                <div
                    key={game.id}
                    onClick={() => navigate(`/casino/${game.id}`)}
                    className="group relative bg-[#1A1D24] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-200 shadow-lg hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] border border-white/5"
                >
                    {/* Graphic Thumbnail (Replaces Icon) */}
                    <div className="aspect-[16/10] w-full relative">
                        {getThumbnail(game.id)}

                        {/* Hover Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-200">
                                <Play className="w-5 h-5 text-black ml-1" fill="currentColor" />
                            </div>
                        </div>
                    </div>

                    {/* Info Footer */}
                    <div className="p-3 bg-[hsl(220,20%,10%)] border-t border-white/5 relative z-10">
                        <h3 className="text-sm font-bold text-white tracking-wide">
                            {game.name}
                        </h3>
                        <p className="text-[10px] uppercase font-bold text-white/30 mt-0.5 tracking-wider">
                            GameHub Original
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
