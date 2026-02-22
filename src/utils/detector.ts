const HRMOS_AGENT_HOST = "hrmos.co";
const HRMOS_AGENT_DETAIL_PATH =
  /^\/agent\/corporates\/[^/]+\/jobs\/[^/]+\/detail\/?$/;

export function isHrmosAgent(url: string): boolean {
  try {
    const target = new URL(url);
    if (target.hostname !== HRMOS_AGENT_HOST) return false;
    return HRMOS_AGENT_DETAIL_PATH.test(target.pathname);
  } catch {
    return false;
  }
}
