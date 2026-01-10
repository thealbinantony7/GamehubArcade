/**
 * CASINO GAME REGISTRY
 * 7 core games with casino-appropriate colors
 */

import { LucideIcon, Dices, TrendingUp, CircleDot, Bomb, Disc, Spade, Ticket } from "lucide-react";

export type GameCategory = "originals" | "table" | "slots";
export type GameStatus = "live" | "coming_soon";

export interface GameDefinition {
    id: string;
    name: string;
    tagline: string;
    category: GameCategory;
    icon: LucideIcon;
    hex: string;
    status: GameStatus;
    rtp: number;
}

export const GAMES: GameDefinition[] = [
    // Originals
    {
        id: "dice",
        name: "Dice",
        tagline: "Roll over/under",
        category: "originals",
        icon: Dices,
        hex: "hsl(280, 70%, 55%)",
        status: "coming_soon",
        rtp: 99.00
    },
    {
        id: "crash",
        name: "Crash",
        tagline: "Cash out before crash",
        category: "originals",
        icon: TrendingUp,
        hex: "hsl(0, 85%, 55%)",
        status: "coming_soon",
        rtp: 99.00
    },
    {
        id: "plinko",
        name: "Plinko",
        tagline: "Drop and win",
        category: "originals",
        icon: CircleDot,
        hex: "hsl(200, 70%, 50%)",
        status: "coming_soon",
        rtp: 99.00
    },
    {
        id: "mines",
        name: "Mines",
        tagline: "Avoid the bombs",
        category: "originals",
        icon: Bomb,
        hex: "hsl(30, 80%, 50%)",
        status: "coming_soon",
        rtp: 99.00
    },

    // Table
    {
        id: "roulette",
        name: "Roulette",
        tagline: "Spin to win",
        category: "table",
        icon: Disc,
        hex: "hsl(145, 70%, 45%)",
        status: "coming_soon",
        rtp: 97.30
    },
    {
        id: "blackjack",
        name: "Blackjack",
        tagline: "Beat the dealer",
        category: "table",
        icon: Spade,
        hex: "hsl(0, 0%, 20%)",
        status: "coming_soon",
        rtp: 99.50
    },
    {
        id: "slots",
        name: "Slots",
        tagline: "Spin the reels",
        category: "slots",
        icon: Ticket,
        hex: "hsl(50, 90%, 55%)",
        status: "coming_soon",
        rtp: 96.00
    },
];

// Helpers
export const getGame = (id: string): GameDefinition | undefined =>
    GAMES.find(g => g.id === id);

export const getGamesByCategory = (category: GameCategory): GameDefinition[] =>
    GAMES.filter(g => g.category === category);

export const getAllGames = (): GameDefinition[] => GAMES;
