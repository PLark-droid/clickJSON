import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { getRowValue, parseList } from "./common";

describe("parseList", () => {
  it("parses bullet/newline text into array", () => {
    const text = "\n・項目A\n- 項目B\n  ● 項目C\n";
    expect(parseList(text)).toEqual(["項目A", "項目B", "項目C"]);
  });

  it("returns null for empty text", () => {
    expect(parseList(null)).toBeNull();
    expect(parseList("   ")).toBeNull();
  });
});

describe("getRowValue", () => {
  it("returns value from row by header", () => {
    const dom = new JSDOM(`
      <table>
        <tr><th>雇用形態</th><td>正社員</td></tr>
        <tr><th>給与</th><td>500万円</td></tr>
      </table>
    `);

    expect(getRowValue(dom.window.document, "給与")).toBe("500万円");
  });

  it("returns null when header does not exist", () => {
    const dom = new JSDOM("<table><tr><th>勤務地</th><td>東京</td></tr></table>");
    expect(getRowValue(dom.window.document, "給与")).toBeNull();
  });
});
