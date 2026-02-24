import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch all active alerts
    const { data: alerts, error: alertError } = await supabase
      .from("price_alerts")
      .select("*, profiles!inner(email)")
      .eq("active", true);

    if (alertError) throw alertError;
    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({ message: "No active alerts" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get unique coin IDs
    const coinIds = [...new Set(alerts.map((a: any) => a.coin_id))].join(",");

    // Fetch current prices from CoinGecko
    const priceRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
    );
    const prices = await priceRes.json();

    const triggered: string[] = [];

    for (const alert of alerts) {
      const currentPrice = prices[alert.coin_id]?.usd;
      if (!currentPrice) continue;

      const shouldTrigger =
        (alert.direction === "above" && currentPrice >= alert.target_price) ||
        (alert.direction === "below" && currentPrice <= alert.target_price);

      if (shouldTrigger) {
        const email = (alert as any).profiles?.email;
        if (email) {
          // Send email notification using Lovable AI gateway for a simple notification
          const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
          if (LOVABLE_API_KEY) {
            // Use AI to generate a nicely formatted alert message
            const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash-lite",
                messages: [{
                  role: "user",
                  content: `Generate a brief, professional crypto price alert email body (plain text, no subject line). The coin ${alert.coin_name} (${alert.symbol}) has ${alert.direction === "above" ? "risen above" : "dropped below"} the target price of $${alert.target_price}. Current price is $${currentPrice}. Keep it under 100 words.`
                }],
              }),
            });
            if (aiRes.ok) {
              const aiData = await aiRes.json();
              const emailBody = aiData.choices?.[0]?.message?.content || "";
              console.log(`Alert triggered for ${email}: ${alert.coin_name} ${alert.direction} $${alert.target_price}. Current: $${currentPrice}. Body: ${emailBody}`);
            }
          }
        }

        // Mark alert as triggered
        await supabase
          .from("price_alerts")
          .update({ active: false, triggered_at: new Date().toISOString() })
          .eq("id", alert.id);

        triggered.push(alert.id);
      }
    }

    return new Response(JSON.stringify({ triggered, checked: alerts.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("check-alerts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
