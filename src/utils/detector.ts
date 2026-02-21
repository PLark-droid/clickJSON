export type AtsType = "HRMOS" | "HERP" | null;

const HRMOS_PATTERN = /hrmos\.co\/pages\/[^/]+\/jobs\//;
const HERP_PATTERN =
  /(?:herp\.cloud\/[^/]+\/jobs\/|[^/]+\.herp\.cloud\/|herp\.careers\/v1\/)/;

export function detectAts(url: string): AtsType {
  if (HRMOS_PATTERN.test(url)) return "HRMOS";
  if (HERP_PATTERN.test(url)) return "HERP";
  return null;
}
