import { Link } from 'react-router-dom';
import { useCasino } from '@/contexts/CasinoContext';
import { motion } from 'framer-motion';

const CASINO_GAMES = [
    { id: 'dice', name: 'Dice', icon: '🎲', description: 'Predict the roll outcome' },
    { id: 'crash', name: 'Crash', icon: '📈', description: 'Cash out before it crashes' },
    { id: 'plinko', name: 'Plinko', icon: '⚪', description: 'Drop the ball, win big' },
    { id: 'mines', name: 'Mines', icon: '💣', description: 'Avoid the mines' },
    { id: 'roulette', name: 'Roulette', icon: '🎡', description: 'Classic casino roulette' },
    { id: 'blackjack', name: 'Blackjack', icon: '🃏', description: 'Beat the dealer to 21' },
    { id: 'slots', name: 'Slots', icon: '🎰', description: 'Spin to win' },
];

/**
 * Casino home page - game grid.
 * Shows all available casino games.
 */
export default function CasinoHome() {
    const { mode, bettingEnabled } = useCasino();

    return (
        <div className="space-y-8">
            {/* Hero */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Choose Your Game
                </h1>
                <p className="text-white/60 mt-2">
                    {mode === 'demo'
                        ? 'Playing with demo credits — no real money involved'
                        : 'Playing with real cryptocurrency — bet responsibly'}
                </p>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {CASINO_GAMES.map((game, index) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            to={bettingEnabled ? `/casino/play/${game.id}` : '#'}
                            className={`block ${!bettingEnabled ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-[1.02]">
                                {/* Icon */}
                                <div className="text-5xl mb-4">{game.icon}</div>

                                {/* Info */}
                                <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                                <p className="text-sm text-white/50 mt-1">{game.description}</p>

                                {/* Play Button */}
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                    <span className="text-amber-400 font-semibold">Play Now →</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Disclaimer */}
            <div className="text-center text-white/40 text-xs max-w-2xl mx-auto">
                <p>
                    This platform is for entertainment purposes only. All games are provably fair.
                    {mode === 'real' && ' Gambling involves risk. Only bet what you can afford to lose.'}
                </p>
            </div>
        </div>
    );
}
