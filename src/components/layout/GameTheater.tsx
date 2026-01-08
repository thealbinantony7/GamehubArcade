/**
 * GAME THEATER — In-Shell Game Overlay
 * Games open here, NOT as full pages. Lobby remains mounted underneath.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { getGame } from '@/data/games';

export default function GameTheater() {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const game = gameId ? getGame(gameId) : undefined;

    const handleClose = () => {
        navigate('/');
    };

    if (!game) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            >
                {/* Game Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="absolute inset-4 md:inset-8 lg:inset-16 bg-[hsl(220,20%,8%)] rounded-xl border border-white/10 overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Game Header */}
                    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-[hsl(220,20%,6%)]">
                        <button
                            onClick={handleClose}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-sm font-medium">Back to Lobby</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <div
                                className="h-6 w-6 rounded flex items-center justify-center"
                                style={{ background: game.hex }}
                            >
                                <game.icon className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-white">{game.name}</span>
                        </div>

                        <button
                            onClick={handleClose}
                            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Game Content Area */}
                    <div className="flex-1 flex items-center justify-center p-8 bg-[hsl(220,20%,5%)]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-center"
                        >
                            <div
                                className="inline-flex h-20 w-20 items-center justify-center rounded-2xl mb-6"
                                style={{ background: game.hex }}
                            >
                                <game.icon className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-3">
                                {game.name}
                            </h1>
                            <p className="text-white/50 mb-2">{game.tagline}</p>
                            <p className="text-sm text-white/30">
                                Game launching soon
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
