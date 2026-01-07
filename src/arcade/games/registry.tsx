
import {
    Grid3X3, Zap, Puzzle, Target, Bird, Gamepad2, Rocket, Brain, Hammer, LayoutGrid
} from "lucide-react";

// Game Components
import TicTacToe from "@/components/TicTacToe";
import { UltimateTicTacToeGame } from "@/components/games/UltimateTicTacToe/UltimateTicTacToeGame";
import { SnakeGame } from "@/components/games/Snake/SnakeGame";
import { TetrisGame } from "@/components/games/Tetris/TetrisGame";
import { BreakoutGame } from "@/components/games/Breakout/BreakoutGame";
import { FlappyBirdGame } from "@/components/games/FlappyBird/FlappyBirdGame";
import { PongGame } from "@/components/games/Pong/PongGame";
import { SpaceInvadersGame } from "@/components/games/SpaceInvaders/SpaceInvadersGame";
import { SimonSaysGame } from "@/components/games/SimonSays/SimonSaysGame";
import { WhackAMoleGame } from "@/components/games/WhackAMole/WhackAMoleGame";

export interface ArcadeGame {
    id: string;
    title: string;
    tagline: string;
    icon: any; // Lucide Icon
    color: string;
    hex: string;
    component: React.ComponentType;
}

export const ARCADE_GAMES: ArcadeGame[] = [
    {
        id: "tictactoe",
        title: "Tic Tac Toe",
        tagline: "Strategic Mastery",
        icon: Grid3X3,
        color: "from-blue-500 to-cyan-400",
        hex: "#3b82f6",
        component: TicTacToe
    },
    {
        id: "ultimatetictactoe",
        title: "Ultimate TTT",
        tagline: "Recursive Tactics",
        icon: LayoutGrid,
        color: "from-violet-500 to-fuchsia-400",
        hex: "#8b5cf6",
        component: UltimateTicTacToeGame
    },
    {
        id: "snake",
        title: "Snake",
        tagline: "Neon Pursuit",
        icon: Zap,
        color: "from-green-500 to-emerald-400",
        hex: "#22c55e",
        component: SnakeGame
    },
    {
        id: "tetris",
        title: "Tetris",
        tagline: "Perfect Order",
        icon: Puzzle,
        color: "from-purple-500 to-pink-400",
        hex: "#a855f7",
        component: TetrisGame
    },
    {
        id: "breakout",
        title: "Breakout",
        tagline: "Kinetic Destruction",
        icon: Target,
        color: "from-orange-500 to-red-400",
        hex: "#f97316",
        component: BreakoutGame
    },
    {
        id: "flappybird",
        title: "Flappy Bird",
        tagline: "Infinite Precision",
        icon: Bird,
        color: "from-yellow-500 to-orange-400",
        hex: "#eab308",
        component: FlappyBirdGame
    },
    {
        id: "pong",
        title: "Pong",
        tagline: "Vintage Velocity",
        icon: Gamepad2,
        color: "from-cyan-500 to-blue-400",
        hex: "#06b6d4",
        component: PongGame
    },
    {
        id: "spaceinvaders",
        title: "Space Invaders",
        tagline: "Cosmic Defense",
        icon: Rocket,
        color: "from-indigo-500 to-purple-400",
        hex: "#6366f1",
        component: SpaceInvadersGame
    },
    {
        id: "simonsays",
        title: "Simon Says",
        tagline: "Melodic Memory",
        icon: Brain,
        color: "from-pink-500 to-rose-400",
        hex: "#ec4899",
        component: SimonSaysGame
    },
    {
        id: "whackamole",
        title: "Whack-a-Mole",
        tagline: "Reflex Test",
        icon: Hammer,
        color: "from-amber-500 to-yellow-400",
        hex: "#f59e0b",
        component: WhackAMoleGame
    },
];

export const getArcadeGame = (id: string) => ARCADE_GAMES.find(g => g.id === id);
