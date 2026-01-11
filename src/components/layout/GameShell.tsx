/**
 * GAME SHELL — Dedicated Game Experience Layer
 * Phase 18: Stake/Rainbet-level feel
 * 
 * RULES:
 * - No animations
 * - No new intervals
 * - Static layout only
 * - Focus on game, not lobby
 */

import { ReactNode } from 'react';
import GameHeader from '../game/GameHeader';

interface GameShellProps {
    children: ReactNode;
    gameName: string;
    rtp: number;
    houseEdge: number;
}

export default function GameShell({ children, gameName, rtp, houseEdge }: GameShellProps) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
            {/* Game Header */}
            <GameHeader
                gameName={gameName}
                rtp={rtp}
                houseEdge={houseEdge}
            />

            {/* Game Stage (Center Gravity) */}
            <main className="flex-1 flex items-center justify-center p-4">
                {children}
            </main>
        </div>
    );
}
