
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
    Grid3X3, Zap, Puzzle, Target, Bird, Gamepad2, Rocket, Brain, Hammer, LayoutGrid, Play, ArrowRight
} from "lucide-react";

const ARCADE_GAMES = [
    { id: "tictactoe", title: "Tic Tac Toe", tagline: "Classic strategy. Redefined.", icon: Grid3X3, color: "from-blue-500 to-cyan-400" },
    { id: "ultimatetictactoe", title: "Ultimate TTT", tagline: "Strategy within strategy.", icon: LayoutGrid, color: "from-violet-500 to-fuchsia-400" },
    { id: "snake", title: "Snake", tagline: "Neon glow. Endless chase.", icon: Zap, color: "from-green-500 to-emerald-400" },
    { id: "tetris", title: "Tetris", tagline: "Glass blocks. Perfect fit.", icon: Puzzle, color: "from-purple-500 to-pink-400" },
    { id: "breakout", title: "Breakout", tagline: "Physics destruction.", icon: Target, color: "from-orange-500 to-red-400" },
    { id: "flappybird", title: "Flappy Bird", tagline: "One tap challenge.", icon: Bird, color: "from-yellow-500 to-orange-400" },
    { id: "pong", title: "Pong", tagline: "Retro glory.", icon: Gamepad2, color: "from-cyan-500 to-blue-400" },
    { id: "spaceinvaders", title: "Space Invaders", tagline: "Defend. Destroy.", icon: Rocket, color: "from-indigo-500 to-purple-400" },
    { id: "simonsays", title: "Simon Says", tagline: "Memory mastery.", icon: Brain, color: "from-pink-500 to-rose-400" },
    { id: "whackamole", title: "Whack-a-Mole", tagline: "Quick reflexes.", icon: Hammer, color: "from-amber-500 to-yellow-400" },
];

export default function ArcadeHome() {
    const navigate = useNavigate();

    return (
        <div className="space-y-12 pb-20">
            {/* Hero */}
            <div className="text-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6 border border-purple-500/20"
                >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Free to Play Forever</span>
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Arcade Collection
                </h1>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    No wallet. No risk. Just pure gaming nostalgia rewritten for the modern web.
                </p>
            </div>

            {/* Game Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ARCADE_GAMES.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate(`/play/${game.id}`)}
                            className="group relative cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-6 shadow-lg`}>
                                    <game.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                                <p className="text-sm text-white/50 mb-6 line-clamp-2">{game.tagline}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-mono text-white/30 uppercase tracking-wider">High Score: --</span>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white text-white group-hover:text-black transition-colors">
                                        <Play className="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-2xl mx-auto px-6 text-center pt-12">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121212] to-black border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Feeling Lucky?</h3>
                    <p className="text-white/50 mb-6">Switch to Casino Mode to play with real crypto rewards.</p>
                    <Link to="/casino" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
                        Enter Casino <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
