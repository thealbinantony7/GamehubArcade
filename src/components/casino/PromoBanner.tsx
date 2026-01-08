/**
 * PROMO BANNER
 * High-energy banner for campaigns
 */

export default function PromoBanner() {
    return (
        <div className="relative w-full h-[120px] md:h-[160px] rounded-2xl overflow-hidden mb-8 group cursor-pointer">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(260,80%,20%)] via-[hsl(300,60%,20%)] to-[hsl(340,70%,20%)]" />

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-8 z-10">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white mb-2 w-fit border border-white/10 uppercase tracking-widest">
                    Weekly Race
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">
                    $50,000 <span className="text-[hsl(42,90%,60%)]">Prize Pool</span>
                </h2>
                <p className="text-white/60 text-sm mt-1 max-w-md">
                    Wager to climb the leaderboard. Top 50 paid daily.
                </p>
            </div>

            {/* Floating Elements (Decorative) */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-[hsl(42,90%,60%)] rounded-full blur-[60px] opacity-20 animate-pulse" />
        </div>
    )
}
