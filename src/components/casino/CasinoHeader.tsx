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
import { ChevronDown, Wallet, User, LogOut } from 'lucide-react';

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
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/casino" className="flex items-center gap-2">
                        <span className="text-2xl">🎰</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            GameHub Casino
                        </span>
                    </Link>

                    {/* Center Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/casino" className="text-sm text-white/70 hover:text-white transition-colors">
                            Games
                        </Link>
                        <Link to="/casino/history" className="text-sm text-white/70 hover:text-white transition-colors">
                            History
                        </Link>
                        <Link to="/casino/fairness" className="text-sm text-white/70 hover:text-white transition-colors">
                            Provably Fair
                        </Link>
                        <Link to="/arcade" className="text-sm text-white/70 hover:text-white transition-colors">
                            Arcade
                        </Link>
                    </nav>

                    {/* Right Side - Balance & User */}
                    <div className="flex items-center gap-3">
                        {/* Mode Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${mode === 'demo'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                            {mode === 'demo' ? '🎮 DEMO' : '💰 REAL'}
                        </div>

                        {/* Currency Selector with Balance */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="gap-2 bg-white/5 border-white/10 hover:bg-white/10"
                                    disabled={loading}
                                >
                                    <Wallet className="h-4 w-4" />
                                    <span className="font-mono">
                                        {loading ? '...' : balance.toFixed(currency === 'DEMO' ? 0 : 8)}
                                    </span>
                                    <span className="text-white/60">{currentCurrency.icon}</span>
                                    <ChevronDown className="h-4 w-4 text-white/40" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-white/10">
                                {CURRENCIES.map((curr) => (
                                    <DropdownMenuItem
                                        key={curr.value}
                                        onClick={() => setCurrency(curr.value)}
                                        className={`flex justify-between cursor-pointer ${currency === curr.value ? 'bg-white/10' : ''
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

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-white/10">
                                <DropdownMenuItem className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{profile?.username || user?.email}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="flex items-center gap-2 text-red-400"
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
