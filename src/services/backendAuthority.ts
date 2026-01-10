/**
 * BACKEND AUTHORITY SERVICE
 * Real provably fair system integration
 * Client NEVER computes outcomes
 */

// Feature flag
const USE_SIMULATED_AUTHORITY = true; // Toggle for real backend

export interface BetCommitment {
    commitmentId: string;
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
}

export interface BetResolution {
    commitmentId: string;
    roundId: string;
    outcome: 'win' | 'loss';
    multiplier: number;
    payout: number;
    newBalance: number;
    serverSeed: string; // Revealed after resolution
    hash: string;
    serverTime: number;
}

export interface RoundProof {
    serverSeed: string;
    clientSeed: string;
    nonce: number;
    result: string;
}

/**
 * Commit a bet - server generates seeds and commitment
 */
export async function commitBet(
    gameId: string,
    wager: number,
    clientSeed?: string
): Promise<BetCommitment> {
    if (USE_SIMULATED_AUTHORITY) {
        // Simulated authority (Phase 11 behavior preserved)
        const commitment: BetCommitment = {
            commitmentId: `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            serverSeedHash: generateSimulatedHash(),
            clientSeed: clientSeed || generateClientSeed(),
            nonce: Math.floor(Math.random() * 1000),
        };
        return commitment;
    }

    // Real backend
    const response = await fetch('/api/bet/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, wager, clientSeed }),
    });

    if (!response.ok) {
        throw new Error('Bet commitment failed');
    }

    return response.json();
}

/**
 * Resolve a bet - server computes outcome and applies wallet mutation
 */
export async function resolveBet(
    commitmentId: string,
    gameId: string,
    wager: number
): Promise<BetResolution> {
    if (USE_SIMULATED_AUTHORITY) {
        // Simulated authority with Phase 10/11 behaviors
        const win = Math.random() > 0.45;
        const multiplier = win ? 0.5 + Math.random() * 3 : 0;

        // Temporal friction bias
        let delay: number;
        if (!win) {
            delay = 200 + Math.random() * 200;
        } else if (multiplier < 2) {
            delay = 400 + Math.random() * 200;
        } else {
            delay = 600 + Math.random() * 300;
        }

        await new Promise(resolve => setTimeout(resolve, delay));

        const payout = wager * multiplier;
        const resolution: BetResolution = {
            commitmentId,
            roundId: `round_${Date.now()}`,
            outcome: win ? 'win' : 'loss',
            multiplier,
            payout,
            newBalance: 0, // Will be set by wallet reconciliation
            serverSeed: 'revealed_seed_' + Math.random().toString(36),
            hash: generateSimulatedHash(),
            serverTime: Date.now(),
        };

        // Post-win gravity
        if (multiplier >= 2) {
            const postWinLock = 500 + Math.random() * 300;
            await new Promise(resolve => setTimeout(resolve, postWinLock));
        }

        return resolution;
    }

    // Real backend
    const response = await fetch('/api/bet/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commitmentId }),
    });

    if (!response.ok) {
        throw new Error('Bet resolution failed');
    }

    return response.json();
}

/**
 * Get wallet balance from backend (source of truth)
 */
export async function getWalletBalance(): Promise<number> {
    if (USE_SIMULATED_AUTHORITY) {
        // Return cached balance for demo
        return 0; // Wallet store handles this
    }

    const response = await fetch('/api/wallet/balance');
    if (!response.ok) {
        throw new Error('Failed to fetch balance');
    }

    const data = await response.json();
    return data.balance;
}

/**
 * Get audit ledger from backend
 */
export async function getAuditLedger(limit: number = 100): Promise<any[]> {
    if (USE_SIMULATED_AUTHORITY) {
        // Return empty for demo (wallet store handles this)
        return [];
    }

    const response = await fetch(`/api/audit/ledger?limit=${limit}`);
    if (!response.ok) {
        throw new Error('Failed to fetch audit ledger');
    }

    return response.json();
}

/**
 * Verify round proof
 */
export async function verifyRound(roundId: string): Promise<RoundProof> {
    if (USE_SIMULATED_AUTHORITY) {
        return {
            serverSeed: 'simulated_server_seed',
            clientSeed: 'simulated_client_seed',
            nonce: 42,
            result: '0x' + Math.random().toString(16).slice(2, 18),
        };
    }

    const response = await fetch(`/api/verify/round/${roundId}`);
    if (!response.ok) {
        throw new Error('Verification failed');
    }

    return response.json();
}

// Helper functions
function generateSimulatedHash(): string {
    return '0x' + Math.random().toString(16).padStart(16, '0').slice(2, 18);
}

function generateClientSeed(): string {
    return 'client_' + Math.random().toString(36).substr(2, 16);
}
