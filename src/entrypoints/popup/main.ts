import { detectAts } from "@/utils/detector";
import { copyToClipboard } from "@/utils/clipboard";
import type { JobPosting } from "@/types/job-posting";

const statusEl = document.getElementById("status")!;
const extractBtn = document.getElementById(
  "extract-btn",
) as HTMLButtonElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;
const resultEl = document.getElementById("result")!;

let lastResult: JobPosting | null = null;

async function init() {
  try {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.url) {
      statusEl.textContent = "タブ情報を取得できません";
      return;
    }

    const ats = detectAts(tab.url);
    if (!ats) {
      statusEl.textContent = "非対応ページです";
      return;
    }

    statusEl.textContent = `${ats} の求人ページを検出`;
    extractBtn.disabled = false;
  } catch (e) {
    console.error("Failed to initialize popup", e);
    statusEl.textContent = "初期化に失敗しました";
  }
}

extractBtn.addEventListener("click", async () => {
  extractBtn.disabled = true;
  statusEl.textContent = "抽出中...";

  try {
    const response = (await browser.runtime.sendMessage({
      type: "extract",
    })) as { error?: string; data?: JobPosting };
    if (response.error) {
      statusEl.textContent = `エラー: ${response.error}`;
    } else if (response.data) {
      lastResult = response.data;
      statusEl.textContent = "抽出完了";
      resultEl.textContent = JSON.stringify(response.data, null, 2);
      resultEl.hidden = false;
      copyBtn.hidden = false;
    }
  } catch {
    statusEl.textContent = "通信エラーが発生しました";
  } finally {
    extractBtn.disabled = false;
  }
});

copyBtn.addEventListener("click", async () => {
  if (!lastResult) return;
  try {
    await copyToClipboard(lastResult);
    copyBtn.textContent = "コピーしました!";
    setTimeout(() => {
      copyBtn.textContent = "JSONをコピー";
    }, 1500);
  } catch {
    copyBtn.textContent = "コピー失敗";
  }
});

init();
