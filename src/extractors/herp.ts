import type { JobPosting } from "@/types/job-posting";
import { getRowValue, parseList } from "./common";

/** ページタイトルから企業名を取得 (「求人タイトル - 企業名 - HERP Hire」形式) */
function getCompanyFromTitle(doc: Document): string | null {
  const title = doc.title;
  const parts = title.split(" - ");
  if (parts.length >= 3) {
    return parts[parts.length - 2].trim();
  }
  return null;
}

/** ページタイトルから求人タイトルを取得 */
function getJobTitleFromPage(doc: Document): string | null {
  const title = doc.title;
  const parts = title.split(" - ");
  if (parts.length >= 2) {
    return parts[0].trim();
  }
  return null;
}

export function extractHerpAgent(doc: Document, url: string): JobPosting {
  return {
    source_ats: "HERP",

    // 基本情報
    position: null,
    job_title: getJobTitleFromPage(doc),
    employment_type: getRowValue(doc, "雇用形態"),
    salary: getRowValue(doc, "給与"),
    location: getRowValue(doc, "勤務地"),
    description: getRowValue(doc, "仕事概要"),
    qualifications: null,
    requirements: parseList(getRowValue(doc, "必須スキル")),
    preferred: parseList(getRowValue(doc, "歓迎スキル")),
    ideal_candidate: getRowValue(doc, "求める人物像"),
    benefits: parseList(getRowValue(doc, "福利厚生")),
    job_details: null,
    work_schedule: getRowValue(doc, "勤務体系"),
    probation: getRowValue(doc, "試用期間"),
    other: getRowValue(doc, "その他"),

    // エージェント用追記事項
    agent_info: null,
    recruitment_background: getRowValue(doc, "募集背景"),
    target: getRowValue(doc, "ターゲット"),
    headcount: getRowValue(doc, "採用人数"),
    selection_process: getRowValue(doc, "選考フロー"),
    recruitment_period: getRowValue(doc, "募集期間"),
    compensation: getRowValue(doc, "待遇"),
    priority: getRowValue(doc, "優先度"),

    // 企業情報
    company: getCompanyFromTitle(doc),
    representative: null,
    founded: getRowValue(doc, "設立年月"),
    business: getRowValue(doc, "事業内容"),
    clients: null,
    capital: getRowValue(doc, "資本金"),
    address: getRowValue(doc, "本社所在地"),
    branch_address: getRowValue(doc, "支社所在地"),
    employees: getRowValue(doc, "従業員数"),
    group_companies: null,
    company_url: getRowValue(doc, "企業サイトURL"),
    company_details: null,

    source_url: url,
    extracted_at: new Date().toISOString(),
  };
}
