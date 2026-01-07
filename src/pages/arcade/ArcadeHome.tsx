
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Play, ArrowRight, Star } from "lucide-react";
import { MouseEvent } from "react";
import { ARCADE_GAMES, GameDefinition } from "@/data/games/arcadeGames";

function LiquidCard({ game, index }: { game: GameDefinition, index: number }) {
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
            className="group relative h-[320px] w-full cursor-pointer rounded-[24px]"
            onMouseMove={onMouseMove}
            onClick={() => navigate(`/arcade/play/${game.id}`)}
        >
            {/* Hover Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
                }}
            />

            {/* Card Content Container */}
            <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-[#0A0A0A] border border-white/5 transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-900/20">

                {/* Inner Gradient Blob */}
                <div
                    className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-[0.03] blur-[80px] transition-all duration-500 group-hover:opacity-[0.15]"
                    style={{ background: game.hex }}
                />

                {/* Card Body */}
                <div className="relative flex h-full flex-col p-6">
                    {/* Icon Header */}
                    <div className="mb-auto flex items-start justify-between">
                        <div className="flex items-center justify-center rounded-xl bg-white/5 p-3.5 ring-1 ring-white/5 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10 group-hover:ring-white/10">
                            <game.icon className="h-7 w-7 text-white/90" />
                        </div>
                        {index < 3 && (
                            <div className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400 ring-1 ring-purple-500/20">
                                Hot
                            </div>
                        )}
                    </div>

                    {/* Titles */}
                    <div className="space-y-1.5 mb-8">
                        <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-purple-100">
                            {game.title}
                        </h3>
                        <p className="text-sm font-medium text-white/40 group-hover:text-white/60">
                            {game.tagline}
                        </p>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/20 transition-colors group-hover:text-purple-400/80">
                            <Star className="h-3 w-3" />
                            <span>Play Free</span>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black opacity-60 shadow-lg shadow-white/5 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:scale-110">
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ArcadeHome() {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-purple-500/30 overflow-hidden relative">

            {/* Ambient Background Lights - Adjusted for subtle luxury */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/[0.08] blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/[0.06] blur-[150px]" />
            </div>

            <div className="relative z-10 container max-w-[1400px] mx-auto px-4 md:px-8 py-24">

                {/* Cinematic Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-20 text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-md"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                            Premium Arcade
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                        ARCADE
                        <span className="text-purple-500">.</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-white/40 max-w-xl mx-auto font-light leading-relaxed">
                        Curated collection of high-fidelity browser games.
                        <br className="hidden md:block" />
                        <span className="text-white/70">No downloads. No account. Free forever.</span>
                    </p>
                </motion.div>

                {/* Responsive Grid - Fixed Gaps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {ARCADE_GAMES.map((game, index) => (
                        <LiquidCard key={game.id} game={game} index={index} />
                    ))}
                </div>

                {/* Premium CTA Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 relative overflow-hidden rounded-[32px] border border-white/5 bg-[#080808] p-10 md:p-16 text-center"
                >
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="relative z-10 max-w-lg mx-auto space-y-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Feeling Competitive?
                        </h2>
                        <p className="text-white/40 leading-relaxed">
                            Switch to Casino Mode to play with real stakes, live leaderboards, and provably fair outcomes.
                        </p>
                        <Link to="/casino">
                            <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-neutral-200 hover:scale-105">
                                Enter Casino <ArrowRight className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
