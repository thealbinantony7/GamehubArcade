/**
 * PLAY — Casino Game Shell
 * Table-like layout. Centered canvas. Minimal.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getGame, GameDefinition } from '@/data/games';

// =============================================================================
// GAME PLACEHOLDER — Table layout
// =============================================================================

function GamePlaceholder({ game }: { game: GameDefinition }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[hsl(0,0%,5%)] flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-white/5">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm">Exit</span>
                </button>
                <div className="flex items-center gap-2">
                    <div
                        className="h-6 w-6 rounded flex items-center justify-center"
                        style={{ background: game.hex }}
                    >
                        <game.icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/80">{game.name}</span>
                </div>
                <div className="w-16" />
            </div>

            {/* Game canvas area */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div
                        className="inline-flex h-16 w-16 items-center justify-center rounded-xl mb-6"
                        style={{ background: game.hex }}
                    >
                        <game.icon className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white/90 mb-2">
                        {game.name}
                    </h1>
                    <p className="text-white/35 mb-1">{game.tagline}</p>
                    <p className="text-sm text-white/25">
                        Launching soon
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

// =============================================================================
// NOT FOUND
// =============================================================================

function GameNotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[hsl(0,0%,5%)] flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-xl font-medium text-white/80 mb-3">
                    Game not found
                </h1>
                <button
                    onClick={() => navigate('/')}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors"
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}

// =============================================================================
// MAIN
// =============================================================================

export default function Play() {
    const { gameId } = useParams<{ gameId: string }>();
    const game = gameId ? getGame(gameId) : undefined;

    if (!game) {
        return <GameNotFound />;
    }

    return <GamePlaceholder game={game} />;
}
