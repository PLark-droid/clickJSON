export type AtsType = "HRMOS" | "HERP" | "TALENTIO" | null;

const HRMOS_AGENT_DETAIL_PATH =
  /^\/agent\/corporates\/[^/]+\/jobs\/[^/]+\/detail\/?$/;
const HERP_AGENT_REQUISITION_PATH =
  /^\/p\/[^/]+\/requisitions\/id\/[^/]+\/?$/;
const TALENTIO_AGENT_REQUISITION_PATH =
  /^\/r\/ats\/requisitions\/[^/]+\/candidates\/new\/?$/;

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
    if (
      target.hostname === "agent.talentio.com" &&
      TALENTIO_AGENT_REQUISITION_PATH.test(target.pathname)
    ) {
      return "TALENTIO";
    }
  } catch {
    /* invalid URL */
  }
  return null;
}
