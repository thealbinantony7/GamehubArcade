
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// New Structure
import LandingPage from "./pages/LandingPage";

// Casino
import CasinoLayout from "./pages/casino/CasinoLayout";
import CasinoHome from "./pages/casino/CasinoHome";

// Arcade
import ArcadeLayout from "./pages/arcade/ArcadeLayout";
import ArcadeHome from "./pages/arcade/ArcadeHome";

// Legacy / Shared Play Component
import PlayGame from "./pages/PlayGame";

// Auth
import Auth from "./pages/Auth";
import ProfilePage from "./pages/ProfilePage";

import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
              {/* 1. Landing Page (Mode Selector) */}
              <Route path="/" element={<LandingPage />} />

              {/* 2. Auth */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* 3. Arcade Routes (Public) */}
              <Route path="/arcade" element={<ArcadeLayout />}>
                <Route index element={<ArcadeHome />} />
              </Route>

              {/* Game Player (Full Screen) */}
              <Route path="/arcade/play/:gameId" element={<PlayGame />} />

              {/* Alias for root /play to /arcade/play to support legacy links if any */}
              <Route path="/play/:gameId" element={<Navigate to="/arcade/play/:gameId" replace />} />

              {/* 4. Casino Routes (Protected) */}
              <Route path="/casino" element={<CasinoLayout />}>
                <Route index element={<CasinoHome />} />
                {/* Future: Real Casino Game Components would go here */}
                {/* <Route path="play/:gameId" element={<CasinoGame />} /> */}
              </Route>

              {/* 5. Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
