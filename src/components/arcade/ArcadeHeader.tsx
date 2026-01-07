
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Gamepad2, User, Coins } from 'lucide-react';

export default function ArcadeHeader() {
    const { user, profile } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#050505]/50">
            <div className="container mx-auto px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo & Mode Switcher */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="group flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20 transition-all group-hover:bg-purple-500/20 group-hover:scale-105">
                                <Gamepad2 className="h-5 w-5 text-purple-400" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                                GameHub <span className="text-purple-400">Arcade</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-3 sm:gap-6">
                        <Link to="/casino">
                            <Button variant="ghost" className="h-10 rounded-full border border-white/5 bg-white/5 text-white/70 hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/20 gap-2 px-4 transition-all">
                                <Coins className="w-4 h-4" />
                                <span className="hidden sm:inline">Casino Mode</span>
                            </Button>
                        </Link>

                        {user ? (
                            <Link to="/profile">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:scale-105 transition-all">
                                    <User className="h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <Button variant="default" size="sm" className="h-10 px-6 rounded-full bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
