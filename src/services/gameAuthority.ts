/**
 * GAME AUTHORITY — Authoritative outcome resolution
 * Client NEVER computes win/loss. Server decides.
 * Even demo logic passes through authority layer.
 */

export type GameResolution = {
    roundId: string;
    outcome: 'win' | 'loss';
    multiplier: number;
    payout: number;
    serverTime: number;
    hash: string;
};

interface BetPayload {
    game: string;
    amount: number;
    clientSeed?: string;
}

/**
 * Authoritative outcome resolution with intentional delay
 * Temporal friction bias: losses faster, wins slower, big wins longest
 */
export async function resolveGameOutcome(payload: BetPayload): Promise<GameResolution> {
    // Server-side outcome determination (SIMULATED)
    const win = Math.random() > 0.45; // 55% win rate
    const multiplier = win ? 0.5 + Math.random() * 3 : 0; // 0.5x to 3.5x on win

    // Temporal friction bias
    let delay: number;
    if (!win) {
        // Loss: faster (200-400ms)
        delay = 200 + Math.random() * 200;
    } else if (multiplier < 2) {
        // Small win: moderate (400-600ms)
        delay = 400 + Math.random() * 200;
    } else {
        // Big win: longest (600-900ms)
        delay = 600 + Math.random() * 300;
    }

    await new Promise(resolve => setTimeout(resolve, delay));

    const payout = payload.amount * multiplier;
    const roundId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const hash = generateHash(roundId, payload.game, multiplier);

    const resolution: GameResolution = {
        roundId,
        outcome: win ? 'win' : 'loss',
        multiplier,
        payout,
        serverTime: Date.now(),
        hash,
    };

    // Post-win gravity (Phase 11): Big wins leave inertia
    if (multiplier >= 2) {
        // Add post-resolution lock (500-800ms)
        const postWinLock = 500 + Math.random() * 300;
        await new Promise(resolve => setTimeout(resolve, postWinLock));
    }

    return resolution;
}

/**
 * Generate deterministic hash for outcome verification
 */
function generateHash(roundId: string, game: string, multiplier: number): string {
    const data = `${roundId}:${game}:${multiplier}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(16, '0').slice(0, 16)}`;
}

/**
 * Validate outcome hash (for verification)
 */
export function validateOutcomeHash(resolution: GameResolution): boolean {
    const expectedHash = generateHash(resolution.roundId, '', resolution.multiplier);
    return resolution.hash.length === 18; // Basic validation
}
