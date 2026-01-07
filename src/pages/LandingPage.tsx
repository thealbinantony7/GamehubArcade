
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, Coins, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#080808] text-white overflow-hidden relative selection:bg-purple-500/30">
            {/* Background Ambient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[60vw] h-[40vh] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 tracking-wider uppercase backdrop-blur-md">
                            v1.0.0-casino-foundation
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                        GameHub
                    </h1>
                    <p className="text-xl text-white/50 max-w-lg mx-auto font-light leading-relaxed">
                        Two worlds. One platform. <br className="hidden md:block" />
                        <span className="text-white/80">Choose your destination.</span>
                    </p>
                </motion.div>

                {/* Mode Selector Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

                    {/* Arcade Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="group relative cursor-pointer"
                        onClick={() => navigate('/arcade')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative h-full p-8 md:p-12 rounded-3xl bg-[#121212]/80 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-purple-900/20 flex flex-col">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Gamepad2 className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Arcade</h2>
                            <p className="text-white/50 mb-8 flex-grow">
                                Pure entertainment. Classic games rewritten for modern web.
                                <br />
                                <span className="text-purple-400 font-medium mt-2 block">• Free Forever</span>
                                <span className="text-purple-400 font-medium block">• No Account Needed</span>
                            </p>
                            <div className="flex items-center text-white/80 font-medium group-hover:text-purple-400 transition-colors">
                                Enter Arcade <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Casino Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        className="group relative cursor-pointer"
                        onClick={() => navigate('/casino')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative h-full p-8 md:p-12 rounded-3xl bg-[#121212]/80 backdrop-blur-xl border border-white/10 hover:border-amber-500/50 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-amber-900/20 flex flex-col">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Coins className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Casino</h2>
                            <p className="text-white/50 mb-8 flex-grow">
                                High stakes. Provably fair. Real crypto.
                                <br />
                                <span className="text-amber-400 font-medium mt-2 block">• Demo & Real Modes</span>
                                <span className="text-amber-400 font-medium block">• Instant Withdrawals</span>
                            </p>
                            <div className="flex items-center text-white/80 font-medium group-hover:text-amber-400 transition-colors">
                                Enter Casino <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Footer Metadata */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 flex flex-col items-center gap-4 text-white/20 text-sm"
                >
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Secure</span>
                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Provably Fair</span>
                    </div>
                    <p>© 2026 GameHub. Educational Portfolio Project.</p>
                </motion.div>

            </div>
        </div>
    );
}
