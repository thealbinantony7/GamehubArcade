/**
 * GAME HEADER — Minimal, Game-Only Chrome
 * Phase 18: Stake-style header
 */

import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/store/wallet.store';

interface GameHeaderProps {
    gameName: string;
    rtp: number;
    houseEdge: number;
}

export default function GameHeader({ gameName, rtp, houseEdge }: GameHeaderProps) {
    const navigate = useNavigate();
    const balance = useWalletStore(state => state.balance);

    return (
        <header className="bg-[#0f0f0f] border-b border-white/5 px-6 py-3">
            <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                {/* Left: Back */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                    aria-label="Back to lobby"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Lobby</span>
                </button>

                {/* Center: Game Info */}
                <div className="flex items-center gap-6">
                    <h1 className="text-lg font-bold text-white">{gameName}</h1>

                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs">
                        <Shield className="h-3 w-3 text-green-500" />
                        <span className="text-green-500 font-bold">FAIR</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60">VERIFIED</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-white/40">
                        <span>RTP: <span className="text-white/80 font-mono">{rtp.toFixed(2)}%</span></span>
                        <span>•</span>
                        <span>House Edge: <span className="text-white/80 font-mono">{houseEdge.toFixed(2)}%</span></span>
                    </div>
                </div>

                {/* Right: Balance */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-xs text-white/40">Balance (Demo)</div>
                        <div className="text-sm font-bold text-white font-mono">${balance.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
