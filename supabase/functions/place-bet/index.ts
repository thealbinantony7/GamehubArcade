import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createHmac } from "node:crypto";

// =============================================================================
// TYPES & SCHEMAS
// =============================================================================

const SUPPORTED_GAMES = ["dice", "crash", "plinko", "mines", "roulette", "blackjack", "slots"] as const;
const SUPPORTED_CURRENCIES = ["BTC", "ETH", "USDT", "SOL", "DEMO"] as const;

// Game-specific data schemas
const DiceGameDataSchema = z.object({
    target: z.number().min(1).max(99),
    condition: z.enum(["over", "under"]),
});

const PlinkoGameDataSchema = z.object({
    risk: z.enum(["low", "medium", "high"]),
    rows: z.number().min(8).max(16),
});

const MinesGameDataSchema = z.object({
    minesCount: z.number().min(1).max(24),
    selections: z.array(z.number().min(0).max(24)).optional(),
});

const RouletteGameDataSchema = z.object({
    bets: z.array(z.object({
        type: z.enum(["straight", "red", "black", "odd", "even", "high", "low"]),
        value: z.union([z.number(), z.string()]).optional(),
        amount: z.number().positive(),
    })),
});

const CrashGameDataSchema = z.object({
    autoCashout: z.number().min(1.01).optional(),
});

const BlackjackGameDataSchema = z.object({
    action: z.enum(["deal", "hit", "stand", "double", "split"]).optional(),
});

const SlotsGameDataSchema = z.object({
    lines: z.number().min(1).max(20).optional(),
});

// Main request schema
const PlaceBetRequestSchema = z.object({
    gameId: z.enum(SUPPORTED_GAMES),
    currency: z.enum(SUPPORTED_CURRENCIES),
    amount: z.number().positive(),
    isDemo: z.boolean(),
    clientSeed: z.string().optional(),
    gameData: z.record(z.unknown()).optional(),
});

type PlaceBetRequest = z.infer<typeof PlaceBetRequestSchema>;

// =============================================================================
// PROVABLY FAIR RNG
// =============================================================================

function generateGameHash(serverSeed: string, clientSeed: string, nonce: number): string {
    const message = `${clientSeed}:${nonce}`;
    const hmac = createHmac("sha256", serverSeed);
    hmac.update(message);
    return hmac.digest("hex");
}

function hashToFloat(hash: string): number {
    // Use first 8 chars (32 bits) for float conversion
    const int = parseInt(hash.substring(0, 8), 16);
    return int / 0xffffffff;
}

function hashToInt(hash: string, max: number): number {
    return Math.floor(hashToFloat(hash) * max);
}

// =============================================================================
// GAME RESULT CALCULATORS
// =============================================================================

interface GameResult {
    outcome: "win" | "loss";
    multiplier: number;
    payout: number;
    profit: number;
    gameResult: Record<string, unknown>;
}

function calculateDiceResult(
    hash: string,
    amount: number,
    gameData: z.infer<typeof DiceGameDataSchema>,
    houseEdge: number
): GameResult {
    const roll = hashToFloat(hash) * 100;
    const { target, condition } = gameData;

    let win = false;
    let winChance: number;

    if (condition === "over") {
        win = roll > target;
        winChance = 100 - target;
    } else {
        win = roll < target;
        winChance = target;
    }

    // Multiplier = (100 - house_edge%) / win_chance%
    const multiplier = win ? ((100 * (1 - houseEdge)) / winChance) : 0;
    const payout = win ? amount * multiplier : 0;
    const profit = payout - amount;

    return {
        outcome: win ? "win" : "loss",
        multiplier: parseFloat(multiplier.toFixed(4)),
        payout: parseFloat(payout.toFixed(8)),
        profit: parseFloat(profit.toFixed(8)),
        gameResult: {
            roll: parseFloat(roll.toFixed(2)),
            target,
            condition,
        },
    };
}

function calculatePlinkoResult(
    hash: string,
    amount: number,
    gameData: z.infer<typeof PlinkoGameDataSchema>,
    houseEdge: number
): GameResult {
    const { risk, rows } = gameData;

    // Plinko multipliers based on risk and position
    const multiplierTables: Record<string, number[]> = {
        low: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
        medium: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
        high: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
    };

    const table = multiplierTables[risk] || multiplierTables.medium;

    // Simulate ball path using hash bits
    let position = rows / 2;
    const path: number[] = [];

    for (let i = 0; i < rows; i++) {
        const bit = parseInt(hash.charAt(i % hash.length), 16) & 1;
        position += bit === 0 ? -0.5 : 0.5;
        path.push(bit);
    }

    const bucketIndex = Math.min(Math.max(Math.floor(position), 0), table.length - 1);
    const baseMultiplier = table[bucketIndex];
    const multiplier = baseMultiplier * (1 - houseEdge);

    const payout = amount * multiplier;
    const profit = payout - amount;

    return {
        outcome: profit > 0 ? "win" : "loss",
        multiplier: parseFloat(multiplier.toFixed(4)),
        payout: parseFloat(payout.toFixed(8)),
        profit: parseFloat(profit.toFixed(8)),
        gameResult: {
            path,
            bucket: bucketIndex,
            risk,
            rows,
        },
    };
}

function calculateMinesResult(
    hash: string,
    amount: number,
    gameData: z.infer<typeof MinesGameDataSchema>,
    houseEdge: number
): GameResult {
    const { minesCount, selections = [] } = gameData;
    const totalTiles = 25;
    const safeTiles = totalTiles - minesCount;

    // Generate mine positions from hash
    const minePositions: number[] = [];
    let hashOffset = 0;

    while (minePositions.length < minesCount) {
        const pos = hashToInt(hash.substring(hashOffset, hashOffset + 8), totalTiles);
        if (!minePositions.includes(pos)) {
            minePositions.push(pos);
        }
        hashOffset += 2;
    }

    // Check if any selection hit a mine
    const hitMine = selections.some(s => minePositions.includes(s));

    if (hitMine || selections.length === 0) {
        return {
            outcome: "loss",
            multiplier: 0,
            payout: 0,
            profit: -amount,
            gameResult: {
                minePositions,
                hitMine: true,
                revealed: selections,
            },
        };
    }

    // Calculate multiplier based on tiles revealed
    // Each reveal multiplies: (remaining tiles) / (remaining safe tiles)
    let multiplier = 1;
    for (let i = 0; i < selections.length; i++) {
        const remainingTotal = totalTiles - i;
        const remainingSafe = safeTiles - i;
        multiplier *= remainingTotal / remainingSafe;
    }
    multiplier *= (1 - houseEdge);

    const payout = amount * multiplier;
    const profit = payout - amount;

    return {
        outcome: "win",
        multiplier: parseFloat(multiplier.toFixed(4)),
        payout: parseFloat(payout.toFixed(8)),
        profit: parseFloat(profit.toFixed(8)),
        gameResult: {
            minePositions,
            hitMine: false,
            revealed: selections,
            safeCount: selections.length,
        },
    };
}

function calculateRouletteResult(
    hash: string,
    amount: number,
    gameData: z.infer<typeof RouletteGameDataSchema>,
    _houseEdge: number
): GameResult {
    const spin = hashToInt(hash, 37); // 0-36
    const { bets } = gameData;

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const isRed = redNumbers.includes(spin);
    const isBlack = spin > 0 && !isRed;
    const isOdd = spin > 0 && spin % 2 === 1;
    const isEven = spin > 0 && spin % 2 === 0;
    const isHigh = spin >= 19 && spin <= 36;
    const isLow = spin >= 1 && spin <= 18;

    let totalPayout = 0;
    const betResults: { type: string; win: boolean; payout: number }[] = [];

    for (const bet of bets) {
        let win = false;
        let multiplier = 0;

        switch (bet.type) {
            case "straight":
                win = spin === Number(bet.value);
                multiplier = 36;
                break;
            case "red":
                win = isRed;
                multiplier = 2;
                break;
            case "black":
                win = isBlack;
                multiplier = 2;
                break;
            case "odd":
                win = isOdd;
                multiplier = 2;
                break;
            case "even":
                win = isEven;
                multiplier = 2;
                break;
            case "high":
                win = isHigh;
                multiplier = 2;
                break;
            case "low":
                win = isLow;
                multiplier = 2;
                break;
        }

        const payout = win ? bet.amount * multiplier : 0;
        totalPayout += payout;
        betResults.push({ type: bet.type, win, payout });
    }

    const profit = totalPayout - amount;

    return {
        outcome: totalPayout > 0 ? "win" : "loss",
        multiplier: totalPayout > 0 ? parseFloat((totalPayout / amount).toFixed(4)) : 0,
        payout: parseFloat(totalPayout.toFixed(8)),
        profit: parseFloat(profit.toFixed(8)),
        gameResult: {
            spin,
            color: spin === 0 ? "green" : isRed ? "red" : "black",
            betResults,
        },
    };
}

function calculateCrashResult(
    hash: string,
    amount: number,
    gameData: z.infer<typeof CrashGameDataSchema>,
    houseEdge: number
): GameResult {
    // Generate crash point
    const e = 2 ** 52;
    const h = parseInt(hash.substring(0, 13), 16);
    const crashPoint = Math.max(1, Math.floor((100 * e - h) / (e - h)) / 100);
    const adjustedCrash = crashPoint * (1 - houseEdge);

    const { autoCashout } = gameData;
    const cashoutAt = autoCashout || adjustedCrash; // If no auto, assume max

    const win = adjustedCrash >= cashoutAt;
    const multiplier = win ? cashoutAt : 0;
    const payout = win ? amount * multiplier : 0;
    const profit = payout - amount;

    return {
        outcome: win ? "win" : "loss",
        multiplier: parseFloat(multiplier.toFixed(2)),
        payout: parseFloat(payout.toFixed(8)),
        profit: parseFloat(profit.toFixed(8)),
        gameResult: {
            crashPoint: parseFloat(adjustedCrash.toFixed(2)),
            cashoutAt: parseFloat(cashoutAt.toFixed(2)),
            cashedOut: win,
        },
    };
}

function calculateBlackjackResult(
    hash: string,
    amount: number,
    _gameData: z.infer<typeof BlackjackGameDataSchema>,
    houseEdge: number
): GameResult {
    // Simplified blackjack - deal initial hands
    const deck = [...Array(52).keys()];
    const usedCards: number[] = [];

    function drawCard(offset: number): number {
        const cardIndex = hashToInt(hash.substring(offset * 2, offset * 2 + 8), 52);
        const card = deck.filter(c => !usedCards.includes(c))[cardIndex % (52 - usedCards.length)];
        usedCards.push(card);
        return card;
    }

    function cardValue(card: number): number {
        const rank = card % 13;
        if (rank === 0) return 11; // Ace
        if (rank >= 10) return 10; // Face cards
        return rank + 1;
    }

    function handValue(cards: number[]): number {
        let total = cards.reduce((sum, c) => sum + cardValue(c), 0);
        let aces = cards.filter(c => c % 13 === 0).length;
        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }
        return total;
    }

    const playerCards = [drawCard(0), drawCard(1)];
    const dealerCards = [drawCard(2), drawCard(3)];

    const playerValue = handValue(playerCards);
    const dealerValue = handValue(dealerCards);

    // Simple stand-on-17 dealer logic
    let win = false;
    let multiplier = 0;
    let outcome: "win" | "loss" = "loss";

    if (playerValue === 21 && dealerValue !== 21) {
        win = true;
        multiplier = 2.5; // Blackjack pays 3:2
    } else if (dealerValue > 21 || (playerValue <= 21 && playerValue > dealerValue)) {
        win = true;
        multiplier = 2;
    } else if (playerValue === dealerValue && playerValue <= 21) {
        multiplier = 1; // Push
        win = true;
    }

    multiplier *= (1 - houseEdge);
    const payout = win ? amount * multiplier : 0;
    const profit = payout - amount;
    outcome = profit >= 0 ? "win" : "loss";

    return {
        outcome,
        multiplier: parseFloat(multiplier.toFixed(4)),
        payout: parseFloat(payout.toFixed(8)),
        profit: parseFloat(profit.toFixed(8)),
        gameResult: {
            playerCards,
            dealerCards,
            playerValue,
            dealerValue,
        },
    };
}

function calculateSlotsResult(
    hash: string,
    amount: number,
    _gameData: z.infer<typeof SlotsGameDataSchema>,
    houseEdge: number
): GameResult {
    // 5-reel slots with symbols
    const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "🎰"];
    const reels: string[][] = [];

    for (let i = 0; i < 5; i++) {
        const reel: string[] = [];
        for (let j = 0; j < 3; j++) {
            const idx = hashToInt(hash.substring((i * 3 + j) * 2, (i * 3 + j) * 2 + 4), symbols.length);
            reel.push(symbols[idx]);
        }
        reels.push(reel);
    }

    // Check middle row for matches
    const middleRow = reels.map(r => r[1]);
    let matchCount = 1;
    for (let i = 1; i < 5; i++) {
        if (middleRow[i] === middleRow[0]) matchCount++;
        else break;
    }

    // Multiplier table
    const multiplierTable: Record<number, number> = {
        3: 5,
        4: 25,
        5: 100,
    };

    let baseMultiplier = multiplierTable[matchCount] || 0;

    // Bonus for premium symbols
    if (matchCount >= 3) {
        if (middleRow[0] === "🎰") baseMultiplier *= 3;
        else if (middleRow[0] === "7️⃣") baseMultiplier *= 2;
        else if (middleRow[0] === "💎") baseMultiplier *= 1.5;
    }

    const multiplier = baseMultiplier * (1 - houseEdge);
    const payout = amount * multiplier;
    const profit = payout - amount;

    return {
        outcome: profit > 0 ? "win" : "loss",
        multiplier: parseFloat(multiplier.toFixed(4)),
        payout: parseFloat(payout.toFixed(8)),
        profit: parseFloat(profit.toFixed(8)),
        gameResult: {
            reels,
            middleRow,
            matchCount,
            matchSymbol: matchCount >= 3 ? middleRow[0] : null,
        },
    };
}

// =============================================================================
// GAME DISPATCHER
// =============================================================================

function calculateGameResult(
    gameId: string,
    hash: string,
    amount: number,
    gameData: Record<string, unknown>,
    houseEdge: number
): GameResult {
    switch (gameId) {
        case "dice":
            return calculateDiceResult(hash, amount, DiceGameDataSchema.parse(gameData), houseEdge);
        case "plinko":
            return calculatePlinkoResult(hash, amount, PlinkoGameDataSchema.parse(gameData), houseEdge);
        case "mines":
            return calculateMinesResult(hash, amount, MinesGameDataSchema.parse(gameData), houseEdge);
        case "roulette":
            return calculateRouletteResult(hash, amount, RouletteGameDataSchema.parse(gameData), houseEdge);
        case "crash":
            return calculateCrashResult(hash, amount, CrashGameDataSchema.parse(gameData), houseEdge);
        case "blackjack":
            return calculateBlackjackResult(hash, amount, BlackjackGameDataSchema.parse(gameData), houseEdge);
        case "slots":
            return calculateSlotsResult(hash, amount, SlotsGameDataSchema.parse(gameData), houseEdge);
        default:
            throw new Error(`Unsupported game: ${gameId}`);
    }
}

// =============================================================================
// EDGE FUNCTION HANDLER
// =============================================================================

Deno.serve(async (req: Request) => {
    // CORS
    if (req.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
            },
        });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        // 1) AUTH
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Verify JWT and get user
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ success: false, error: "Invalid token" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 2) INPUT VALIDATION
        const body = await req.json();
        const parseResult = PlaceBetRequestSchema.safeParse(body);

        if (!parseResult.success) {
            return new Response(JSON.stringify({
                success: false,
                error: "Invalid request",
                details: parseResult.error.flatten()
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { gameId, currency, amount, isDemo, gameData = {} } = parseResult.data;

        // Validate isDemo + currency consistency
        if (!isDemo && currency === "DEMO") {
            return new Response(JSON.stringify({
                success: false,
                error: "Cannot use DEMO currency for real bets"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (isDemo && currency !== "DEMO") {
            return new Response(JSON.stringify({
                success: false,
                error: "Demo bets must use DEMO currency"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Validate game-specific data schema
        try {
            switch (gameId) {
                case "dice": DiceGameDataSchema.parse(gameData); break;
                case "plinko": PlinkoGameDataSchema.parse(gameData); break;
                case "mines": MinesGameDataSchema.parse(gameData); break;
                case "roulette": RouletteGameDataSchema.parse(gameData); break;
                case "crash": CrashGameDataSchema.parse(gameData); break;
                case "blackjack": BlackjackGameDataSchema.parse(gameData); break;
                case "slots": SlotsGameDataSchema.parse(gameData); break;
            }
        } catch (validationError) {
            return new Response(JSON.stringify({
                success: false,
                error: "Invalid game data",
                details: validationError instanceof Error ? validationError.message : "Unknown error"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 3) DB RPC — validate_and_lock_bet
        const { data: lockResult, error: lockError } = await supabase.rpc("validate_and_lock_bet", {
            p_user_id: user.id,
            p_game_id: gameId,
            p_amount: amount,
            p_currency: currency,
            p_is_demo: isDemo,
            p_game_data: gameData,
        });

        if (lockError) {
            console.error("Lock error:", lockError);
            return new Response(JSON.stringify({
                success: false,
                error: "Failed to place bet",
                details: lockError.message
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!lockResult.success) {
            return new Response(JSON.stringify({
                success: false,
                error: lockResult.error
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { bet_id, server_seed, client_seed, nonce, house_edge } = lockResult;

        // 4) GAME RESULT CALCULATION (EDGE ONLY)
        const hash = generateGameHash(server_seed, client_seed, nonce);
        const result = calculateGameResult(gameId, hash, amount, gameData, parseFloat(house_edge));

        // 5) DB RPC — settle_bet
        const { data: settleResult, error: settleError } = await supabase.rpc("settle_bet", {
            p_bet_id: bet_id,
            p_multiplier: result.multiplier,
            p_payout: result.payout,
            p_profit: result.profit,
            p_result_data: result.gameResult,
        });

        if (settleError) {
            console.error("Settle error:", settleError);
            // Bet remains pending - will be handled by cron
            return new Response(JSON.stringify({
                success: false,
                error: "Failed to settle bet",
                betId: bet_id,
                details: "Bet is pending and will be resolved automatically"
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!settleResult.success) {
            return new Response(JSON.stringify({
                success: false,
                error: settleResult.error,
                betId: bet_id
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 6) RESPONSE
        return new Response(JSON.stringify({
            success: true,
            betId: bet_id,
            result: {
                outcome: result.outcome,
                multiplier: result.multiplier,
                payout: result.payout,
                profit: result.profit,
                gameResult: result.gameResult,
            },
            nonce,
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
