/**
 * APP SHELL — Persistent Casino Layout
 * Never unmounts. Contains all navigation + content areas.
 */

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import CollapsibleSidebar from './CollapsibleSidebar';
import MobileBottomNav from './MobileBottomNav';

interface AppShellProps {
    children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
    );

    // Auto-open sidebar on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && !sidebarOpen) {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);
    const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);

    // Check if we're in a game route
    const isGameRoute = location.pathname.startsWith('/casino/');

    return (
        <div className="flex min-h-screen bg-[hsl(220,24%,7%)] text-white font-sans antialiased overflow-hidden">
            {/* Left Sidebar - Desktop */}
            <CollapsibleSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Utility Bar */}
                <TopBar onMenuClick={handleSidebarOpen} showMenuButton={!sidebarOpen} />

                {/* Content (Lobby or Game) */}
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
            </div>

            {/* Right Sidebar Placeholder (Chat/Live Bets) - Future */}
            {/* <div className="hidden xl:block w-80 border-l border-white/5">
                <LiveFeed />
            </div> */}
        </div>
    );
}
