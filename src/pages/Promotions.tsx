/**
 * PROMOTIONS — Placeholder
 */

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { Gift } from 'lucide-react';

export default function Promotions() {
    return (
        <div className="flex min-h-screen bg-[hsl(220,20%,8%)]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <TopBar />

                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Gift className="h-12 w-12 text-white/20 mx-auto mb-4" />
                        <h1 className="text-xl font-semibold text-white/80 mb-2">
                            Promotions
                        </h1>
                        <p className="text-sm text-white/40">
                            Coming soon
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
