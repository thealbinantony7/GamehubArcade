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
                    ? 'bg-gradient-to-r from-[hsl(0,85%,20%)] via-[hsl(0,70%,25%)] to-[hsl(340,70%,20%)]'
                    : 'bg-gradient-to-r from-[hsl(260,80%,20%)] via-[hsl(300,60%,20%)] to-[hsl(340,70%,20%)]'
                }`} />

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Red urgency pulse overlay */}
            {isUrgent && (
                <div className="absolute inset-0 bg-[hsl(0,85%,50%)] opacity-0 animate-pulse-slow mix-blend-overlay" />
            )}

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-6 md:px-8 z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isUrgent
                            ? 'bg-[hsl(0,85%,55%)]/20 border border-[hsl(0,85%,55%)]/40 text-[hsl(0,85%,60%)] animate-pulse-slow'
                            : 'bg-white/10 border border-white/10 text-white'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-[hsl(0,85%,60%)] animate-pulse' : 'bg-green-500'}`} />
                        Live Event
                    </span>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                        <Clock className={`w-3 h-3 ${isUrgent ? 'text-[hsl(0,85%,60%)]' : 'text-white/60'}`} />
                        <span className={`text-xs font-mono font-bold tabular-nums ${isUrgent ? 'text-[hsl(0,85%,60%)]' : 'text-white'}`}>
                            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg mb-1">
                    $50,000 <span className="text-[hsl(42,90%,60%)]">Prize Pool</span>
                </h2>

                <p className="text-white/60 text-xs md:text-sm max-w-md mb-3">
                    Wager to climb the leaderboard. Top 50 paid daily.
                </p>

                {/* CTA with red pressure */}
                <button className={`group/cta w-fit flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all transform hover:scale-105 ${isUrgent
                        ? 'bg-[hsl(0,85%,55%)] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}>
                    <TrendingUp className="w-4 h-4" />
                    Join Race
                </button>
            </div>

            {/* Floating Elements */}
            <div className={`absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 animate-pulse-slow mix-blend-screen ${isUrgent ? 'bg-[hsl(0,85%,60%)]' : 'bg-[hsl(42,90%,60%)]'
                }`} />
            <div className="absolute left-16 top-0 w-64 h-64 bg-[hsl(300,60%,50%)] rounded-full blur-[80px] opacity-10 animate-pulse-slow" style={{ animationDelay: "1s" }} />
        </div>
    )
}
