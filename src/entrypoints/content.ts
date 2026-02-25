import { detectAgent } from "@/utils/detector";
import { extractHrmosAgent } from "@/extractors/hrmos";
import { extractHerpAgent } from "@/extractors/herp";
import { extractTalentioAgent } from "@/extractors/talentio";
import type { JobPosting } from "@/types/job-posting";

export default defineContentScript({
  matches: [
    "*://hrmos.co/agent/corporates/*/jobs/*/detail*",
    "*://agent.herp.cloud/p/*/requisitions/id/*",
    "*://agent.talentio.com/r/ats/requisitions/*/candidates/new*",
  ],
  main() {
    browser.runtime.onMessage.addListener(
      (message: unknown, _sender, sendResponse) => {
        const msg = message as { type?: string };
        if (msg.type === "extract") {
          const url = location.href;
          const ats = detectAgent(url);

          if (!ats) {
            sendResponse({ error: "対応していないページです" });
          } else {
            try {
              let posting: JobPosting;
              if (ats === "HRMOS") {
                posting = extractHrmosAgent(document, url);
              } else if (ats === "HERP") {
                posting = extractHerpAgent(document, url);
              } else {
                posting = extractTalentioAgent(document, url);
              }
              sendResponse({ data: posting });
            } catch (e) {
              sendResponse({
                error: e instanceof Error ? e.message : "抽出に失敗しました",
              });
            }
          }
        }
        return true;
      },
    );
  },
});
