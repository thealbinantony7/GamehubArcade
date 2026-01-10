/**
 * APP SHELL — Persistent Casino Layout
 * Never unmounts. Contains all navigation + content areas.
 */

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import CollapsibleSidebar from './CollapsibleSidebar';
import MobileBottomNav from './MobileBottomNav';
import TrustStatusBar from '../casino/TrustStatusBar';
import VerifyDrawer from '../casino/VerifyDrawer';

interface AppShellProps {
    children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile only state
    const [verifyDrawerOpen, setVerifyDrawerOpen] = useState(false);

    const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);
    const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);
    const handleVerifyOpen = useCallback(() => setVerifyDrawerOpen(true), []);
    const handleVerifyClose = useCallback(() => setVerifyDrawerOpen(false), []);

    // Check if we're in a game route for potential specific styling (optional)
    const isGameRoute = location.pathname.startsWith('/casino/');

    return (
        <div className="flex min-h-screen bg-[hsl(220,24%,7%)] text-white font-sans antialiased">
            {/* Sidebar: Fixed width on Desktop, Collapsible on Mobile */}
            <CollapsibleSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative transition-all duration-300">
                {/* Top Utility Bar */}
                <TopBar onMenuClick={handleSidebarOpen} showMenuButton={true} />

                {/* Content Scroller */}
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {/* 
                        LAYOUT CONSTRAINT:
                        - Max width 1600px
                        - Left aligned (mr-auto, ml-0/4/6)
                        - No centering (mx-auto removed)
                    */}
                    <div className="w-full max-w-[1600px] mr-auto pl-0 md:pl-6 pr-4 md:pr-6 pb-24 md:pb-12">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />

                {/* Trust Status Bar */}
                <TrustStatusBar onVerifyClick={handleVerifyOpen} />
            </div>

            {/* Verify Drawer */}
            <VerifyDrawer isOpen={verifyDrawerOpen} onClose={handleVerifyClose} />
        </div>
    );
}
