import { Outlet } from 'react-router-dom';
import ArcadeHeader from '@/components/arcade/ArcadeHeader';

/**
 * Layout wrapper for all /arcade routes.
 * - NO authentication required
 * - NO wallet or balance
 * - Completely isolated from casino betting logic
 */
export default function ArcadeLayout() {
    return (
        <div className="min-h-screen bg-background">
            <ArcadeHeader />
            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}
