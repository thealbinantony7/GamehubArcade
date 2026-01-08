/**
 * HEADER — Minimal
 * Left: Logo | Right: Sign In
 * No toggles. No toys.
 */

import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Diamond } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function Header() {
    const { user, profile, signOut } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="max-w-[1000px] mx-auto px-5 md:px-8">
                <div className="flex h-20 items-center justify-between">

                    {/* Logo — Sharp, flat, no glow */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(355,78%,46%)]">
                            <Diamond className="h-4 w-4 text-white" strokeWidth={2} />
                        </div>
                        <span className="text-base font-medium text-[hsl(0,0%,90%)] tracking-tight">
                            GameHub
                        </span>
                    </Link>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex h-10 items-center gap-2 px-4 rounded-lg bg-[hsl(220,16%,10%)] border border-[rgba(255,255,255,0.06)] hover:bg-[hsl(220,14%,13%)] transition-colors">
                                        <User className="h-4 w-4 text-[hsl(0,0%,60%)]" />
                                        <span className="text-sm text-[hsl(0,0%,80%)]">
                                            {profile?.username || 'Account'}
                                        </span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-44 bg-[hsl(220,16%,10%)] border-[rgba(255,255,255,0.08)] rounded-xl p-1"
                                >
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium text-[hsl(0,0%,90%)] truncate">
                                            {profile?.username || 'Player'}
                                        </p>
                                        <p className="text-xs text-[hsl(0,0%,50%)] truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
                                    <DropdownMenuItem
                                        onClick={() => signOut()}
                                        className="cursor-pointer rounded-lg py-2 text-[hsl(355,78%,55%)] focus:bg-[hsl(355,78%,46%,0.1)] focus:text-[hsl(355,78%,55%)]"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                to="/auth"
                                className="h-10 px-5 inline-flex items-center justify-center text-sm font-medium text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,90%)] transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
