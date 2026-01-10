/**
 * RECENT BETS — Live-looking table
 * Makes site feel active with entry flashes
 */

import { Dices, TrendingUp, CircleDot, Bomb, Gamepad2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GAMES = [
    { name: 'Crash', icon: TrendingUp },
    { name: 'Dice', icon: Dices },
    { name: 'Mines', icon: Bomb },
    { name: 'Plinko', icon: CircleDot },
    { name: 'Slots', icon: Gamepad2 }
];

interface Bet {
    id: number;
    game: string;
    icon: any;
    bet: number;
    multiplier: number;
    payout: number;
    win: boolean;
}

export default function RecentBets() {
    const [bets, setBets] = useState<Bet[]>([]);

    // Simulate websocket feed
    useEffect(() => {
        // Initial populate
        const initialBets = Array.from({ length: 8 }).map((_, i) => generateBet(i));
        setBets(initialBets);

        const interval = setInterval(() => {
            const newBet = generateBet(Date.now());
            setBets(prev => [newBet, ...prev.slice(0, 9)]);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[hsl(220,18%,11%)] w-full text-left border-collapse">
            {/* Header */}
            <div className="grid grid-cols-4 px-6 py-3 border-b border-white/5 bg-black/20 text-xs font-bold text-white/40 uppercase tracking-wider">
                <div>Game</div>
                <div>Bet</div>
                <div>Mult</div>
                <div className="text-right">Payout</div>
            </div>

            {/* Rows */}
            <div className="relative">
                <AnimatePresence initial={false} mode="popLayout">
                    {bets.map((bet) => (
                        <motion.div
                            key={bet.id}
                            initial={{ opacity: 0, y: -20, backgroundColor: "rgba(34, 197, 94, 0.15)" }}
                            animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-4 px-6 py-3 border-b border-white/5 text-sm items-center hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-md bg-white/5 text-white/60">
                                    <bet.icon className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-white/90 hidden md:block">{bet.game}</span>
                            </div>

                            <div className="text-white/80 font-mono tabular-nums">
                                ${bet.bet.toFixed(2)}
                            </div>

                            <div className={bet.win ? "text-[hsl(145,70%,45%)] font-bold" : "text-white/30"}>
                                {bet.multiplier.toFixed(2)}x
                            </div>

                            <div className={`text-right font-bold font-mono tabular-nums ${bet.win ? "text-[hsl(145,70%,45%)]" : "text-white/30"}`}>
                                {bet.payout > 0 ? `+$${bet.payout.toFixed(2)}` : '0.00'}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function generateBet(id: number): Bet {
    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    const betAmount = Math.floor(Math.random() * 200) + 10;
    const isWin = Math.random() > 0.6;
    const mult = isWin ? (Math.random() * 5 + 1) : 0;

    return {
        id,
        game: game.name,
        icon: game.icon,
        bet: betAmount,
        multiplier: mult,
        win: isWin,
        payout: betAmount * mult
    };
}
