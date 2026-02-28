import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { extractTalentioAgent } from "./talentio";

function createDoc(html: string): Document {
  return new JSDOM(html).window.document;
}

describe("extractTalentioAgent", () => {
  it("prefers <li> items for list fields", () => {
    const doc = createDoc(`
      <div class="requisition-details__company-name">ACME</div>
      <div class="requisition-details__requisition-name">Backend Engineer</div>
      <div class="requisition-details__job-title-name">Engineer</div>
      <div class="requisition-details__items-item">
        <div class="requisition-details__items-item-title">必須条件</div>
        <div class="requisition-details__items-item-value">
          <ul>
            <li>TypeScript実務経験</li>
            <li>Node.js開発経験</li>
          </ul>
        </div>
      </div>
      <div class="requisition-details__items-item">
        <div class="requisition-details__items-item-title">歓迎条件</div>
        <div class="requisition-details__items-item-value">\n・AWS経験\n・CI/CD構築経験\n</div>
      </div>
      <div class="requisition-details__items-item">
        <div class="requisition-details__items-item-title">福利厚生</div>
        <div class="requisition-details__items-item-value">
          <ul>
            <li>リモート可</li>
            <li>書籍購入補助</li>
          </ul>
        </div>
      </div>
    `);

    const extracted = extractTalentioAgent(doc, "https://example.test/job");

    expect(extracted.requirements).toEqual([
      "TypeScript実務経験",
      "Node.js開発経験",
    ]);
    expect(extracted.preferred).toEqual(["AWS経験", "CI/CD構築経験"]);
    expect(extracted.benefits).toEqual(["リモート可", "書籍購入補助"]);
  });

  it("normalizes labels for colon, spaces, and trailing 等", () => {
    const doc = createDoc(`
      <div class="requisition-details__items-item">
        <div class="requisition-details__items-item-title">募集　背景：</div>
        <div class="requisition-details__items-item-value">事業拡大のため</div>
      </div>
      <div class="requisition-details__items-item">
        <div class="requisition-details__items-item-title">求める人物像:</div>
        <div class="requisition-details__items-item-value">自走できる方</div>
      </div>
    `);

    const extracted = extractTalentioAgent(doc, "https://example.test/job");

    expect(extracted.recruitment_background).toBe("事業拡大のため");
    expect(extracted.ideal_candidate).toBe("自走できる方");
  });
});
