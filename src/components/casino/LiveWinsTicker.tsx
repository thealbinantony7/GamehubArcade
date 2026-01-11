/**
 * LIVE WINS TICKER
 * Horizontal infinite scroll of winning bets
 * Creates FOMO and social proof
 */

import { cn } from "@/lib/utils";
import { useEffect, useState, memo } from "react";

// Fake users for the feed
const USERS = ["Hidden", "Anon", "Player1", "Whale", "Sniper", "Lucky", "HighRoller", "VipUser"];
const GAMES = ["Crash", "Dice", "Mines", "Plinko", "Slots", "Roulette"];

interface WinEvent {
    id: number;
    user: string;
    game: string;
    amount: number;
    color: string;
}

export default function LiveWinsTicker() {
    // Fill initial state with enough items to span a wide screen
    const [wins, setWins] = useState<WinEvent[]>(() =>
        Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            user: USERS[Math.floor(Math.random() * USERS.length)],
            game: GAMES[Math.floor(Math.random() * GAMES.length)],
            amount: Math.floor(Math.random() * 500) + 10,
            color: "text-[hsl(145,70%,45%)]"
        }))
    );

    // Simulate new wins coming in (optional for marquee, but good for liveness)
    // For a pure CSS marquee, we often don't want to re-render the list constantly 
    // because it resets the CSS animation.
    // STRATEGY: For Phase 3, we keep the list static-ish or append carefully.
    // To keep it simple and smooth: Just a static loop of 20 items is enough 'ambient' motion.
    // If we want 'live' updates, we'd need a JS-driven ticker or a complex CSS swap.
    // Let's stick to the 'Ambient Motion' goal: A smooth, un-janking stream.

    return (
        <div
            className="w-full overflow-hidden bg-[hsl(220,20%,8%)] border-b border-white/5 py-1.5 relative z-10"
            aria-live="polite"
            aria-atomic="false"
            role="region"
            aria-label="Live wins ticker"
        >
            <span className="sr-only">Recent wins updating</span>
            {/* Gradient Masks for Fade In/Out */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[hsl(220,20%,8%)] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[hsl(220,20%,8%)] to-transparent z-20 pointer-events-none" />

            <div className="flex animate-ticker w-max hover:pause">
                {/* original list */}
                <div className="flex gap-4 px-2">
                    {wins.map((win, i) => (
                        <TickerItem key={`orig-${win.id}-${i}`} win={win} />
                    ))}
                </div>
                {/* duplicated list for seamless loop */}
                <div className="flex gap-4 px-2">
                    {wins.map((win, i) => (
                        <TickerItem key={`dupe-${win.id}-${i}`} win={win} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const TickerItem = memo(function TickerItem({ win }: { win: WinEvent }) {
    const multiplier = (win.amount / 100).toFixed(2); // Mock multiplier
    const profit = win.amount;

    return (
        <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 text-xs whitespace-nowrap hover:bg-white/10 transition-colors cursor-default">
            <span className="text-white/40 font-medium">{win.user}</span>
            <span className="text-white/60">•</span>
            <span className="text-white/60">{win.game}</span>
            <span className="text-white/60">•</span>
            <span className="text-white/80 font-mono tabular-nums">x{multiplier}</span>
            <span className="text-white/60">→</span>
            <span className="font-bold text-green-500 font-mono tabular-nums">
                +${profit.toFixed(2)}
            </span>
        </div>
    )
});
