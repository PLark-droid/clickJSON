/** テーブルの cell ヘッダーテキストに一致する cell の値を取得 */
export function getRowValue(doc: Document, headerText: string): string | null {
  const cells = doc.querySelectorAll("table tr td, table tr th");
  const rows = doc.querySelectorAll("table tr");
  for (const row of rows) {
    const header = row.querySelector("td:first-child, th:first-child");
    if (header?.textContent?.trim() === headerText) {
      const value = row.querySelector("td:last-child, th:last-child");
      if (value && value !== header) {
        return value.textContent?.trim() || null;
      }
    }
  }
  return null;
}

/** リスト形式テキストを配列に変換 */
export function parseList(text: string | null): string[] | null {
  if (!text) return null;
  const items = text
    .split(/\n/)
    .map((line) => line.replace(/^[\s・\-\*●◆◎]+/, "").trim())
    .filter(Boolean);
  return items.length ? items : null;
}
