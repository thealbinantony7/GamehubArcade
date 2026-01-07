import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// =============================================================================
// SCHEMA
// =============================================================================

const ApproveWithdrawalSchema = z.object({
    withdrawalId: z.string().uuid(),
    txHash: z.string().min(10).max(100).optional(),
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
        const parseResult = ApproveWithdrawalSchema.safeParse(body);

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

        const { withdrawalId, txHash } = parseResult.data;

        // 3) CALL DB RPC (DB handles admin check + state machine)
        const { data: result, error: rpcError } = await supabase.rpc("approve_withdrawal", {
            p_id: withdrawalId,
            p_admin_id: user.id,
            p_tx_hash: txHash || null,
        });

        if (rpcError) {
            return new Response(JSON.stringify({
                success: false,
                error: rpcError.message,
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 4) RETURN DB RESPONSE
        if (!result.success) {
            // Check for auth failure
            if (result.error === "Unauthorized") {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Unauthorized: Finance admin role required",
                }), {
                    status: 403,
                    headers: { "Content-Type": "application/json" },
                });
            }

            return new Response(JSON.stringify({
                success: false,
                error: result.error,
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({
            success: true,
            status: result.status,
            withdrawalId,
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
