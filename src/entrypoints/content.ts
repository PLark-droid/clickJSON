import { detectAgent } from "@/utils/detector";
import { extractHrmosAgent } from "@/extractors/hrmos";
import { extractHerpAgent } from "@/extractors/herp";
import { extractTalentioAgent } from "@/extractors/talentio";
import { extractPersonaAgent } from "@/extractors/persona";
import type { JobPosting } from "@/types/job-posting";

export default defineContentScript({
  matches: [
    "*://hrmos.co/agent/corporates/*/jobs/*/detail*",
    "*://agent.herp.cloud/p/*/requisitions/id/*",
    "*://agent.talentio.com/r/ats/requisitions/*/candidates/new*",
    "*://www.agent.persona-ats.com/*",
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
              } else if (ats === "TALENTIO") {
                posting = extractTalentioAgent(document, url);
              } else {
                posting = extractPersonaAgent(document, url);
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
