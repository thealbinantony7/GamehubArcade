/**
 * TOP BAR — Balance + CTAs
 * Search, Balance Pill, Deposit/Register, Sign In
 */

import { Link } from 'react-router-dom';
import { Search, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function HamburgerButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="group h-full w-16 flex items-center justify-center border-r border-white/5 hover:bg-white/5 transition-all duration-300"
            aria-label="Open menu"
        >
            <div className="flex flex-col gap-[6px] w-6">
                <span className="h-[2px] w-full bg-white/60 rounded-full transition-all duration-300 group-hover:bg-white group-hover:w-3/4" />
                <span className="h-[2px] w-full bg-white/60 rounded-full transition-all duration-300 group-hover:bg-white" />
                <span className="h-[2px] w-full bg-white/60 rounded-full transition-all duration-300 group-hover:bg-white group-hover:w-1/2 group-hover:ml-auto" />
            </div>
        </button>
    );
}

export default function TopBar({ onMenuClick, showMenuButton = true }: { onMenuClick?: () => void; showMenuButton?: boolean }) {
    const { user } = useAuth();
    const demoBalance = 1000.00; // Demo balance for non-logged users

    return (
        <div className="sticky top-0 z-40 bg-[hsl(220,20%,8%)]/80 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-[hsl(220,20%,8%)]/60 relative">

            {/* Absolute Hamburger Button - Flush Left */}
            {onMenuClick && showMenuButton && (
                <div className="absolute left-0 top-0 h-full z-50">
                    <HamburgerButton onClick={onMenuClick} />
                </div>
            )}

            <div className={cn(
                "flex items-center justify-between h-16 pr-4 md:pr-6 transition-all duration-300",
                onMenuClick && showMenuButton ? "pl-20" : "px-4 md:px-6"
            )}>

                {/* Mobile Menu + Search */}
                <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search games..."
                                className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Balance Pill */}
                    <div className="flex items-center gap-2 h-10 px-3 md:px-4 bg-white/5 border border-white/10 rounded-lg">
                        <Wallet className="h-4 w-4 text-[hsl(0,85%,55%)]" />
                        <span className="text-xs md:text-sm font-semibold text-white">
                            ${user ? '0.00' : demoBalance.toFixed(2)}
                        </span>
                    </div>

                    {!user ? (
                        <>
                            {/* Deposit / Register */}
                            <Link
                                to="/auth?mode=signup"
                                className="h-10 px-3 md:px-5 bg-[hsl(0,85%,55%)] hover:bg-[hsl(0,90%,60%)] text-white font-medium text-xs md:text-sm rounded-lg transition-colors inline-flex items-center justify-center"
                            >
                                Deposit
                            </Link>

                            {/* Sign In */}
                            <Link
                                to="/auth"
                                className="hidden sm:inline-flex h-10 px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-medium text-sm rounded-lg transition-colors items-center justify-center"
                            >
                                Sign In
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/profile"
                            className="h-10 px-3 md:px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-medium text-xs md:text-sm rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                            Account
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
