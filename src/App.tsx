/**
 * APP — Casino Router
 * 
 * Routes:
 * /              → Home (Lobby with AppShell)
 * /casino/:gameId → Game (Dedicated game page, lobby unmounts)
 * /auth          → Auth
 * /admin         → Admin
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import Game from "./pages/Game";
import Auth from "./pages/Auth";
import ProfilePage from "./pages/ProfilePage";
import Leaderboard from "./pages/Leaderboard";
import Promotions from "./pages/Promotions";
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
              {/* Main Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/casino/:gameId" element={<Game />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/promotions" element={<Promotions />} />

              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
              </Route>

              {/* Legacy route redirects */}
              <Route path="/play/:gameId" element={<Navigate to="/casino/:gameId" replace />} />
              <Route path="/arcade" element={<Navigate to="/" replace />} />
              <Route path="/arcade/*" element={<Navigate to="/" replace />} />

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
