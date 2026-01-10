/**
 * PROVABLY FAIR BADGE — Text-only trust indicator
 * No icons. No marketing.
 */

import { memo, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProvablyFairBadgeProps {
    onClick?: () => void;
    className?: string;
}

function ProvablyFairBadge({ onClick, className }: ProvablyFairBadgeProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                onClick={onClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={cn(
                    "px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-white/90 uppercase tracking-wider hover:bg-white/10 transition-colors",
                    className
                )}
            >
                FAIR • VERIFIED
            </button>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-brand-obsidian-glass backdrop-blur-glass border border-brand-obsidian-border rounded text-xs text-white/80 whitespace-nowrap z-50">
                    Each round is cryptographically verifiable.
                </div>
            )}
        </div>
    );
}

export default memo(ProvablyFairBadge);
