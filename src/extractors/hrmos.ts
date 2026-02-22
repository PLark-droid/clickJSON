import type { JobPosting } from "@/types/job-posting";
import { getRowValue, parseList } from "./common";

/** HRMOS の応募資格テキストから必須/歓迎を分離 */
function parseQualifications(text: string | null): {
  requirements: string[] | null;
  preferred: string[] | null;
} {
  if (!text) return { requirements: null, preferred: null };

  const mustMatch = text.match(/【必須[^】]*】([\s\S]*?)(?=【歓迎|$)/);
  const wantMatch = text.match(/【歓迎[^】]*】([\s\S]*?)$/);

  const parseItems = (raw: string | undefined): string[] | null => {
    if (!raw) return null;
    const items = raw
      .split(/\n/)
      .map((line) => line.replace(/^[\s・\-\*●]+/, "").trim())
      .filter(Boolean);
    return items.length ? items : null;
  };

  return {
    requirements: parseItems(mustMatch?.[1]),
    preferred: parseItems(wantMatch?.[1]),
  };
}

export function extractHrmosAgent(doc: Document, url: string): JobPosting {
  const qualificationsText = getRowValue(doc, "応募資格");
  const { requirements, preferred } = parseQualifications(qualificationsText);

  return {
    source_ats: "HRMOS",

    position: getRowValue(doc, "職種 / 募集ポジション"),
    job_title: getRowValue(doc, "求人タイトル"),
    employment_type: getRowValue(doc, "雇用形態"),
    salary: getRowValue(doc, "給与"),
    location: getRowValue(doc, "勤務地"),
    description: null,
    qualifications: qualificationsText,
    requirements,
    preferred,
    ideal_candidate: null,
    benefits: parseList(getRowValue(doc, "福利厚生")),
    job_details: getRowValue(doc, "仕事についての詳細"),
    work_schedule: null,
    probation: null,
    other: null,

    agent_info: getRowValue(doc, "エージェント向け情報"),
    recruitment_background: null,
    target: null,
    headcount: null,
    selection_process: null,
    recruitment_period: null,
    compensation: null,
    priority: null,

    company: getRowValue(doc, "会社名"),
    representative: getRowValue(doc, "代表者名"),
    founded: getRowValue(doc, "設立年月"),
    business: getRowValue(doc, "事業内容"),
    clients: getRowValue(doc, "取引先"),
    capital: getRowValue(doc, "資本金"),
    address: getRowValue(doc, "所在地"),
    branch_address: null,
    employees: null,
    group_companies: getRowValue(doc, "グループ会社"),
    company_url: null,
    company_details: getRowValue(doc, "会社についての詳細"),

    source_url: url,
    extracted_at: new Date().toISOString(),
  };
}
