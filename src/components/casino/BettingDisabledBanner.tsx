import { useCasino } from '@/contexts/CasinoContext';
import { AlertTriangle } from 'lucide-react';

/**
 * Banner shown when betting is disabled (emergency stop active).
 * Listens to CasinoContext for realtime updates.
 */
export default function BettingDisabledBanner() {
    const { bettingEnabled } = useCasino();

    if (bettingEnabled) return null;

    return (
        <div className="bg-red-500/10 border-b border-red-500/30">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-center gap-2 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">
                        Betting is temporarily disabled. Please try again later.
                    </span>
                </div>
            </div>
        </div>
    );
}
