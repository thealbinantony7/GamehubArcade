import { Outlet } from 'react-router-dom';
import { CasinoProvider } from '@/contexts/CasinoContext';
import { RequireAuth } from '@/components/guards/AuthGuard';
import CasinoHeader from '@/components/casino/CasinoHeader';
import BettingDisabledBanner from '@/components/casino/BettingDisabledBanner';

/**
 * Layout wrapper for all /casino routes.
 * - Enforces authentication
 * - Provides CasinoContext (mode, balances, etc.)
 * - Renders casino-specific header with balance/mode selector
 * - Shows betting disabled banner when platform is paused
 */
export default function CasinoLayout() {
    return (
        <RequireAuth redirectTo="/auth?redirect=/casino">
            <CasinoProvider>
                <div className="min-h-screen bg-[#0a0a0a]">
                    <CasinoHeader />
                    <BettingDisabledBanner />
                    <main className="container mx-auto px-4 py-6">
                        <Outlet />
                    </main>
                </div>
            </CasinoProvider>
        </RequireAuth>
    );
}
