export type AtsType = "HRMOS" | "HERP" | null;

const HRMOS_AGENT_DETAIL_PATH =
  /^\/agent\/corporates\/[^/]+\/jobs\/[^/]+\/detail\/?$/;
const HERP_AGENT_REQUISITION_PATH =
  /^\/p\/[^/]+\/requisitions\/id\/[^/]+\/?$/;

export function detectAgent(url: string): AtsType {
  try {
    const target = new URL(url);
    if (
      target.hostname === "hrmos.co" &&
      HRMOS_AGENT_DETAIL_PATH.test(target.pathname)
    ) {
      return "HRMOS";
    }
    if (
      target.hostname === "agent.herp.cloud" &&
      HERP_AGENT_REQUISITION_PATH.test(target.pathname)
    ) {
      return "HERP";
    }
  } catch {
    /* invalid URL */
  }
  return null;
}
