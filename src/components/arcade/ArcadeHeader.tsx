
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Gamepad2, User, Coins } from 'lucide-react';

export default function ArcadeHeader() {
    const { user, profile } = useAuth();

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo & Mode Switcher */}
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Gamepad2 className="h-6 w-6 text-purple-500" />
                            <span className="text-lg font-bold text-white hidden sm:block">
                                GameHub <span className="text-purple-500">Arcade</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2 sm:gap-4">
                        <Link to="/casino">
                            <Button variant="ghost" className="text-white/60 hover:text-amber-400 hover:bg-amber-500/10 gap-2">
                                <Coins className="w-4 h-4" />
                                <span className="hidden sm:inline">Casino Mode</span>
                            </Button>
                        </Link>

                        {user ? (
                            <Link to="/profile">
                                <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-white">
                                    <User className="h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
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
