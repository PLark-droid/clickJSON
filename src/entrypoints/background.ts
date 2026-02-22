import { detectAgent } from "@/utils/detector";

export default defineBackground(() => {
  // タブ更新時に対応ページ判定してバッジ表示
  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" || !tab.url) return;

    const ats = detectAgent(tab.url);
    if (ats) {
      await browser.action.setBadgeText({ tabId, text: ats });
      await browser.action.setBadgeBackgroundColor({ tabId, color: "#4CAF50" });
    } else {
      await browser.action.setBadgeText({ tabId, text: "" });
    }
  });

  // Popup からの抽出リクエストを Content Script に中継
  browser.runtime.onMessage.addListener(
    (message: unknown, _sender, sendResponse) => {
      const msg = message as { type?: string };
      if (msg.type === "extract") {
        (async () => {
          const [tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
          });
          if (!tab?.id) {
            sendResponse({ error: "タブが見つかりません" });
            return;
          }

          try {
            const result = await browser.tabs.sendMessage(tab.id, {
              type: "extract",
            });
            sendResponse(result);
          } catch {
            sendResponse({ error: "Content Script と通信できません" });
          }
        })();
      }
      return true;
    },
  );
});
