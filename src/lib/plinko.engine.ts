/**
 * PLINKO ENGINE — Provably Fair Deterministic Outcome
 * Phase 16: Canonical game engine
 * 
 * CRITICAL RULES:
 * - Outcome computed BEFORE animation
 * - No Math.random
 * - HMAC-SHA256 for RNG
 * - Full audit trail
 */

import CryptoJS from 'crypto-js';

// Canonical multiplier table (approved, static, auditable)
const MULTIPLIERS = [16, 9, 2, 1.4, 1.1, 1, 0.6, 0.4, 0.3, 0.4, 0.6, 1, 1.1, 1.4, 2, 9, 16];
const ROWS = 16;

export interface PlinkoOutcome {
    path: ('L' | 'R')[];
    bucketIndex: number;
    multiplier: number;
    payout: number;
    serverSeed: string;
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
    verificationHash: string;
}

/**
 * Generate server seed (in production, this would be server-side)
 */
export function generateServerSeed(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
}

/**
 * Hash server seed for commitment
 */
export function hashServerSeed(serverSeed: string): string {
    return CryptoJS.SHA256(serverSeed).toString();
}

/**
 * Generate deterministic RNG bytes from seeds
 */
function generateRNG(serverSeed: string, clientSeed: string, nonce: number): string {
    const message = `${clientSeed}:${nonce}`;
    return CryptoJS.HmacSHA256(message, serverSeed).toString();
}

/**
 * Convert hex hash to uniform float [0, 1)
 */
function hashToFloat(hash: string, offset: number): number {
    // Take 8 hex chars (32 bits) starting at offset
    const segment = hash.substring(offset * 8, (offset + 1) * 8);
    const value = parseInt(segment, 16);
    return value / 0x100000000; // Divide by 2^32
}

/**
 * Compute Plinko outcome deterministically
 */
export function computePlinkoOutcome(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    betAmount: number
): PlinkoOutcome {
    // Generate RNG hash
    const rngHash = generateRNG(serverSeed, clientSeed, nonce);

    // Derive path from hash
    const path: ('L' | 'R')[] = [];
    let position = 0; // Start at center (column 0)

    for (let row = 0; row < ROWS; row++) {
        // Get deterministic float for this row
        const randomValue = hashToFloat(rngHash, row % 8);

        // 50/50 decision: left or right
        const direction = randomValue < 0.5 ? 'L' : 'R';
        path.push(direction);

        // Update position
        if (direction === 'R') {
            position++;
        }
        // If 'L', position stays the same (relative to center)
    }

    // Final bucket index (0-16)
    const bucketIndex = position;

    // Get multiplier from canonical table
    const multiplier = MULTIPLIERS[bucketIndex];

    // Calculate payout
    const payout = betAmount * multiplier;

    // Generate verification hash
    const serverSeedHash = hashServerSeed(serverSeed);
    const verificationHash = CryptoJS.SHA256(
        `${serverSeedHash}:${clientSeed}:${nonce}:${bucketIndex}:${multiplier}`
    ).toString();

    return {
        path,
        bucketIndex,
        multiplier,
        payout,
        serverSeed,
        serverSeedHash,
        clientSeed,
        nonce,
        verificationHash,
    };
}

/**
 * Verify outcome independently (for audit)
 */
export function verifyPlinkoOutcome(outcome: PlinkoOutcome): boolean {
    // Recompute outcome with same seeds
    const recomputed = computePlinkoOutcome(
        outcome.serverSeed,
        outcome.clientSeed,
        outcome.nonce,
        0 // betAmount doesn't affect path
    );

    // Verify path matches
    if (recomputed.path.length !== outcome.path.length) return false;
    for (let i = 0; i < recomputed.path.length; i++) {
        if (recomputed.path[i] !== outcome.path[i]) return false;
    }

    // Verify bucket and multiplier
    return (
        recomputed.bucketIndex === outcome.bucketIndex &&
        recomputed.multiplier === outcome.multiplier
    );
}

/**
 * Get multiplier table (for display/audit)
 */
export function getMultiplierTable(): number[] {
    return [...MULTIPLIERS];
}

/**
 * Calculate theoretical RTP
 */
export function calculateRTP(): number {
    // Binomial distribution probabilities for 16 rows
    const probabilities = [
        0.0000153, 0.0002441, 0.0018311, 0.0085449, 0.0277710, 0.0666504,
        0.1221924, 0.1745605, 0.1963806, 0.1745605, 0.1221924, 0.0666504,
        0.0277710, 0.0085449, 0.0018311, 0.0002441, 0.0000153
    ];

    let rtp = 0;
    for (let i = 0; i < MULTIPLIERS.length; i++) {
        rtp += MULTIPLIERS[i] * probabilities[i];
    }

    return rtp;
}
