import type { JobPosting } from "@/types/job-posting";
import {
  formatJobLocation,
  normalizeString,
  parseJobPostingJsonLd,
  isRecord,
} from "./common";

/** セクション見出し ID からコンテンツを取得 */
function getSectionText(doc: Document, headingId: string): string | null {
  const heading = doc.querySelector(headingId);
  const section = heading?.closest("section.with-heading");
  const content = section?.querySelector(".with-heading__content .multiline-text");
  return normalizeString(content?.textContent);
}

/** 応募概要 / 企業情報の kv-table から値を取得 */
function getKvValue(doc: Document, sectionHeadingId: string, thText: string): string | null {
  const heading = doc.querySelector(sectionHeadingId);
  const section = heading?.closest("section.with-heading");
  const rows = section?.querySelectorAll(".kv-table tr");
  if (!rows) return null;
  for (const row of rows) {
    if (row.querySelector("th")?.textContent?.trim() === thText) {
      return normalizeString(row.querySelector("td")?.textContent);
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

export function extractHerp(doc: Document, url: string): JobPosting {
  const ld = parseJobPostingJsonLd(doc);

  const title =
    normalizeString(
      doc.querySelector("h1.requisition-header__name")?.textContent,
    ) ??
    normalizeString(ld?.title) ??
    null;

  const company =
    normalizeString(
      doc.querySelector("p.requisition-header__company")?.textContent,
    ) ??
    normalizeString(
      isRecord(ld?.hiringOrganization)
        ? ld?.hiringOrganization.name
        : undefined,
    ) ??
    null;

  const WC = "#heading-workingConditions";

  const location =
    getKvValue(doc, WC, "勤務地") ??
    formatJobLocation(ld?.jobLocation) ??
    null;

  const employmentType =
    getKvValue(doc, WC, "雇用形態") ?? null;

  const salary =
    getKvValue(doc, WC, "給与") ?? null;

  const description =
    getSectionText(doc, "#heading-description") ?? null;

  const requirements = parseList(
    getSectionText(doc, "#heading-requirements"),
  );

  const preferred = parseList(
    getSectionText(doc, "#heading-preferredExperiences"),
  );

  const benefits = parseList(
    getKvValue(doc, WC, "福利厚生"),
  );

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
    source_ats: "HERP",
    source_url: url,
    extracted_at: new Date().toISOString(),
  };
}
