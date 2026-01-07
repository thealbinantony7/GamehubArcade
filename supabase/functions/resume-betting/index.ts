import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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

        // 2) CALL DB RPC (DB checks super_admin role)
        const { data: result, error: rpcError } = await supabase.rpc("resume_betting", {
            p_admin_id: user.id,
        });

        if (rpcError) {
            // Check if it's an exception from DB
            if (rpcError.message.includes("Super admin required")) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Forbidden: Super admin role required",
                }), {
                    status: 403,
                    headers: { "Content-Type": "application/json" },
                });
            }

            return new Response(JSON.stringify({
                success: false,
                error: rpcError.message,
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 3) BROADCAST REALTIME EVENT
        const channel = supabase.channel("system");
        await channel.send({
            type: "broadcast",
            event: "resume_betting",
            payload: {
                timestamp: new Date().toISOString(),
            },
        });

        // 4) SUCCESS RESPONSE
        return new Response(JSON.stringify({
            success: true,
            message: "Betting has been resumed.",
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
