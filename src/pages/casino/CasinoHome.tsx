
import { Link, useNavigate } from 'react-router-dom';
import { useCasino } from '@/contexts/CasinoContext';
import { motion } from 'framer-motion';
import { CASINO_GAMES } from "@/data/games/casinoGames";
import { ArrowRight, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CasinoHome() {
    const { mode, bettingEnabled } = useCasino();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8 pb-32">

            {/* Betting Disabled Warning */}
            {mode === 'real' && !bettingEnabled && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3"
                >
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        Real money betting is currently disabled. Please play in Demo Mode or check back later.
                    </p>
                </motion.div>
            )}

            {/* Header / Hero */}
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        Casino Floor
                    </span>
                    <span className="text-xs font-mono py-1 px-2 rounded bg-white/5 border border-white/10 text-white/50">
                        {CASINO_GAMES.length} GAMES
                    </span>
                </h1>
                <p className="text-white/60 max-w-2xl">
                    Provably fair crypto gaming. Verify every roll on the blockchain.
                    {mode === 'demo' && " You are currently in DEMO mode."}
                </p>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {CASINO_GAMES.map((game, i) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                            if (mode === 'real' && !bettingEnabled) return;
                            navigate(`/casino/play/${game.id}`);
                        }}
                        className={`
                            relative group cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] 
                            hover:border-amber-500/30 hover:bg-[#222] transition-all duration-300
                            ${(mode === 'real' && !bettingEnabled) ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                        `}
                    >
                        {/* Background Gradient */}
                        <div className={`
                            absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${game.color} 
                            opacity-5 blur-2xl rounded-full group-hover:opacity-10 transition-opacity
                        `} />

                        <div className="p-6 relative z-10">
                            {/* Icon */}
                            <div className={`
                                w-12 h-12 rounded-xl flex items-center justify-center mb-6
                                bg-gradient-to-br ${game.color} text-white shadow-lg
                                group-hover:scale-110 transition-transform duration-300
                            `}>
                                <game.icon className="w-6 h-6" />
                            </div>

                            {/* Text */}
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                                {game.title}
                            </h3>
                            <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                                {game.description}
                            </p>

                            {/* Play Button */}
                            <div className="mt-6 flex items-center text-sm font-bold text-amber-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                PLAY NOW <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>

                        {/* Lock Overlay if disabled */}
                        {(mode === 'real' && !bettingEnabled) && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                <Lock className="w-8 h-8 text-white/50" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-20 border-t border-white/5 pt-8 text-center text-white/20 text-sm">
                <p>Provably Fair • Instant Withdrawals • 24/7 Support</p>
            </div>
        </div>
    );
}
