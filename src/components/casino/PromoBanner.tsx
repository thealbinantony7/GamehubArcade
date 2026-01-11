/**
 * PROMO BANNER — Static Event Display
 * Phase 13 INP Fix: Countdown removed. Static display only.
 */

import { Clock, TrendingUp } from 'lucide-react';

export default function PromoBanner() {
    // Static time display (no countdown, no setInterval)
    const staticTime = { hours: 23, minutes: 42, seconds: 15 };

    return (
        <div className="relative w-full h-[140px] md:h-[180px] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-white/10 transition-colors">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian-base via-brand-obsidian-glass to-brand-obsidian-border" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-6 md:px-8 z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 border border-white/10 text-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Live Event
                    </span>

                    {/* Static Countdown Timer */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                        <Clock className="w-3 h-3 text-white/60" />
                        <span className="text-xs font-mono font-bold tabular-nums text-white">
                            {String(staticTime.hours).padStart(2, '0')}:{String(staticTime.minutes).padStart(2, '0')}:{String(staticTime.seconds).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg mb-1">
                    $50,000 <span className="text-brand-gold-accent">Prize Pool</span>
                </h2>

                <p className="text-white/60 text-xs md:text-sm max-w-md mb-3">
                    Wager to climb the leaderboard. Top 50 paid daily.
                </p>

                {/* CTA */}
                <button className="group/cta w-fit flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors bg-white/10 text-white border border-white/20 hover:bg-white/20">
                    <TrendingUp className="w-4 h-4" />
                    Join Race
                </button>
            </div>

            {/* Floating Elements (CSS-only, no animate-pulse) */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 mix-blend-screen bg-brand-gold-accent" />
            <div className="absolute left-16 top-0 w-64 h-64 bg-brand-obsidian-border rounded-full blur-[80px] opacity-10" />
        </div>
    )
}
