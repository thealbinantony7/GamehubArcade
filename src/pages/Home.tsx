/**
 * HOME — Casino Lobby with Theater Mode
 * Uses AppShell architecture. Games open as overlays.
 */

import { useLocation } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import LobbyContent from '@/components/casino/LobbyContent';
import GameTheater from '@/components/layout/GameTheater';

export default function Home() {
    const location = useLocation();
    const isGameRoute = location.pathname.startsWith('/casino/');

    return (
        <AppShell>
            <LobbyContent />
            {isGameRoute && <GameTheater />}
        </AppShell>
    );
}
