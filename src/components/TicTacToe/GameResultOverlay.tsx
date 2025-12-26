import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, Home, Frown, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameResultOverlayProps {
    isVisible: boolean;
    result: 'win' | 'loss' | 'draw' | null;
    winnerName?: string;
    onPlayAgain: () => void;
    onMenu: () => void;
}

export const GameResultOverlay = ({ isVisible, result, winnerName, onPlayAgain, onMenu }: GameResultOverlayProps) => {
    if (!isVisible || !result) return null;

    const content = {
        win: {
            title: 'Victory!',
            message: 'You dominated the board!',
            icon: Trophy,
            color: 'text-yellow-400',
            gradient: 'from-yellow-500/20 to-orange-500/20',
            borderColor: 'border-yellow-500/50',
        },
        loss: {
            title: 'Defeat...',
            message: 'Better luck next time!',
            icon: Frown,
            color: 'text-red-400',
            gradient: 'from-red-500/20 to-rose-500/20',
            borderColor: 'border-red-500/50',
        },
        draw: {
            title: 'Draw!',
            message: 'A perfect balance of skill.',
            icon: Handshake,
            color: 'text-blue-400',
            gradient: 'from-blue-500/20 to-cyan-500/20',
            borderColor: 'border-blue-500/50',
        }
    };

    const { title, message, icon: Icon, color, gradient, borderColor } = content[result];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 50, opacity: 0 }}
                    className={`w-full max-w-sm rounded-[2rem] bg-card p-1 border-2 ${borderColor} shadow-2xl overflow-hidden`}
                >
                    <div className={`relative px-8 py-12 rounded-[1.8rem] bg-gradient-to-b ${gradient} flex flex-col items-center text-center space-y-6`}>

                        {/* Animated Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className={`p-4 rounded-full bg-background/50 backdrop-blur border border-white/10 ${color}`}
                        >
                            <Icon className="w-12 h-12" />
                        </motion.div>

                        <div className="space-y-2">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className={`text-4xl font-black tracking-tight ${color}`}
                            >
                                {title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-muted-foreground font-medium"
                            >
                                {message}
                            </motion.p>
                            {winnerName && result === 'win' && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-sm text-yellow-500/80 font-mono pt-2"
                                >
                                    Winner: {winnerName}
                                </motion.p>
                            )}
                        </div>

                        <div className="flex gap-3 w-full pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl h-12 gap-2 bg-background/50 hover:bg-background/80 border-0 ring-1 ring-white/10"
                                onClick={onMenu}
                            >
                                <Home className="w-4 h-4" />
                                Menu
                            </Button>
                            <Button
                                className={`flex-1 rounded-xl h-12 gap-2 text-white hover:opacity-90 bg-gradient-to-r ${result === 'loss' ? 'from-red-500 to-rose-600' : 'from-blue-600 to-cyan-500'}`}
                                onClick={onPlayAgain}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Play Again
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
