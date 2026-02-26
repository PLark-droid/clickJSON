import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { extractPersonaAgent } from "./persona";

function createDoc(html: string): Document {
  return new JSDOM(html).window.document;
}

describe("extractPersonaAgent", () => {
  it("extracts job title from header", () => {
    const doc = createDoc(`
      <div class="slide_2_header">
        <div class="q-my-auto">バックエンドエンジニア</div>
      </div>
      <table class="q-table"></table>
    `);
    const result = extractPersonaAgent(doc, "https://www.agent.persona-ats.com/");
    expect(result.source_ats).toBe("PERSONA");
    expect(result.job_title).toBe("バックエンドエンジニア");
  });

  it("extracts table fields using getRowValue", () => {
    const doc = createDoc(`
      <table class="q-table">
        <tbody>
          <tr><th>雇用形態</th><td>正社員</td></tr>
          <tr><th>給与</th><td>年収500万〜800万</td></tr>
          <tr><th>企業名</th><td>テスト株式会社</td></tr>
          <tr><th>福利厚生</th><td>リモート可\n書籍購入補助\nフレックス制</td></tr>
          <tr><th>業務内容の変更の範囲</th><td>会社の定める業務</td></tr>
          <tr><th>就業場所の変更の範囲</th><td>会社の定める事業所</td></tr>
          <tr><th>参考URL</th><td>https://example.com/reference</td></tr>
        </tbody>
      </table>
      <div class="slide_2_header"></div>
    `);
    const result = extractPersonaAgent(doc, "https://www.agent.persona-ats.com/");
    expect(result.employment_type).toBe("正社員");
    expect(result.salary).toBe("年収500万〜800万");
    expect(result.company).toBe("テスト株式会社");
    expect(result.benefits).toEqual(["リモート可", "書籍購入補助", "フレックス制"]);
    expect(result.scope_change_work).toBe("会社の定める業務");
    expect(result.scope_change_location).toBe("会社の定める事業所");
    expect(result.reference_url).toBe("https://example.com/reference");
  });

  it("extracts free-text sections via getSectionValue", () => {
    const doc = createDoc(`
      <div class="slide_2_header"></div>
      <table class="q-table"></table>
      <div class="row">
        <span class="q-ml-sm q-my-xs">業務内容</span>
      </div>
      <div>サーバーサイド開発全般</div>
      <div class="row">
        <span class="q-ml-sm q-my-xs">募集要項</span>
      </div>
      <div>3年以上の開発経験</div>
      <div class="row">
        <span class="q-ml-sm q-my-xs">よくあるご質問</span>
      </div>
      <div>リモート勤務可能です</div>
      <div class="row">
        <span class="q-ml-sm q-my-xs">備考</span>
      </div>
      <div>特になし</div>
    `);
    const result = extractPersonaAgent(doc, "https://www.agent.persona-ats.com/");
    expect(result.description).toBe("サーバーサイド開発全般");
    expect(result.qualifications).toBe("3年以上の開発経験");
    expect(result.faq).toBe("リモート勤務可能です");
    expect(result.other).toBe("特になし");
  });

  it("extracts free-text section with sibling fallback", () => {
    const doc = createDoc(`
      <div class="slide_2_header"></div>
      <table class="q-table"></table>
      <div class="row">
        <span class="q-ml-sm q-my-xs">業務内容</span>
      </div>
      <div></div>
      <div class="wrapper"></div>
      <div>ラッパーを挟んだ業務内容</div>
    `);
    const result = extractPersonaAgent(doc, "https://www.agent.persona-ats.com/");
    expect(result.description).toBe("ラッパーを挟んだ業務内容");
  });

  it("throws on non-job pages", () => {
    const doc = createDoc("<div></div>");
    expect(() =>
      extractPersonaAgent(doc, "https://www.agent.persona-ats.com/"),
    ).toThrow("PERSONA求人詳細ページを判別できませんでした");
  });
});
