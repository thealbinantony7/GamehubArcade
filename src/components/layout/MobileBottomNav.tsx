/**
 * MOBILE BOTTOM NAV — Casino-Native Navigation
 * Fixed bottom bar for mobile. Replaces hamburger for core navigation.
 */

import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Trophy, MessageCircle, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
    const location = useLocation();

    const navItems = [
        { icon: Menu, label: 'Menu', path: '/menu' },
        { icon: Gamepad2, label: 'Casino', path: '/' },
        { icon: Home, label: 'PLAY', path: '/', highlight: true },
        { icon: Trophy, label: 'Sports', path: '/sports' },
        { icon: MessageCircle, label: 'Chat', path: '/chat' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[hsl(220,20%,8%)]/95 backdrop-blur-xl border-t border-white/5">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                                active ? "text-white" : "text-white/40",
                                item.highlight && "relative"
                            )}
                        >
                            {item.highlight ? (
                                <div className="absolute -top-6 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(0,85%,55%)] shadow-lg shadow-red-500/30">
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            ) : (
                                <>
                                    <Icon className={cn("h-5 w-5", active && "text-[hsl(0,85%,55%)]")} />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
