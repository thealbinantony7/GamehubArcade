/**
 * HOME — Casino Lobby
 * Pure lobby experience with AppShell.
 * Games navigate to /casino/:gameId (separate page).
 */

import AppShell from '@/components/layout/AppShell';
import LobbyContent from '@/components/casino/LobbyContent';

export default function Home() {
    return (
        <AppShell>
            <LobbyContent />
        </AppShell>
    );
}
