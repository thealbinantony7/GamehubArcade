import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// =============================================================================
// CONSTANTS
// =============================================================================

const SUPPORTED_CURRENCIES = ["BTC", "ETH", "USDT", "SOL"] as const;
const SUPPORTED_CHAINS = ["bitcoin", "ethereum", "solana", "polygon"] as const;

// Currency to CoinGecko ID mapping
const COINGECKO_IDS: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    SOL: "solana",
};

// Currency to valid chains mapping
const CURRENCY_CHAINS: Record<string, string[]> = {
    BTC: ["bitcoin"],
    ETH: ["ethereum", "polygon"],
    USDT: ["ethereum", "polygon", "solana"],
    SOL: ["solana"],
};

// Address regex patterns per chain
const ADDRESS_PATTERNS: Record<string, RegExp> = {
    bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
    ethereum: /^0x[a-fA-F0-9]{40}$/,
    polygon: /^0x[a-fA-F0-9]{40}$/,
    solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
};

// =============================================================================
// SCHEMA
// =============================================================================

const WithdrawalRequestSchema = z.object({
    currency: z.enum(SUPPORTED_CURRENCIES),
    amount: z.number().positive(),
    address: z.string().min(20).max(100),
    chain: z.enum(SUPPORTED_CHAINS),
});

// =============================================================================
// PRICE FETCHER
// =============================================================================

async function fetchUsdPrice(currency: string): Promise<number> {
    const coinId = COINGECKO_IDS[currency];
    if (!coinId) throw new Error(`Unknown currency: ${currency}`);

    // USDT is pegged to $1
    if (currency === "USDT") return 1.0;

    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
            {
                headers: { "Accept": "application/json" },
            }
        );

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        const price = data[coinId]?.usd;

        if (typeof price !== "number" || price <= 0) {
            throw new Error(`Invalid price data for ${currency}`);
        }

        return price;
    } catch (error) {
        // Fallback prices if API fails (conservative estimates)
        const fallbackPrices: Record<string, number> = {
            BTC: 40000,
            ETH: 2500,
            SOL: 100,
        };
        return fallbackPrices[currency] || 0;
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
        // 1) AUTHENTICATE USER
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

        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ success: false, error: "Invalid token" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 2) VALIDATE INPUT
        const body = await req.json();
        const parseResult = WithdrawalRequestSchema.safeParse(body);

        if (!parseResult.success) {
            return new Response(JSON.stringify({
                success: false,
                error: "Invalid request",
                details: parseResult.error.flatten(),
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { currency, amount, address, chain } = parseResult.data;

        // Validate chain matches currency
        const validChains = CURRENCY_CHAINS[currency];
        if (!validChains || !validChains.includes(chain)) {
            return new Response(JSON.stringify({
                success: false,
                error: `Invalid chain '${chain}' for currency '${currency}'. Valid chains: ${validChains?.join(", ")}`,
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Validate address format
        const addressPattern = ADDRESS_PATTERNS[chain];
        if (!addressPattern || !addressPattern.test(address)) {
            return new Response(JSON.stringify({
                success: false,
                error: `Invalid ${chain} address format`,
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 3) FETCH USD PRICE
        const usdPrice = await fetchUsdPrice(currency);
        const usdEquivalent = parseFloat((amount * usdPrice).toFixed(2));

        // 4) CALL DB RPC
        const { data: withdrawalId, error: rpcError } = await supabase.rpc("create_withdrawal", {
            p_user_id: user.id,
            p_currency: currency,
            p_amount: amount,
            p_address: address,
            p_chain: chain,
            p_usd: usdEquivalent,
        });

        if (rpcError) {
            return new Response(JSON.stringify({
                success: false,
                error: rpcError.message,
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 5) SUCCESS RESPONSE
        return new Response(JSON.stringify({
            success: true,
            withdrawalId: withdrawalId,
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error",
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
