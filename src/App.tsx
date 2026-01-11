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
import { useState, useEffect } from "react";

// Pages
import Home from "./pages/Home";
import Game from "./pages/Game";
import Auth from "./pages/Auth";
import ProfilePage from "./pages/ProfilePage";
import Leaderboard from "./pages/Leaderboard";
import Promotions from "./pages/Promotions";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
  // Entry inertia (Phase 10)
  const [isInert, setIsInert] = useState(true);

  useEffect(() => {
    // Disable betting for 1-2s on mount
    const delay = 1000 + Math.random() * 1000;
    const timer = setTimeout(() => setIsInert(false), delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div style={{ pointerEvents: isInert ? 'none' : 'auto' }}>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg"
              >
                Skip to content
              </a>
              <BrowserRouter>
                <Routes>
                  {/* Main Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/casino/:gameId" element={<Game />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/compliance" element={<Compliance />} />

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
            </div>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
