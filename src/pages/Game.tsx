/**
 * GAME PAGE — Dominant Game State
 * Full page game experience with morphed shell.
 * Lobby unmounts. Shell persists but collapses.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, Shield, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { getGame } from '@/data/games';
import { useState } from 'react';

export default function GamePage() {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const game = gameId ? getGame(gameId) : undefined;
    const [balance] = useState(1234.56);

    if (!game) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-[hsl(220,20%,3%)] flex flex-col">
            {/* Collapsed Shell Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5"
            >
                <div className="flex items-center justify-between px-4 md:px-6 py-3">
                    {/* Left: Back to Lobby */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs md:text-sm font-medium uppercase tracking-wider">Lobby</span>
                    </button>

                    {/* Center: Game Identity */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                            <div
                                className="h-5 w-5 rounded flex items-center justify-center"
                                style={{ background: game.hex }}
                            >
                                <game.icon className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-bold text-white hidden sm:block">{game.name}</span>
                        </div>

                        {/* Provably Fair */}
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
                            <Shield className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-xs font-bold text-green-500 uppercase tracking-wide">Fair</span>
                        </div>
                    </div>

                    {/* Right: Wallet & Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Balance */}
                        <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10">
                            <Wallet className="w-4 h-4 text-[hsl(42,90%,60%)]" />
                            <span className="text-xs md:text-sm font-bold text-white tabular-nums">
                                ${balance.toFixed(2)}
                            </span>
                        </div>

                        {/* Deposit - Red Pressure */}
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[hsl(0,85%,55%)] hover:bg-[hsl(0,85%,50%)] rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all transform hover:scale-105">
                            <TrendingUp className="w-4 h-4 text-white" />
                            <span className="text-sm font-bold text-white uppercase tracking-wide">Deposit</span>
                        </button>

                        {/* Chat Toggle */}
                        <button className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all">
                            <MessageSquare className="h-4 w-4 text-white/60" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Game Content - Maximum Real Estate */}
            <main className="flex-1 relative overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,5%)] to-[hsl(220,20%,3%)]" />
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />

                {/* Game Placeholder */}
                <div className="relative z-10 h-full flex items-center justify-center p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center max-w-2xl w-full"
                    >
                        <div
                            className="inline-flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-2xl mb-6 shadow-2xl"
                            style={{
                                background: `linear-gradient(135deg, ${game.hex} 0%, ${game.hex}dd 100%)`,
                                boxShadow: `0 0 60px ${game.hex}40`
                            }}
                        >
                            <game.icon className="h-12 w-12 md:h-16 md:w-16 text-white" />
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
                            {game.name}
                        </h1>

                        <p className="text-white/50 mb-8 text-base md:text-lg">{game.tagline}</p>

                        {/* Game Launch CTA */}
                        <button className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-bold uppercase tracking-wider transition-all transform hover:scale-105 shadow-xl">
                            Game Loading...
                        </button>

                        <p className="text-xs text-white/20 mt-8 uppercase tracking-widest">
                            Actual game integration pending
                        </p>
                    </motion.div>
                </div>
            </main>

            {/* Bottom Stats Bar */}
            <footer className="bg-black/40 backdrop-blur-xl border-t border-white/5 px-4 md:px-6 py-2">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-white/40 uppercase tracking-wide">Live</span>
                        </div>
                        <span className="text-white/20 hidden sm:inline">|</span>
                        <span className="text-white/40 hidden sm:inline">
                            RTP: <span className="text-white font-bold">98.5%</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-white/30">
                        <span>Session: 00:12:34</span>
                        <span>•</span>
                        <span>Bets: 47</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
