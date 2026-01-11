/**
 * PLINKO GAME — Canonical Casino Game
 * Phase 18: GameShell integration for premium feel
 */

import { useState, useEffect } from 'react';
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
import GameShell from '@/components/layout/GameShell';
import GameSidebar from '@/components/game/GameSidebar';

const ROWS = 16;
const MULTIPLIERS = getMultiplierTable();
const RTP = calculateRTP() * 100;
const HOUSE_EDGE = 100 - RTP;

export default function PlinkoGame() {
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

    useEffect(() => {
        const newServerSeed = generateServerSeed();
        setServerSeed(newServerSeed);
        setServerSeedHash(hashServerSeed(newServerSeed));
    }, []);

    const handleDrop = () => {
        if (isBettingBlocked || isPlaying || betAmount > balance) return;

        const betId = placeBet('Plinko', betAmount);
        if (!betId) return;

        const result = computePlinkoOutcome(serverSeed, clientSeed, nonce, betAmount);
        setOutcome(result);
        setIsPlaying(true);
        setShowResult(false);

        setTimeout(() => {
            setIsPlaying(false);
            setShowResult(true);
            resolveBet(betId, result.multiplier);
            setNonce(prev => prev + 1);

            const newServerSeed = generateServerSeed();
            setServerSeed(newServerSeed);
            setServerSeedHash(hashServerSeed(newServerSeed));
        }, 800);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isPlaying && !isBettingBlocked && betAmount <= balance) {
                e.preventDefault();
                handleDrop();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPlaying, isBettingBlocked, betAmount, balance, handleDrop]);

    return (
        <GameShell gameName="Plinko" rtp={RTP} houseEdge={HOUSE_EDGE}>
            <div className="flex gap-6 w-full max-w-[1600px]">
                {/* Game Stage (Center) */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Plinko Board */}
                    <div className="bg-[#1a1a1a] rounded-lg p-8 mb-6">
                        <div className="relative" style={{ height: '500px', width: '600px' }}>
                            {/* Pegs */}
                            {Array.from({ length: ROWS }).map((_, row) => (
                                <div key={row} className="flex justify-center gap-8 mb-4">
                                    {Array.from({ length: row + 2 }).map((_, col) => (
                                        <div
                                            key={col}
                                            className="w-2 h-2 bg-white/30 rounded-full"
                                        />
                                    ))}
                                </div>
                            ))}

                            {/* Ball */}
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
                        <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-4">
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

                {/* Sidebar */}
                <GameSidebar
                    betAmount={betAmount}
                    onBetAmountChange={setBetAmount}
                    onDrop={handleDrop}
                    isPlaying={isPlaying}
                    disabled={isBettingBlocked || betAmount > balance}
                    rtp={RTP}
                    rows={ROWS}
                    maxMultiplier={16}
                    serverSeedHash={serverSeedHash}
                    clientSeed={clientSeed}
                    onClientSeedChange={setClientSeed}
                    nonce={nonce}
                />
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
        </GameShell>
    );
}
