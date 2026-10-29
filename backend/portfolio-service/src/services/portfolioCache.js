import crypto from "crypto";

let cachedPayload = null;
let cachedETag = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export function getCachedPortfolio() {
  if (cachedPayload && (Date.now() - cacheTimestamp < CACHE_TTL_MS)) {
    return { data: cachedPayload, etag: cachedETag };
  }
  return null;
}

export function setCachedPortfolio(data) {
  cachedPayload = data;
  const jsonStr = JSON.stringify(data);
  const hash = crypto.createHash("sha1").update(jsonStr).digest("hex").slice(0, 16);
  cachedETag = `W/"${hash}"`;
  cacheTimestamp = Date.now();
  return { data: cachedPayload, etag: cachedETag };
}

export function invalidatePortfolioCache() {
  cachedPayload = null;
  cachedETag = null;
  cacheTimestamp = 0;
}
