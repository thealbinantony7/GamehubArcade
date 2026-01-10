/**
 * GLASS PANEL PRIMITIVE
 * Enforces PARADOX liquid glass formula
 */

import { cn } from '@/lib/utils';

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'heavy';
}

export default function GlassPanel({ children, className, variant = 'default' }: GlassPanelProps) {
    return (
        <div
            className={cn(
                "bg-brand-obsidian-glass/80 border border-white/5",
                variant === 'default' && "backdrop-blur-glass",
                variant === 'heavy' && "backdrop-blur-glass-heavy",
                className
            )}
        >
            {children}
        </div>
    );
}
