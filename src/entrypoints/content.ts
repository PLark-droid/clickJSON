import { detectAts } from "@/utils/detector";
import { getExtractor } from "@/extractors/base";

export default defineContentScript({
  matches: [
    "*://hrmos.co/pages/*/jobs/*",
    "*://herp.cloud/*/jobs/*",
    "*://*.herp.cloud/*",
    "*://herp.careers/v1/*",
  ],
  main() {
    // background からの抽出リクエストを処理
    browser.runtime.onMessage.addListener(
      (message: unknown, _sender, sendResponse) => {
        const msg = message as { type?: string };
        if (msg.type === "extract") {
          const url = location.href;
          const ats = detectAts(url);

          if (!ats) {
            sendResponse({ error: "対応していないページです" });
          } else {
            try {
              const extractor = getExtractor(ats);
              const posting = extractor.extract(document, url);
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
