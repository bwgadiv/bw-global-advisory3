
import fetch from "node-fetch";

// Simple in-memory cache to avoid repetitive calls
const cache = new Map<string, PepResult>();

export type PepResult = {
  matched: boolean;
  score: number; // 0-1 high = more risk
  provider: string;
  details?: any[];
};

const PROVIDERS = {
  COMPLY_EXAMPLE: {
    name: "comply-example",
    endpoint: process.env.COMPLY_API_URL,
    key: process.env.COMPLY_API_KEY
  }
};

// generic lookup function — tries in cache first then provider(s)
export async function pepLookup(name: string): Promise<PepResult> {
  const key = `pep:${name.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached) return cached;

  // For production: iterate providers and try each, prefer highest confidence match
  // Here we call a single provider adapter
  const res = await callComplyProvider(name);
  cache.set(key, res);
  return res;
}

async function callComplyProvider(name: string): Promise<PepResult> {
  if (!PROVIDERS.COMPLY_EXAMPLE.endpoint) {
    // fallback heuristic: simple local checks (placeholder)
    const lower = name.toLowerCase();
    const matched = lower.includes("minister") || lower.includes("sanction") || lower.includes("criminal");
    return { 
        matched, 
        score: matched ? 0.95 : 0.0, 
        provider: "local-heuristic", 
        details: matched ? [{reason: "Name matched internal high-risk heuristic list."}] : [] 
    };
  }

  try {
      const url = `${PROVIDERS.COMPLY_EXAMPLE.endpoint}/search`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          "Authorization": `Bearer ${PROVIDERS.COMPLY_EXAMPLE.key}`
        },
        body: JSON.stringify({ query: name })
      });
      
      if (!resp.ok) throw new Error("Provider error");

      const data: any = await resp.json();
      // map provider result to our schema (adjust as per provider)
      const matched = Array.isArray(data.results) && data.results.length > 0;
      const score = matched ? Math.min(1, 0.3 + (data.results[0].riskScore || 0)) : 0;
      return {
        matched,
        score,
        provider: "comply-example",
        details: data.results || []
      };
  } catch (e) {
      console.error("PEP Provider Error:", e);
      return { matched: false, score: 0, provider: "error-fallback" };
  }
}
