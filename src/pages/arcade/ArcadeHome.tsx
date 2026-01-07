
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    Grid3X3, Zap, Puzzle, Target, Bird, Gamepad2, Rocket, Brain, Hammer, LayoutGrid, Play, ArrowRight, Star, Sparkles
} from "lucide-react";
import { MouseEvent } from "react";

// --- Data ---
const ARCADE_GAMES = [
    { id: "tictactoe", title: "Tic Tac Toe", tagline: "Strategic Mastery", icon: Grid3X3, color: "from-blue-500 to-cyan-400", hex: "#3b82f6" },
    { id: "ultimatetictactoe", title: "Ultimate TTT", tagline: "Recursive Tactics", icon: LayoutGrid, color: "from-violet-500 to-fuchsia-400", hex: "#8b5cf6" },
    { id: "snake", title: "Snake", tagline: "Neon Pursuit", icon: Zap, color: "from-green-500 to-emerald-400", hex: "#22c55e" },
    { id: "tetris", title: "Tetris", tagline: "Perfect Order", icon: Puzzle, color: "from-purple-500 to-pink-400", hex: "#a855f7" },
    { id: "breakout", title: "Breakout", tagline: "Kinetic Destruction", icon: Target, color: "from-orange-500 to-red-400", hex: "#f97316" },
    { id: "flappybird", title: "Flappy Bird", tagline: "Infinite Precision", icon: Bird, color: "from-yellow-500 to-orange-400", hex: "#eab308" },
    { id: "pong", title: "Pong", tagline: "Vintage Velocity", icon: Gamepad2, color: "from-cyan-500 to-blue-400", hex: "#06b6d4" },
    { id: "spaceinvaders", title: "Space Invaders", tagline: "Cosmic Defense", icon: Rocket, color: "from-indigo-500 to-purple-400", hex: "#6366f1" },
    { id: "simonsays", title: "Simon Says", tagline: "Melodic Memory", icon: Brain, color: "from-pink-500 to-rose-400", hex: "#ec4899" },
    { id: "whackamole", title: "Whack-a-Mole", tagline: "Reflex Test", icon: Hammer, color: "from-amber-500 to-yellow-400", hex: "#f59e0b" },
];

// --- Components ---

function LiquidCard({ game, index }: { game: typeof ARCADE_GAMES[0], index: number }) {
    const navigate = useNavigate();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
            className="group relative h-[280px] w-full cursor-pointer rounded-[32px]"
            onMouseMove={onMouseMove}
            onClick={() => navigate(`/play/${game.id}`)}
        >
            {/* Hover Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
                }}
            />

            {/* Card Content Container */}
            <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-[#0f0f0f]/60 backdrop-blur-md border border-white/5 transition-all duration-300 group-hover:border-white/10 group-hover:shadow-2xl group-hover:shadow-purple-500/10">

                {/* Inner Gradient Blob */}
                <div
                    className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-[80px] transition-all duration-500 group-hover:opacity-40"
                    style={{ background: game.hex }}
                />

                {/* Card Body */}
                <div className="relative flex h-full flex-col p-8">
                    {/* Icon Header */}
                    <div className="mb-auto flex items-start justify-between">
                        <div className="flex items-center justify-center rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 group-hover:ring-white/20">
                            <game.icon className="h-8 w-8 text-white" />
                        </div>
                        {index < 3 && (
                            <div className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 ring-1 ring-amber-500/20">
                                Popular
                            </div>
                        )}
                    </div>

                    {/* Titles */}
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-purple-100">
                            {game.title}
                        </h3>
                        <p className="text-sm font-medium text-white/40 group-hover:text-white/60">
                            {game.tagline}
                        </p>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/30 transition-colors group-hover:text-white/50">
                            <Star className="h-3 w-3" />
                            <span>Ranked</span>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg shadow-white/20 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 translate-x-4 scale-75 group-hover:scale-100">
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- Main Page ---

export default function ArcadeHome() {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-purple-500/30 overflow-hidden relative">

            {/* Ambient Background Lights */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/10 blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">

                {/* Cinematic Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-24 text-center"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-md"
                    >
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <span className="text-xs font-medium uppercase tracking-widest text-white/70">
                            The Arcade Collection
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                        ARCADE
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">.</span>
                    </h1>
                    <p className="mt-6 text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
                        Timeless classics reimagined with premium physics and fluid motion.
                        <span className="block mt-2 text-white/60">No account required. Pure skill.</span>
                    </p>
                </motion.div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {ARCADE_GAMES.map((game, index) => (
                        <LiquidCard key={game.id} game={game} index={index} />
                    ))}
                </div>

                {/* Premium CTA Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 relative overflow-hidden rounded-[40px] border border-white/5 bg-[#0f0f0f] p-12 text-center"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
                    <div className="relative z-10 max-w-lg mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Ready to raise the stakes?
                        </h2>
                        <p className="text-white/40">
                            Enter the Casino to play with real cryptocurrency and provably fair odds.
                            Experience the thrill of high-stakes gaming.
                        </p>
                        <Link to="/casino">
                            <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-105">
                                <span className="relative z-10 flex items-center gap-2">
                                    Enter Casino <ArrowRight className="h-4 w-4" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-400 opacity-0 transition-opacity group-hover:opacity-100" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
