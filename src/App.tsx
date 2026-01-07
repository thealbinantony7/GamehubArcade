import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Landing & Auth
import GameHub from "./pages/GameHub";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

// Casino routes (auth required)
import CasinoLayout from "./pages/casino/CasinoLayout";
import CasinoHome from "./pages/casino/CasinoHome";

// Arcade routes (no auth required)
import ArcadeLayout from "./pages/arcade/ArcadeLayout";
import ArcadeHome from "./pages/arcade/ArcadeHome";

// Legacy routes (redirect or keep for backwards compat)
import GamesLibrary from "./pages/GamesLibrary";
import PlayGame from "./pages/PlayGame";
import LeaderboardPage from "./pages/LeaderboardPage";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGames from "./pages/admin/AdminGames";
import AdminLeaderboards from "./pages/admin/AdminLeaderboards";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* ============================================
                  LANDING PAGE
                  ============================================ */}
              <Route path="/" element={<GameHub />} />

              {/* ============================================
                  AUTH
                  ============================================ */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* ============================================
                  CASINO ROUTES (Auth Required)
                  - Mode gate (demo/real)
                  - Wallet integration
                  - All bets via Edge Functions
                  ============================================ */}
              <Route path="/casino" element={<CasinoLayout />}>
                <Route index element={<CasinoHome />} />
                {/* Future: Individual game pages */}
                {/* <Route path="play/:gameId" element={<CasinoGame />} /> */}
                {/* <Route path="history" element={<BetHistory />} /> */}
                {/* <Route path="fairness" element={<ProvablyFair />} /> */}
              </Route>

              {/* ============================================
                  ARCADE ROUTES (No Auth Required)
                  - Free to play
                  - No wallet
                  - Client-side only
                  ============================================ */}
              <Route path="/arcade" element={<ArcadeLayout />}>
                <Route index element={<ArcadeHome />} />
                {/* Future: Individual arcade game pages */}
                {/* <Route path="play/:gameId" element={<ArcadeGame />} /> */}
                {/* <Route path="leaderboard" element={<ArcadeLeaderboard />} /> */}
              </Route>

              {/* ============================================
                  LEGACY ROUTES (Backward Compatibility)
                  Redirect to new structure or keep as-is
                  ============================================ */}
              <Route path="/games" element={<Navigate to="/arcade" replace />} />
              <Route path="/play/:gameId" element={<PlayGame />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />

              {/* ============================================
                  ADMIN ROUTES
                  ============================================ */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="games" element={<AdminGames />} />
                <Route path="leaderboards" element={<AdminLeaderboards />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* ============================================
                  404 CATCH-ALL
                  ============================================ */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
