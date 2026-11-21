// Read-only owner viewer relay for the GitHub Pages edition of Lumiose Atlas.
// NEVER handles report submission, writes database rows, or holds a service-role key.
// The unchanged upstream feedback function verifies the signed-in user against
// the existing Stream Bandit admin+owner profile before revealing any reports.
const ALLOWED_ORIGIN = "https://trevieisking.github.io";
const UPSTREAM = "https://xzxqfrvqdgkzwujbkdbk.supabase.co/functions/v1/lumiose-atlas-feedback";
const TOKEN_PATTERN = /^Bearer [A-Za-z0-9._-]{40,8192}$/;

function reply(body, status, cors = true) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "pragma": "no-cache",
    "vary": "Origin",
    "x-content-type-options": "nosniff"
  });
  if (cors) headers.set("access-control-allow-origin", ALLOWED_ORIGIN);
  return new Response(JSON.stringify(body), {status, headers});
}

Deno.serve(async function atlasOwnerReports(req) {
  // Origin alone is NOT authentication: the upstream enforces owner identity
  // on every query. This additionally prevents cross-origin browser reads.
  if (req.headers.get("origin") !== ALLOWED_ORIGIN) {
    return reply({error: "Origin not allowed"}, 403, false);
  }
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": ALLOWED_ORIGIN,
        "access-control-allow-methods": "GET, OPTIONS",
        "access-control-allow-headers": "authorization",
        "access-control-max-age": "300",
        "cache-control": "no-store",
        "vary": "Origin"
      }
    });
  }
  if (req.method !== "GET") return reply({error: "Read-only endpoint"}, 405);
  const bearer = req.headers.get("authorization") || "";
  if (!TOKEN_PATTERN.test(bearer)) return reply({error: "Owner sign-in required"}, 401);
  const url = new URL(req.url);
  if (url.pathname.split("/").pop() !== "lumiose-atlas-owner-reports" ||
      [...url.searchParams.keys()].some(key => key !== "offset")) {
    return reply({error: "Invalid report request"}, 400);
  }
  const offsetValue = url.searchParams.get("offset") ?? "0";
  if (!/^(?:0|[1-9][0-9]{0,6})$/.test(offsetValue) || Number(offsetValue) > 1000000) {
    return reply({error: "Invalid report offset"}, 400);
  }
  try {
    const upstreamUrl = new URL(UPSTREAM);
    upstreamUrl.searchParams.set("view", "admin_reports");
    upstreamUrl.searchParams.set("offset", offsetValue);
    // Server-to-server request: do not send a browser Origin header.
    // The original API enforces JWT validity and Stream Bandit owner status.
    const upstream = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {"authorization": bearer, "accept": "application/json"},
      cache: "no-store",
      signal: AbortSignal.timeout(12000)
    });
    if (upstream.status === 401) return reply({error: "Owner sign-in required"}, 401);
    if (upstream.status === 403) return reply({error: "This account cannot view owner feedback"}, 403);
    if (!upstream.ok) return reply({error: "Report service unavailable"}, 502);
    const result = await upstream.json();
    if (!result || !Array.isArray(result.reports) || result.reports.length > 100) {
      return reply({error: "Invalid report service response"}, 502);
    }
    // Strict field allowlist prevents accidentally exposing unrelated DB data.
    const reports = result.reports.map(row => ({
      id: row.id,
      created_at: row.created_at,
      category: row.category,
      page: row.page,
      details: row.details
    }));
    return reply({
      reports,
      total: Number.isSafeInteger(result.total) ? result.total : null,
      offset: Number(offsetValue)
    }, 200);
  } catch (_error) {
    return reply({error: "Report service unavailable"}, 502);
  }
});
