
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CasinoGamePlaceholder() {
    const { gameId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl max-w-md mx-6"
            >
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center animate-pulse">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2 capitalize">{gameId}</h1>
                <p className="text-white/50 mb-8">
                    This casino game is currently under development.
                    Return to the lobby to play other games.
                </p>
                <button
                    onClick={() => navigate('/casino')}
                    className="px-6 py-3 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors inline-flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Casino
                </button>
            </motion.div>
        </div>
    );
}
