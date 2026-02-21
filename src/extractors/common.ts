type LdData = Record<string, unknown>;

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isJobPostingNode = (node: unknown): node is LdData => {
  if (!isRecord(node)) return false;
  const type = node["@type"];
  if (typeof type === "string") return type === "JobPosting";
  if (Array.isArray(type)) return type.includes("JobPosting");
  return false;
};

const pickJobPosting = (payload: unknown): LdData | null => {
  if (!payload) return null;

  const candidates: unknown[] = [];
  if (Array.isArray(payload)) {
    candidates.push(...payload);
  } else if (isRecord(payload)) {
    candidates.push(payload);
    const graph = payload["@graph"];
    if (Array.isArray(graph)) candidates.push(...graph);
    if (isRecord(graph)) candidates.push(graph);
  }

  for (const candidate of candidates) {
    if (isJobPostingNode(candidate)) return candidate;
  }
  return null;
};

/** JobPosting の JSON-LD をページ内から探す */
export function parseJobPostingJsonLd(doc: Document): LdData | null {
  const scripts = Array.from(
    doc.querySelectorAll('script[type="application/ld+json"]'),
  );

  for (const script of scripts) {
    const content = script.textContent;
    if (!content) continue;
    try {
      const data = JSON.parse(content);
      const posting = pickJobPosting(data);
      if (posting) return posting;
    } catch {
      // 他の script タグが壊れていても無視して次へ
    }
  }
  return null;
}

export function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

const normalizeAddress = (addr: unknown): string | null => {
  if (typeof addr === "string") return normalizeString(addr);
  if (!isRecord(addr)) return null;

  const parts = [
    normalizeString(addr.addressRegion),
    normalizeString(addr.addressLocality),
    normalizeString(addr.streetAddress),
  ].filter(Boolean) as string[];

  const joined = parts.join(" ");
  return joined || normalizeString(addr.name);
};

/** JSON-LD の jobLocation 等から住所文字列を組み立て */
export function formatJobLocation(jobLocation: unknown): string | null {
  if (!jobLocation) return null;
  const locations = Array.isArray(jobLocation) ? jobLocation : [jobLocation];

  const results: string[] = [];
  for (const loc of locations) {
    if (typeof loc === "string") {
      const normalized = normalizeString(loc);
      if (normalized) results.push(normalized);
      continue;
    }
    if (!isRecord(loc)) continue;

    const formatted =
      normalizeAddress(loc.address) ??
      normalizeString(loc.name) ??
      normalizeAddress(loc);

    if (formatted) results.push(formatted);
  }

  return results.length ? results.join(" / ") : null;
}
