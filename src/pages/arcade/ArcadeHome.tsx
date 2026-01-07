import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

// Import existing arcade games from GameHub
const ARCADE_GAMES = [
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: '⭕', description: 'Classic X and O game' },
    { id: 'memory', name: 'Memory Match', icon: '🧠', description: 'Test your memory' },
    { id: 'snake', name: 'Snake', icon: '🐍', description: 'Classic snake game' },
    { id: 'breakout', name: 'Breakout', icon: '🧱', description: 'Break all the bricks' },
    { id: 'flappy', name: 'Flappy Bird', icon: '🐦', description: 'Fly through pipes' },
    { id: 'tetris', name: 'Tetris', icon: '🟦', description: 'Stack the blocks' },
];

/**
 * Arcade home page - free-to-play games.
 * No auth required, no betting.
 */
export default function ArcadeHome() {
    return (
        <div className="space-y-8">
            {/* Hero */}
            <div className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Gamepad2 className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold">Arcade Games</h1>
                </div>
                <p className="text-muted-foreground">
                    Free to play — no account required!
                </p>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ARCADE_GAMES.map((game, index) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link to={`/arcade/play/${game.id}`}>
                            <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]">
                                {/* Icon */}
                                <div className="text-5xl mb-4">{game.icon}</div>

                                {/* Info */}
                                <h3 className="text-lg font-semibold">{game.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{game.description}</p>

                                {/* Play Button */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                    <span className="text-primary font-semibold">Play Now →</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* CTA to Casino */}
            <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                    Want to play for crypto? Check out the casino!
                </p>
                <Link
                    to="/casino"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:opacity-90 transition-opacity"
                >
                    🎰 Enter Casino
                </Link>
            </div>
        </div>
    );
}
