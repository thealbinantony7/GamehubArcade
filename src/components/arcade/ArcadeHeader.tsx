import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Gamepad2, User } from 'lucide-react';

/**
 * Header for arcade section.
 * - No wallet or balance
 * - Optional login (not required to play)
 * - Link to casino
 */
export default function ArcadeHeader() {
    const { user, profile } = useAuth();

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/arcade" className="flex items-center gap-2">
                        <Gamepad2 className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">
                            GameHub Arcade
                        </span>
                    </Link>

                    {/* Center Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/arcade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            All Games
                        </Link>
                        <Link to="/arcade/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Leaderboard
                        </Link>
                        <Link to="/casino" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            🎰 Casino
                        </Link>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link to="/profile">
                                <Button variant="ghost" className="gap-2">
                                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="h-3 w-3" />
                                    </div>
                                    <span>{profile?.username || 'Profile'}</span>
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <Button variant="outline">Sign In</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
