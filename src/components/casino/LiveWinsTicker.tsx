/**
 * LIVE WINS TICKER
 * Horizontal infinite scroll of winning bets
 * Creates FOMO and social proof
 */

import { GameDefinition } from "@/data/games";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Fake users for the feed
const USERS = ["Hidden", "Anon", "Player1", "Whale", "Sniper", "Lucky"];

interface WinEvent {
    id: number;
    user: string;
    game: string;
    amount: number;
    color: string;
}

export default function LiveWinsTicker() {
    const [wins, setWins] = useState<WinEvent[]>([
        { id: 1, user: "Anon", game: "Crash", amount: 120.50, color: "text-[hsl(0,85%,60%)]" },
        { id: 2, user: "Player8", game: "Plinko", amount: 15.00, color: "text-[hsl(200,70%,60%)]" },
        { id: 3, user: "Hidden", game: "Mines", amount: 450.00, color: "text-[hsl(30,80%,55%)]" },
        { id: 4, user: "Wolf", game: "Dice", amount: 90.25, color: "text-[hsl(280,70%,60%)]" },
        { id: 5, user: "Whale", game: "Crash", amount: 2500.00, color: "text-[hsl(0,85%,60%)]" },
    ]);

    // Simulate new wins coming in
    useEffect(() => {
        const interval = setInterval(() => {
            const newWin = {
                id: Date.now(),
                user: USERS[Math.floor(Math.random() * USERS.length)],
                game: ["Crash", "Dice", "Mines", "Plinko"][Math.floor(Math.random() * 4)],
                amount: Math.floor(Math.random() * 500) + 10,
                color: "text-[#00E701]" // Standard win green for uniformity in ticker
            };
            setWins(prev => [newWin, ...prev.slice(0, 8)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full overflow-hidden bg-[hsl(220,20%,7%)] border-b border-white/5 py-1">
            <div className="flex gap-4 animate-scroll whitespace-nowrap px-4">
                {/* Duplicate logic for infinite scroll would happen here, but CSS marquee is easier */}
                {/* For now, just a flex row that updates */}
                {[...wins, ...wins].map((win, i) => (
                    <div key={`${win.id}-${i}`} className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 text-xs">
                        <span className="text-white/40">{win.user}</span>
                        <span className="text-white/60">on {win.game}</span>
                        <span className={cn("font-bold", win.amount > 100 ? "text-[hsl(145,70%,45%)]" : "text-white")}>
                            ${win.amount.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
            {/* Note: In a real prod environment, use a marquee library. simplified here. */}
        </div>
    );
}
