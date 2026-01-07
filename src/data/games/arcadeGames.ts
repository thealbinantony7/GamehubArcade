
import { lazy } from 'react';
import {
    Grid3X3, Zap, Puzzle, Target, Bird, Gamepad2, Rocket, Brain, Hammer, LayoutGrid
} from "lucide-react";

// Lazy load components
const TicTacToe = lazy(() => import("@/components/TicTacToe"));
const UltimateTicTacToe = lazy(() => import("@/components/games/UltimateTicTacToe/UltimateTicTacToeGame").then(m => ({ default: m.UltimateTicTacToeGame })));
const Snake = lazy(() => import("@/components/games/Snake/SnakeGame").then(m => ({ default: m.SnakeGame })));
const Tetris = lazy(() => import("@/components/games/Tetris/TetrisGame").then(m => ({ default: m.TetrisGame })));
const Breakout = lazy(() => import("@/components/games/Breakout/BreakoutGame").then(m => ({ default: m.BreakoutGame })));
const FlappyBird = lazy(() => import("@/components/games/FlappyBird/FlappyBirdGame").then(m => ({ default: m.FlappyBirdGame })));
const Pong = lazy(() => import("@/components/games/Pong/PongGame").then(m => ({ default: m.PongGame })));
const SpaceInvaders = lazy(() => import("@/components/games/SpaceInvaders/SpaceInvadersGame").then(m => ({ default: m.SpaceInvadersGame })));
const SimonSays = lazy(() => import("@/components/games/SimonSays/SimonSaysGame").then(m => ({ default: m.SimonSaysGame })));
const WhackAMole = lazy(() => import("@/components/games/WhackAMole/WhackAMoleGame").then(m => ({ default: m.WhackAMoleGame })));

export interface GameDefinition {
    id: string;
    title: string;
    tagline: string;
    icon: any;
    color: string;
    hex: string;
    component: React.LazyExoticComponent<any>;
    mode: 'arcade';
}

export const ARCADE_GAMES: GameDefinition[] = [
    {
        id: "tictactoe",
        title: "Tic Tac Toe",
        tagline: "Strategic Mastery",
        icon: Grid3X3,
        color: "from-blue-500 to-cyan-400",
        hex: "#3b82f6",
        component: TicTacToe,
        mode: 'arcade'
    },
    {
        id: "ultimatetictactoe",
        title: "Ultimate TTT",
        tagline: "Recursive Tactics",
        icon: LayoutGrid,
        color: "from-violet-500 to-fuchsia-400",
        hex: "#8b5cf6",
        component: UltimateTicTacToe,
        mode: 'arcade'
    },
    {
        id: "snake",
        title: "Snake",
        tagline: "Neon Pursuit",
        icon: Zap,
        color: "from-green-500 to-emerald-400",
        hex: "#22c55e",
        component: Snake,
        mode: 'arcade'
    },
    {
        id: "tetris",
        title: "Tetris",
        tagline: "Perfect Order",
        icon: Puzzle,
        color: "from-purple-500 to-pink-400",
        hex: "#a855f7",
        component: Tetris,
        mode: 'arcade'
    },
    {
        id: "breakout",
        title: "Breakout",
        tagline: "Kinetic Destruction",
        icon: Target,
        color: "from-orange-500 to-red-400",
        hex: "#f97316",
        component: Breakout,
        mode: 'arcade'
    },
    {
        id: "flappybird",
        title: "Flappy Bird",
        tagline: "Infinite Precision",
        icon: Bird,
        color: "from-yellow-500 to-orange-400",
        hex: "#eab308",
        component: FlappyBird,
        mode: 'arcade'
    },
    {
        id: "pong",
        title: "Pong",
        tagline: "Vintage Velocity",
        icon: Gamepad2,
        color: "from-cyan-500 to-blue-400",
        hex: "#06b6d4",
        component: Pong,
        mode: 'arcade'
    },
    {
        id: "spaceinvaders",
        title: "Space Invaders",
        tagline: "Cosmic Defense",
        icon: Rocket,
        color: "from-indigo-500 to-purple-400",
        hex: "#6366f1",
        component: SpaceInvaders,
        mode: 'arcade'
    },
    {
        id: "simonsays",
        title: "Simon Says",
        tagline: "Melodic Memory",
        icon: Brain,
        color: "from-pink-500 to-rose-400",
        hex: "#ec4899",
        component: SimonSays,
        mode: 'arcade'
    },
    {
        id: "whackamole",
        title: "Whack-a-Mole",
        tagline: "Reflex Test",
        icon: Hammer,
        color: "from-amber-500 to-yellow-400",
        hex: "#f59e0b",
        component: WhackAMole,
        mode: 'arcade'
    },
];

export const getArcadeGame = (id: string) => ARCADE_GAMES.find(g => g.id === id);
