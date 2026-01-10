/**
 * GAME PAGE — Dominant Game State
 * Full page game experience with morphed shell.
 * Lobby unmounts. Shell persists but collapses.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { getGame } from '@/data/games';
import { useState } from 'react';
import GameTrustHeader from '@/components/casino/GameTrustHeader';
import TrustStatusBar from '@/components/casino/TrustStatusBar';
import VerifyDrawer from '@/components/casino/VerifyDrawer';
import { useWalletStore } from '@/store/wallet.store';

const GameSkeleton = ({ color }: { color: string }) => (
    <div className="relative w-full max-w-4xl aspect-video bg-[hsl(220,20%,8%)] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />

        {/* Mock Interface */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
            {/* Top Bar Skeleton */}
            <div className="flex justify-between items-center opacity-30">
                <div className="h-4 w-32 bg-white/20 rounded-full" />
                <div className="flex gap-4">
                    <div className="h-4 w-12 bg-white/20 rounded-full" />
                    <div className="h-4 w-12 bg-white/20 rounded-full" />
                </div>
            </div>

            {/* Center Loader */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                <div
                    className="h-16 w-16 rounded-2xl animate-pulse shadow-[0_0_30px_currentColor]"
                    style={{ color, backgroundColor: color }}
                />
                <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/50 w-2/3 animate-[loading_1s_ease-in-out_infinite]" />
                </div>
            </div>

            {/* Bottom Bar Skeleton */}
            <div className="flex gap-4 opacity-30">
                <div className="h-10 w-full bg-white/10 rounded-xl" />
                <div className="h-10 w-24 bg-white/10 rounded-xl" />
            </div>
        </div>
    </div>
);

export default function GamePage() {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const game = gameId ? getGame(gameId) : undefined;
    const balance = useWalletStore(state => state.balance);
    const [isLoading, setIsLoading] = useState(true);
    const [verifyDrawerOpen, setVerifyDrawerOpen] = useState(false);

    if (!game) {
        navigate('/');
        return null;
    }

    const houseEdge = 100 - (game.rtp || 99);

    return (
        <div className="min-h-screen bg-[hsl(220,20%,3%)] flex flex-col font-sans pb-8 relative">
            {/* Collapsed Shell Header */}
            <header className="sticky top-0 z-50 bg-[#141b26]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 md:px-6 py-3">
                    {/* Left: Back to Lobby */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs md:text-sm font-medium uppercase tracking-wider">Lobby</span>
                    </button>

                    {/* Center: Game Trust Header (Replaces simple title) */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:block w-full max-w-2xl px-4">
                        <GameTrustHeader
                            gameName={game.name}
                            rtp={game.rtp || 99}
                            houseEdge={houseEdge}
                            onVerifyClick={() => setVerifyDrawerOpen(true)}
                        />
                    </div>
                    {/* Mobile fallback for title if needed, or rely on GameTrustHeader responsiveness */}
                    <div className="md:hidden flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{game.name}</span>
                    </div>

                    {/* Right: Wallet & Actions */}
                    <div className="flex items-center gap-3">
                        {/* Balance */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/5">
                            <span className="text-xs text-white/40 font-medium uppercase mr-1 hidden sm:inline">Balance</span>
                            <span className="text-sm font-bold text-white font-mono tabular-nums">
                                ${balance.toFixed(2)}
                            </span>
                        </div>

                        {/* Deposit */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-brand-red-base hover:bg-brand-red-deep rounded-lg shadow-red-glow hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all transform hover:scale-105 active:scale-95">
                            <TrendingUp className="w-4 h-4 text-white" />
                            <span className="text-sm font-bold text-white sm:inline hidden">Deposit</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Game Trust Header (Stacked) */}
                <div className="md:hidden border-t border-white/5">
                    <GameTrustHeader
                        gameName={game.name}
                        rtp={game.rtp || 99}
                        houseEdge={houseEdge}
                        onVerifyClick={() => setVerifyDrawerOpen(true)}
                    />
                </div>
            </header>

            {/* Game Content Area */}
            <main className="flex-1 relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
                {/* Background Ambience */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${game.hex}, transparent 70%)` }}
                />

                {/* Game / Skeleton */}
                <div className="relative z-10 w-full max-w-[1400px] flex justify-center">
                    {isLoading ? (
                        <GameSkeleton color={game.hex} />
                    ) : (
                        <div className="text-white">Game Loaded (Placeholder)</div>
                    )}
                </div>
            </main>

            {/* Footer Trust Bar - Persistent */}
            <TrustStatusBar onVerifyClick={() => setVerifyDrawerOpen(true)} />

            {/* Verify Drawer */}
            <VerifyDrawer isOpen={verifyDrawerOpen} onClose={() => setVerifyDrawerOpen(false)} />
        </div>
    );
}
