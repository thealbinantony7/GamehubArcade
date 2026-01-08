/**
 * PROFILE PAGE — Simple Profile View
 * No sound, no deleted components.
 */

import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, User, LogOut, Trophy, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-[hsl(222,20%,4%)] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.04)_0%,transparent_60%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-[800px] mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">GameHub</span>
          </Link>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 pt-24 pb-16 px-5">
        <motion.div
          className="max-w-[400px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-4 ring-white/10">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              {profile?.username || 'Player'}
            </h1>
            <p className="text-white/40 text-sm">
              {user.email}
            </p>
          </div>

          {/* Stats */}
          {profile && (
            <div className="glass-strong rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-white/80">Stats</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{profile.wins}</div>
                  <div className="text-xs text-white/40">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{profile.losses}</div>
                  <div className="text-xs text-white/40">Losses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{profile.draws}</div>
                  <div className="text-xs text-white/40">Draws</div>
                </div>
              </div>
            </div>
          )}

          {/* Sign Out */}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </motion.div>
      </main>
    </div>
  );
}
