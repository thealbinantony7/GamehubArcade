import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// =============================================================================
// SCHEMA
// =============================================================================

const RotateSeedRequestSchema = z.object({
    clientSeed: z.string().min(1).max(64).optional(),
});

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
        const body = await req.json().catch(() => ({}));
        const parseResult = RotateSeedRequestSchema.safeParse(body);

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

        // 3) DB RPC — manual_rotate_seed
        const { data: result, error: rpcError } = await supabase.rpc("manual_rotate_seed", {
            p_user_id: user.id,
        });

        if (rpcError) {
            return new Response(JSON.stringify({
                success: false,
                error: "Failed to rotate seed",
                details: rpcError.message
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 4) HANDLE RESPONSE
        if (!result.success) {
            // Rate limited
            if (result.error === "Rate limited") {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Rate limited. Please wait 10 seconds between seed rotations."
                }), {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "Retry-After": "10",
                    },
                });
            }

            return new Response(JSON.stringify({
                success: false,
                error: result.error
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 5) SUCCESS RESPONSE
        return new Response(JSON.stringify({
            success: true,
            oldServerSeed: result.old_seed,
            newServerSeedHash: result.new_hash,
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
            details: error instanceof Error ? error.message : "Unknown error"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
