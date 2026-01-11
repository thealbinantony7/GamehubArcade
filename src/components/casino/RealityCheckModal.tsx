/**
 * REALITY CHECK MODAL — Phase 15A Responsible Gambling
 * Non-blocking reminder shown every 30 minutes
 * Accessible, keyboard-navigable, respects prefers-reduced-motion
 */

import { useEffect, useRef } from 'react';
import { X, Clock } from 'lucide-react';
import { useWalletStore } from '@/store/wallet.store';

interface RealityCheckModalProps {
    isOpen: boolean;
    onContinue: () => void;
    onTakeBreak: () => void;
}

export default function RealityCheckModal({ isOpen, onContinue, onTakeBreak }: RealityCheckModalProps) {
    const sessionDuration = useWalletStore(state => state.getSessionDuration());
    const totalWagered = useWalletStore(state => state.getTotalWagered());
    const sessionPnL = useWalletStore(state => state.getSessionPnL());
    const continueButtonRef = useRef<HTMLButtonElement>(null);

    // Format session duration
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    // Focus trap
    useEffect(() => {
        if (isOpen && continueButtonRef.current) {
            continueButtonRef.current.focus();
        }
    }, [isOpen]);

    // Keyboard handling
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onContinue();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onContinue]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reality-check-title"
        >
            <div className="bg-brand-obsidian-glass border border-brand-obsidian-border rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-white/70" />
                        <h2 id="reality-check-title" className="text-lg font-bold text-white">
                            Session Reminder
                        </h2>
                    </div>
                    <button
                        onClick={onContinue}
                        aria-label="Close reminder"
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-6">
                    <p className="text-white/80">
                        You've been playing for <span className="font-bold text-white">{formatDuration(sessionDuration)}</span>.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Total Wagered:</span>
                            <span className="font-mono text-white">${totalWagered.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Session Result:</span>
                            <span className={`font-mono font-bold ${sessionPnL >= 0 ? 'text-green-500' : 'text-white'}`}>
                                {sessionPnL >= 0 ? '+' : ''}${sessionPnL.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-white/40">
                        This is a reminder to help you stay in control of your play time.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        ref={continueButtonRef}
                        onClick={onContinue}
                        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-sm font-bold text-white uppercase tracking-wider transition-colors"
                    >
                        Continue
                    </button>
                    <button
                        onClick={onTakeBreak}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-bold text-white uppercase tracking-wider transition-colors"
                    >
                        Take a Break
                    </button>
                </div>
            </div>
        </div>
    );
}
