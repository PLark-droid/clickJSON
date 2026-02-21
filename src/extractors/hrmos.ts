import type { JobPosting } from "@/types/job-posting";
import {
  formatJobLocation,
  normalizeString,
  parseJobPostingJsonLd,
  isRecord,
} from "./common";

/** 詳細テーブルから th テキストに一致する td の値を取得 */
function getTableValue(doc: Document, thText: string): string | null {
  const rows = doc.querySelectorAll("article.pg-body section.pg-descriptions table tr");
  for (const row of rows) {
    const th = row.querySelector("th");
    if (th?.textContent?.trim() === thText) {
      return row.querySelector("td")?.textContent?.trim() ?? null;
    }
  }
  return null;
}

/** markdown セクションから見出しテキストに一致するコンテンツを取得 */
function getSectionContent(doc: Document, headingTexts: string[]): string | null {
  const headings = doc.querySelectorAll("article.pg-body section.pg-markdown h2, article.pg-body section.pg-markdown h3");
  for (const heading of headings) {
    const text = heading.textContent?.trim() ?? "";
    if (headingTexts.some((t) => text.includes(t))) {
      const lines: string[] = [];
      let el = heading.nextElementSibling;
      while (el && !["H2", "H3"].includes(el.tagName)) {
        const t = el.textContent?.trim();
        if (t) lines.push(t);
        el = el.nextElementSibling;
      }
      if (lines.length) return lines.join("\n");
    }
  }
  return null;
}

/** リスト形式のテキストを配列に変換 */
function parseList(text: string | null): string[] | null {
  if (!text) return null;
  const items = text
    .split(/\n/)
    .map((line) => line.replace(/^[\s・\-\*●▪︎]+/, "").trim())
    .filter(Boolean);
  return items.length ? items : null;
}

export function extractHrmos(doc: Document, url: string): JobPosting {
  const ld = parseJobPostingJsonLd(doc);

  const title =
    normalizeString(ld?.title) ??
    normalizeString(
      doc.querySelector("h1.sg-corporate-name")?.textContent,
    ) ??
    null;

  const company =
    normalizeString(
      isRecord(ld?.hiringOrganization)
        ? ld?.hiringOrganization.name
        : undefined,
    ) ??
    normalizeString(
      doc
        .querySelector("header.sg-header.sg-breadcrumbs ol li:first-child a")
        ?.textContent,
    ) ??
    null;

  const location =
    formatJobLocation(ld?.jobLocation) ??
    normalizeString(getTableValue(doc, "勤務地")) ??
    null;

  const employmentType =
    normalizeString(ld?.employmentType) ??
    normalizeString(getTableValue(doc, "雇用形態")) ??
    null;

  const salary = normalizeString(getTableValue(doc, "給与"));

  const description =
    normalizeString(
      getSectionContent(doc, ["業務内容", "職務内容", "仕事内容"]),
    ) ?? null;

  const requirements = parseList(
    getSectionContent(doc, ["必須", "求める能力", "応募資格"]),
  );

  const preferred = parseList(getSectionContent(doc, ["歓迎"]));

  const benefits = (() => {
    const val = getTableValue(doc, "福利厚生") ?? getTableValue(doc, "待遇");
    return parseList(val);
  })();

  return {
    title,
    company,
    location,
    employment_type: employmentType,
    salary,
    description,
    requirements,
    preferred,
    benefits,
    source_ats: "HRMOS",
    source_url: url,
    extracted_at: new Date().toISOString(),
  };
}
