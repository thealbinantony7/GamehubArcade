/**
 * GAME GRID — V3 Graphic Cards
 * Replaces icons with strict Stake-style graphic tiles + hover play
 */

import { GameDefinition } from '@/data/games';
import GameCard from './GameCard';

interface GameGridProps {
    games: GameDefinition[];
}

export default function GameGrid({ games }: GameGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {games.map(game => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    );
}
