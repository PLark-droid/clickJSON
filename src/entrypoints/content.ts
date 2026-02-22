import { isHrmosAgent } from "@/utils/detector";
import { extractHrmosAgent } from "@/extractors/hrmos";

export default defineContentScript({
  matches: ["*://hrmos.co/agent/corporates/*/jobs/*/detail*"],
  main() {
    browser.runtime.onMessage.addListener(
      (message: unknown, _sender, sendResponse) => {
        const msg = message as { type?: string };
        if (msg.type === "extract") {
          const url = location.href;

          if (!isHrmosAgent(url)) {
            sendResponse({ error: "対応していないページです" });
          } else {
            try {
              const posting = extractHrmosAgent(document, url);
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
