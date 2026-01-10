/**
 * PROMO BANNER — Live Event with Urgency
 * Time-based pressure mechanics
 */

import { useEffect, useState } from 'react';
import { Clock, TrendingUp } from 'lucide-react';

export default function PromoBanner() {
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 42, seconds: 15 });
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) seconds--;
                else if (minutes > 0) { minutes--; seconds = 59; }
                else if (hours > 0) { hours--; minutes = 59; seconds = 59; }

                // Urgency threshold: less than 1 hour
                setIsUrgent(hours === 0 && minutes < 60);

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[140px] md:h-[180px] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-white/10 transition-all">
            {/* Background with urgency state */}
            <div className={`absolute inset-0 transition-all duration-1000 ${isUrgent
                    ? 'bg-gradient-to-r from-brand-obsidian-base via-brand-obsidian-glass to-brand-obsidian-border'
                    : 'bg-gradient-to-r from-brand-obsidian-base via-brand-obsidian-glass to-brand-obsidian-border'
                }`} />

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Red urgency pulse overlay */}
            {isUrgent && (
                <div className="absolute inset-0 bg-brand-red-deep opacity-0 animate-pulse-slow mix-blend-overlay" />
            )}

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-6 md:px-8 z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isUrgent
                            ? 'bg-brand-red-base/20 border border-brand-red-base/40 text-brand-red-base animate-pulse-slow'
                            : 'bg-white/10 border border-white/10 text-white'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-brand-red-base animate-pulse' : 'bg-green-500'}`} />
                        Live Event
                    </span>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                        <Clock className={`w-3 h-3 ${isUrgent ? 'text-brand-red-base' : 'text-white/60'}`} />
                        <span className={`text-xs font-mono font-bold tabular-nums ${isUrgent ? 'text-brand-red-base' : 'text-white'}`}>
                            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg mb-1">
                    $50,000 <span className="text-brand-gold-accent">Prize Pool</span>
                </h2>

                <p className="text-white/60 text-xs md:text-sm max-w-md mb-3">
                    Wager to climb the leaderboard. Top 50 paid daily.
                </p>

                {/* CTA with red pressure */}
                <button className={`group/cta w-fit flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all transform hover:scale-105 active:scale-95 ${isUrgent
                        ? 'bg-brand-red-base text-white shadow-red-glow hover:bg-brand-red-deep'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}>
                    <TrendingUp className="w-4 h-4" />
                    Join Race
                </button>
            </div>

            {/* Floating Elements */}
            <div className={`absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 animate-pulse-slow mix-blend-screen ${isUrgent ? 'bg-brand-red-base' : 'bg-brand-gold-accent'
                }`} />
            <div className="absolute left-16 top-0 w-64 h-64 bg-brand-obsidian-border rounded-full blur-[80px] opacity-10 animate-pulse-slow" style={{ animationDelay: "1s" }} />
        </div>
    )
}
