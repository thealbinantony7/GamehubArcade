
import { Link, useNavigate } from 'react-router-dom';
import { useCasino } from '@/contexts/CasinoContext';
import { motion } from 'framer-motion';
import {
    Dices, TrendingUp, CircleDot, Bomb, Disc, Spade, Ticket,
    ArrowRight, Lock, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const CASINO_GAMES = [
    { id: 'dice', name: 'Dice', icon: Dices, color: 'from-blue-500 to-indigo-600', description: 'slider-based probability' },
    { id: 'crash', name: 'Crash', icon: TrendingUp, color: 'from-red-500 to-pink-600', description: 'multiplier timing' },
    { id: 'plinko', name: 'Plinko', icon: CircleDot, color: 'from-green-400 to-emerald-600', description: 'pegboard physics' },
    { id: 'mines', name: 'Mines', icon: Bomb, color: 'from-orange-500 to-amber-600', description: 'grid sweeping' },
    { id: 'roulette', name: 'Roulette', icon: Disc, color: 'from-purple-500 to-violet-600', description: 'wheel of fortune' },
    { id: 'blackjack', name: 'Blackjack', icon: Spade, color: 'from-gray-800 to-black border border-white/20', description: 'card strategy' },
    { id: 'slots', name: 'Slots', icon: Ticket, color: 'from-yellow-400 to-orange-500', description: 'spinning reels' },
];

export default function CasinoHome() {
    const { mode, bettingEnabled } = useCasino();
    const navigate = useNavigate();

    return (
        <div className="space-y-8 pb-20">
            {/* Hero */}
            <div className="text-center py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium mb-4 border border-amber-500/20"
                >
                    {mode === 'demo' ? '🎮 Demo Mode Active' : '💰 Real Money Active'}
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    Casino Floor
                </h1>
                <p className="text-white/50 max-w-lg mx-auto text-sm md:text-base">
                    {mode === 'demo'
                        ? 'Practice with virtual credits. No financial risk.'
                        : 'High stakes. Provably fair. Good luck.'}
                </p>
            </div>

            {/* Betting Disabled Warning (if global kill switch) */}
            {!bettingEnabled && (
                <div className="mx-auto max-w-2xl p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4 text-red-500 mb-8">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold">Betting Paused</h3>
                        <p className="text-sm opacity-80">Platform administrators have temporarily disabled betting.</p>
                    </div>
                </div>
            )}

            {/* Game Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
                {CASINO_GAMES.map((game, index) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            to={bettingEnabled ? `/casino/play/${game.id}` : '#'}
                            className={`block relative group ${!bettingEnabled && 'cursor-not-allowed opacity-60'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
                            <div className="relative overflow-hidden rounded-3xl bg-[#151515] border border-white/5 p-6 hover:border-amber-500/30 transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">

                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <game.icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
                                <p className="text-xs text-white/40 mb-6 uppercase tracking-wider">{game.description}</p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="text-xs text-white/20">Provably Fair</div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${bettingEnabled ? 'bg-amber-500 text-black group-hover:scale-110' : 'bg-white/10 text-white/20'}`}>
                                        {bettingEnabled ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-8 border-t border-white/5 mt-12">
                <p className="text-white/40 text-sm mb-4">Just looking for fun?</p>
                <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 hover:text-white rounded-full px-6"
                    onClick={() => navigate('/arcade')}
                >
                    Back to Arcade
                </Button>
            </div>
        </div>
    );
}
