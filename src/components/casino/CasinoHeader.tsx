
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCasino } from '@/contexts/CasinoContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Wallet, User, LogOut, Gamepad2 } from 'lucide-react';

const CURRENCIES = [
    { value: 'DEMO', label: 'Demo', icon: '🎮' },
    { value: 'BTC', label: 'Bitcoin', icon: '₿' },
    { value: 'ETH', label: 'Ethereum', icon: 'Ξ' },
    { value: 'USDT', label: 'Tether', icon: '₮' },
    { value: 'SOL', label: 'Solana', icon: '◎' },
] as const;

export default function CasinoHeader() {
    const { user, profile, signOut } = useAuth();
    const { mode, currency, setCurrency, getBalance, loading } = useCasino();

    const currentCurrency = CURRENCIES.find(c => c.value === currency) || CURRENCIES[0];
    const balance = getBalance(currency);

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between gap-2">

                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-2xl">🎰</span>
                        <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent hidden sm:block">
                            Casino
                        </span>
                    </Link>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">

                        {/* Switch to Arcade (Mobile: Icon only, Desktop: Text) */}
                        <Link to="/arcade" className="hidden xs:block">
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-purple-400 hover:bg-purple-500/10 gap-2 px-2 sm:px-4">
                                <Gamepad2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Arcade Mode</span>
                            </Button>
                        </Link>

                        {/* Mode Badge (Desktop Only) */}
                        <div className={`hidden md:block px-3 py-1 rounded-full text-xs font-semibold ${mode === 'demo'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                            {mode === 'demo' ? 'DEMO' : 'REAL'}
                        </div>

                        {/* Wallet / Currency Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 px-2 sm:px-4 min-w-[100px] justify-between"
                                    disabled={loading}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Wallet className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                        <span className="font-mono text-xs sm:text-sm truncate">
                                            {loading ? '...' : balance.toFixed(currency === 'DEMO' ? 0 : 4)}
                                        </span>
                                    </div>
                                    <span className="text-white/60 text-xs sm:text-sm ml-1 flex-shrink-0">{currentCurrency.icon}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] border-white/10">
                                {CURRENCIES.map((curr) => (
                                    <DropdownMenuItem
                                        key={curr.value}
                                        onClick={() => setCurrency(curr.value)}
                                        className={`flex justify-between cursor-pointer py-3 ${currency === curr.value ? 'bg-white/10' : ''
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{curr.icon}</span>
                                            <span>{curr.label}</span>
                                        </span>
                                        <span className="font-mono text-white/60">
                                            {getBalance(curr.value).toFixed(curr.value === 'DEMO' ? 0 : 4)}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* User Profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
                                    <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-white/10">
                                <div className="px-2 py-1.5 text-xs text-white/40 font-mono border-b border-white/5 mb-1">
                                    {profile?.username || user?.email}
                                </div>
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" /> Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="flex items-center gap-2 text-red-400 cursor-pointer focus:text-red-400 focus:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
