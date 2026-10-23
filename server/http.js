export function noStore(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}
export function json(res, status, body) { res.statusCode = status; res.end(JSON.stringify(body)); }
export async function readBody(req) {
  if (req.body) {
    if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
      if (Buffer.byteLength(JSON.stringify(req.body)) > 8192) throw new Error("Body too large");
      return req.body;
    }
    if (Buffer.byteLength(req.body) > 8192) throw new Error("Body too large");
    return JSON.parse(req.body.toString());
  }
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 8192) throw new Error("Body too large"); }
  return JSON.parse(raw);
}
