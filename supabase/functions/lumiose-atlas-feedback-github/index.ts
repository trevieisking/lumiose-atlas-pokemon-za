// GitHub Pages-only feedback relay.
// It uses the EXISTING Pokémon Atlas feedback service as the sole writer.
// No service-role key, RLS change, admin route, or original Site source is needed.
const ALLOWED_ORIGIN = "https://trevieisking.github.io";
const UPSTREAM = "https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-feedback";
const categories = new Set(["stuck", "missing", "incorrect", "other"]);
const pagePattern = /^\/(?:[a-z0-9-]+(?:\.html)?(?:\/[a-z0-9-]+(?:\.html)?)*)?(?:#[a-z0-9-]+)?$/i;

function jsonResponse(payload, status, trustedOrigin) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "vary": "Origin"
  });
  if (trustedOrigin) headers.set("access-control-allow-origin", ALLOWED_ORIGIN);
  return new Response(JSON.stringify(payload), {status, headers});
}

Deno.serve(async function atlasGithubFeedback(req) {
  const origin = req.headers.get("origin");
  if (origin !== ALLOWED_ORIGIN) return jsonResponse({error: "Origin not allowed"}, 403, false);
  if (req.method === "OPTIONS") {
    return new Response(null, {status: 204, headers: {
      "access-control-allow-origin": ALLOWED_ORIGIN,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "cache-control": "no-store",
      "vary": "Origin"
    }});
  }
  if (req.method !== "POST") return jsonResponse({error: "Method not allowed"}, 405, true);
  if (!String(req.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
    return jsonResponse({error: "Expected JSON"}, 415, true);
  }
  if (Number(req.headers.get("content-length") || 0) > 4000) return jsonResponse({error:"Message too large"}, 413, true);
  try {
    const raw = await req.text();
    if (raw.length > 4000) return jsonResponse({error: "Message too large"}, 413, true);
    let payload;
    try { payload = JSON.parse(raw); }
    catch { return jsonResponse({error: "Invalid feedback data"}, 400, true); }
    if (!payload || typeof payload !== "object" || payload.kind !== "report" ||
        typeof payload.page !== "string" || payload.page.length > 160 ||
        !pagePattern.test(payload.page) || !payload.page.startsWith("/lumiose-atlas-pokemon-za/") ||
        !categories.has(payload.category) || typeof payload.details !== "string" ||
        payload.details.trim().length < 10 || payload.details.trim().length > 1500 || payload.honey) {
      return jsonResponse({error: "Check the page, category and message (10–1500 characters)."}, 400, true);
    }
    const forwarded = {
      kind: "report",
      page: payload.page,
      category: payload.category,
      details: payload.details.trim(),
      honey: ""
    };
    // Internal function chaining is rate-limited by Supabase; one call per
    // accepted report. The existing service retains database validation/ownership.
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(forwarded),
      signal: AbortSignal.timeout(12000)
    });
    if (!upstream.ok) return jsonResponse({error: "Feedback service unavailable. Please try again."}, 502, true);
    const receipt = await upstream.json();
    if (!receipt || receipt.saved !== true) return jsonResponse({error: "Feedback could not be confirmed."}, 502, true);
    return jsonResponse({saved:true,message:"Thank you! Your feedback was saved."}, 201, true);
  } catch (_error) {
    return jsonResponse({error:"Feedback service unavailable. Please try again."}, 502, true);
  }
});
