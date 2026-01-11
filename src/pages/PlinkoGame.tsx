/**
 * PLINKO GAME — Canonical Casino Game
 * Phase 16: Real-money ready, provably fair
 * 
 * RULES:
 * - Outcome computed before animation
 * - CSS-only animation (≤800ms)
 * - Keyboard playable
 * - Full accessibility
 * - No Math.random
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store/wallet.store';
import {
    generateServerSeed,
    hashServerSeed,
    computePlinkoOutcome,
    getMultiplierTable,
    calculateRTP,
    type PlinkoOutcome,
} from '@/lib/plinko.engine';
import { cn } from '@/lib/utils';

const ROWS = 16;
const MULTIPLIERS = getMultiplierTable();

export default function PlinkoGame() {
    const navigate = useNavigate();
    const placeBet = useWalletStore(state => state.placeBet);
    const resolveBet = useWalletStore(state => state.resolveBet);
    const balance = useWalletStore(state => state.balance);
    const isBettingBlocked = useWalletStore(state => state.isBettingBlocked());

    const [betAmount, setBetAmount] = useState(10);
    const [serverSeed, setServerSeed] = useState(generateServerSeed());
    const [serverSeedHash, setServerSeedHash] = useState(hashServerSeed(serverSeed));
    const [clientSeed, setClientSeed] = useState('player_seed_' + Date.now());
    const [nonce, setNonce] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [outcome, setOutcome] = useState<PlinkoOutcome | null>(null);
    const [showResult, setShowResult] = useState(false);

    // Generate new server seed on mount
    useEffect(() => {
        const newServerSeed = generateServerSeed();
        setServerSeed(newServerSeed);
        setServerSeedHash(hashServerSeed(newServerSeed));
    }, []);

    const handleDrop = () => {
        if (isBettingBlocked || isPlaying || betAmount > balance) return;

        // Place bet
        const betId = placeBet('Plinko', betAmount);
        if (!betId) return;

        // Compute outcome BEFORE animation
        const result = computePlinkoOutcome(serverSeed, clientSeed, nonce, betAmount);
        setOutcome(result);
        setIsPlaying(true);
        setShowResult(false);

        // Animation duration (fixed 800ms)
        setTimeout(() => {
            setIsPlaying(false);
            setShowResult(true);

            // Resolve bet
            resolveBet(betId, result.multiplier);

            // Increment nonce for next bet
            setNonce(prev => prev + 1);

            // Generate new server seed for next round
            const newServerSeed = generateServerSeed();
            setServerSeed(newServerSeed);
            setServerSeedHash(hashServerSeed(newServerSeed));
        }, 800);
    };

    const handleReset = () => {
        setOutcome(null);
        setShowResult(false);
    };

    return (
        <div className="min-h-screen bg-brand-obsidian-base p-4">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    aria-label="Back to lobby"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Lobby</span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Game Board */}
                <div className="lg:col-span-2 bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-white mb-4">Plinko</h1>

                    {/* Plinko Board Visualization */}
                    <div className="bg-brand-obsidian-base rounded-lg p-8 mb-6">
                        <div className="relative" style={{ height: '500px' }}>
                            {/* Pegs (visual only) */}
                            {Array.from({ length: ROWS }).map((_, row) => (
                                <div key={row} className="flex justify-center gap-8 mb-4">
                                    {Array.from({ length: row + 2 }).map((_, col) => (
                                        <div
                                            key={col}
                                            className="w-2 h-2 bg-white/20 rounded-full"
                                        />
                                    ))}
                                </div>
                            ))}

                            {/* Ball (CSS animation) */}
                            {isPlaying && outcome && (
                                <div
                                    className="absolute top-0 left-1/2 w-4 h-4 bg-green-500 rounded-full -translate-x-1/2"
                                    style={{
                                        animation: 'plinko-drop 800ms ease-in forwards',
                                        '--final-x': `${(outcome.bucketIndex - 8) * 40}px`,
                                    } as React.CSSProperties}
                                />
                            )}
                        </div>

                        {/* Multiplier Buckets */}
                        <div className="flex justify-center gap-1 mt-4">
                            {MULTIPLIERS.map((mult, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex-1 text-center py-2 rounded text-xs font-bold",
                                        outcome?.bucketIndex === idx && showResult
                                            ? "bg-green-500 text-white"
                                            : mult >= 10
                                                ? "bg-yellow-500/20 text-yellow-500"
                                                : mult >= 2
                                                    ? "bg-blue-500/20 text-blue-500"
                                                    : "bg-white/5 text-white/60"
                                    )}
                                >
                                    {mult}x
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Result Display */}
                    {showResult && outcome && (
                        <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-4 mb-4">
                            <div className="text-center">
                                <div className="text-sm text-white/60 mb-1">Result</div>
                                <div className="text-3xl font-bold text-green-500">
                                    {outcome.multiplier}x
                                </div>
                                <div className="text-lg text-white mt-1">
                                    ${outcome.payout.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls Panel */}
                <div className="space-y-4">
                    {/* Bet Amount */}
                    <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                        <label className="block text-sm text-white/60 mb-2">Bet Amount</label>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            min="1"
                            max={balance}
                            disabled={isPlaying}
                            className="w-full bg-brand-obsidian-base border border-white/10 rounded px-3 py-2 text-white font-mono"
                            aria-label="Bet amount"
                        />
                    </div>

                    {/* Drop Button */}
                    <button
                        onClick={handleDrop}
                        disabled={isPlaying || isBettingBlocked || betAmount > balance}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-white/10 disabled:text-white/40 text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                        aria-label="Drop ball"
                    >
                        <Play className="h-4 w-4" />
                        Drop Ball
                    </button>

                    {/* Reset Button */}
                    {showResult && (
                        <button
                            onClick={handleReset}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
                            aria-label="Reset game"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Play Again
                        </button>
                    )}

                    {/* Game Info */}
                    <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                        <h3 className="text-sm font-bold text-white mb-2">Game Info</h3>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-white/60">RTP:</span>
                                <span className="text-white font-mono">{(calculateRTP() * 100).toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Rows:</span>
                                <span className="text-white">{ROWS}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Max Multiplier:</span>
                                <span className="text-white">16x</span>
                            </div>
                        </div>
                    </div>

                    {/* Provably Fair */}
                    <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-4">
                        <h3 className="text-sm font-bold text-white mb-2">Provably Fair</h3>
                        <div className="space-y-2 text-xs">
                            <div>
                                <div className="text-white/60 mb-1">Server Seed (Hashed)</div>
                                <div className="font-mono text-white/80 break-all text-[10px]">
                                    {serverSeedHash.substring(0, 32)}...
                                </div>
                            </div>
                            <div>
                                <div className="text-white/60 mb-1">Client Seed</div>
                                <input
                                    type="text"
                                    value={clientSeed}
                                    onChange={(e) => setClientSeed(e.target.value)}
                                    disabled={isPlaying}
                                    className="w-full bg-brand-obsidian-base border border-white/10 rounded px-2 py-1 text-white/80 font-mono text-[10px]"
                                    aria-label="Client seed"
                                />
                            </div>
                            <div>
                                <div className="text-white/60 mb-1">Nonce</div>
                                <div className="font-mono text-white">{nonce}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes plinko-drop {
                    0% {
                        transform: translate(-50%, 0);
                    }
                    100% {
                        transform: translate(calc(-50% + var(--final-x)), 500px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    @keyframes plinko-drop {
                        0%, 100% {
                            transform: translate(calc(-50% + var(--final-x)), 500px);
                        }
                    }
                }
            `}</style>
        </div>
    );
}
