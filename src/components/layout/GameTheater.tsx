/**
 * GAME THEATER — Dominant Game Shell
 * Game visually outweighs lobby. Wallet/balance always visible.
 * Peripheral dimming creates focus lock without full navigation.
 */

import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Wallet, TrendingUp, Shield } from 'lucide-react';
import { getGame } from '@/data/games';

export default function GameTheater() {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const game = gameId ? getGame(gameId) : undefined;
    const containerRef = useRef<HTMLDivElement>(null);
    const [balance] = useState(1234.56); // Mock balance

    const handleClose = () => {
        navigate('/');
    };

    // Scroll Lock & Focus Trap
    useEffect(() => {
        document.body.classList.add('theater-open');

        if (containerRef.current) {
            containerRef.current.focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.classList.remove('theater-open');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (!game) {
        return null;
    }

    return (
        <AnimatePresence>
            {/* Peripheral Dimming - Heavy vignette effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[var(--z-theater)]"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 100%)',
                    backdropFilter: 'blur(8px)'
                }}
                onClick={handleClose}
            />

            {/* Persistent Wallet Overlay - Always Visible */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
                className="fixed top-4 right-4 z-[calc(var(--z-theater)+10)] flex items-center gap-3"
            >
                {/* Balance Display */}
                <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10">
                    <Wallet className="w-4 h-4 text-[hsl(42,90%,60%)]" />
                    <span className="text-sm font-bold text-white tabular-nums">
                        ${balance.toFixed(2)}
                    </span>
                </div>

                {/* Deposit CTA - Red Pressure */}
                <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(0,85%,55%)] hover:bg-[hsl(0,85%,50%)] rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all transform hover:scale-105">
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white uppercase tracking-wide">Deposit</span>
                </button>
            </motion.div>

            {/* Game Container - Visual Dominance */}
            <motion.div
                ref={containerRef}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-0 md:inset-6 lg:inset-12 z-[calc(var(--z-theater)+5)] flex flex-col focus:outline-none"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                {/* Minimal Header - Subtle presence */}
                <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-black/40 backdrop-blur-xl border-b border-white/5">
                    <button
                        onClick={handleClose}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-medium uppercase tracking-wider">Lobby</span>
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Game Identity */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                            <div
                                className="h-5 w-5 rounded flex items-center justify-center"
                                style={{ background: game.hex }}
                            >
                                <game.icon className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-bold text-white">{game.name}</span>
                        </div>

                        {/* Provably Fair Indicator */}
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
                            <Shield className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-xs font-bold text-green-500 uppercase tracking-wide">Fair</span>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Game Content - Maximum Real Estate */}
                <div className="flex-1 bg-gradient-to-b from-[hsl(220,20%,5%)] to-[hsl(220,20%,3%)] relative overflow-hidden">
                    {/* Ambient Background Pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />

                    {/* Game Placeholder - Will be replaced with actual game */}
                    <div className="relative z-10 h-full flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center max-w-md"
                        >
                            <div
                                className="inline-flex h-24 w-24 items-center justify-center rounded-2xl mb-6 shadow-2xl"
                                style={{
                                    background: `linear-gradient(135deg, ${game.hex} 0%, ${game.hex}dd 100%)`,
                                    boxShadow: `0 0 60px ${game.hex}40`
                                }}
                            >
                                <game.icon className="h-12 w-12 text-white" />
                            </div>

                            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
                                {game.name}
                            </h1>

                            <p className="text-white/50 mb-6 text-lg">{game.tagline}</p>

                            {/* Game Launch CTA */}
                            <button className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-bold uppercase tracking-wider transition-all transform hover:scale-105 shadow-xl">
                                Game Loading...
                            </button>

                            <p className="text-xs text-white/20 mt-6 uppercase tracking-widest">
                                Actual game integration pending
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Risk Bar - Always Visible */}
                <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-black/60 backdrop-blur-xl border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-white/40 uppercase tracking-wide">Live</span>
                        </div>
                        <span className="text-white/20">|</span>
                        <span className="text-white/40">RTP: <span className="text-white font-bold">98.5%</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-xs text-white/30">
                        <span>Session: 00:12:34</span>
                        <span>•</span>
                        <span>Bets: 47</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
