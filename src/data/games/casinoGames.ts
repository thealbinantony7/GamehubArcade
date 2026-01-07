
import { lazy } from 'react';
import {
    Dices, TrendingUp, CircleDot, Bomb, Disc, Spade, Ticket
} from 'lucide-react';

// For Casino, components might be placeholders or real implementations.
// Assuming we don't have these components implemented yet, we should either:
// 1. Create a generic "CasinoGameWrapper" that handles the logic.
// 2. Or if they don't exist, we must handle that gracefully.
// BUT the instruction says "If not -> real 404".
// So I will registry them, but point to a placeholder or Lazy load if they existed.
// Since Phase 3 is "Game Logic", I will assume they are NOT ready but I must registry them so they appear in the UI.
// For now, I will create a "CasinoGamePlaceholder" or just map them.
// Wait, the prompt says "If not found -> real 404". So if I don't registry them, they 404.
// But they ARE visible in /casino.
// I will registry them.

// Placeholder for now as I haven't built CasinoGame components
const CasinoPlaceholder = lazy(() => import("@/pages/casino/CasinoGamePlaceholder"));

export interface CasinoGameDefinition {
    id: string;
    title: string;
    icon: any;
    color: string;
    description: string;
    component: React.LazyExoticComponent<any>;
    mode: 'casino';
}

export const CASINO_GAMES: CasinoGameDefinition[] = [
    { id: 'dice', title: 'Dice', icon: Dices, color: 'from-blue-500 to-indigo-600', description: 'Slider-based probability', component: CasinoPlaceholder, mode: 'casino' },
    { id: 'crash', title: 'Crash', icon: TrendingUp, color: 'from-red-500 to-pink-600', description: 'Multiplier timing', component: CasinoPlaceholder, mode: 'casino' },
    { id: 'plinko', title: 'Plinko', icon: CircleDot, color: 'from-green-400 to-emerald-600', description: 'Pegboard physics', component: CasinoPlaceholder, mode: 'casino' },
    { id: 'mines', title: 'Mines', icon: Bomb, color: 'from-orange-500 to-amber-600', description: 'Grid sweeping', component: CasinoPlaceholder, mode: 'casino' },
    { id: 'roulette', title: 'Roulette', icon: Disc, color: 'from-purple-500 to-violet-600', description: 'Wheel of fortune', component: CasinoPlaceholder, mode: 'casino' },
    { id: 'blackjack', title: 'Blackjack', icon: Spade, color: 'from-gray-800 to-black', description: 'Card strategy', component: CasinoPlaceholder, mode: 'casino' },
    { id: 'slots', title: 'Slots', icon: Ticket, color: 'from-yellow-400 to-orange-500', description: 'Spinning reels', component: CasinoPlaceholder, mode: 'casino' },
];

export const getCasinoGame = (id: string) => CASINO_GAMES.find(g => g.id === id);
