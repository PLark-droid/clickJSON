import type { JobPosting } from "@/types/job-posting";
import { getRowValue, parseList } from "./common";

/** フリーテキストセクション（span.q-ml-sm.q-my-xs）からラベルに一致する値を取得 */
function getSectionValue(doc: Document, label: string): string | null {
  const spans = doc.querySelectorAll("span.q-ml-sm.q-my-xs");
  for (const span of spans) {
    if (span.textContent?.trim() === label) {
      const row = span.closest(".row");
      let current = row?.nextElementSibling || null;
      for (let i = 0; current && i < 4; i += 1) {
        if (current.matches(".row") && current.querySelector("span.q-ml-sm.q-my-xs")) {
          return null;
        }
        const text = current.textContent?.trim();
        if (text) {
          return text;
        }
        current = current.nextElementSibling;
      }
      return null;
    }
  }
  return null;
}

export function extractPersonaAgent(
  doc: Document,
  url: string,
): JobPosting {
  if (!doc.querySelector(".slide_2_header") || !doc.querySelector("table.q-table")) {
    throw new Error("PERSONA求人詳細ページを判別できませんでした");
  }

  return {
    source_ats: "PERSONA",

    // ヘッダー情報
    job_title:
      doc.querySelector(".slide_2_header .q-my-auto")?.textContent?.trim() ||
      null,
    position: null,

    // フリーテキストセクション
    description: getSectionValue(doc, "業務内容"),
    qualifications: getSectionValue(doc, "募集要項"),
    faq: getSectionValue(doc, "よくあるご質問"),
    other: getSectionValue(doc, "備考"),

    // テーブル1: 求人条件
    employment_type: getRowValue(doc, "雇用形態"),
    probation: getRowValue(doc, "試用期間"),
    salary: getRowValue(doc, "給与"),
    location: getRowValue(doc, "勤務地"),
    work_schedule: getRowValue(doc, "勤務時間"),
    holidays: getRowValue(doc, "休日"),
    benefits: parseList(getRowValue(doc, "福利厚生")),
    insurance: getRowValue(doc, "加入保険"),
    smoking_policy: getRowValue(doc, "受動喫煙対策"),
    scope_change_work: getRowValue(doc, "業務内容の変更の範囲"),
    scope_change_location: getRowValue(doc, "就業場所の変更の範囲"),
    contract_period: getRowValue(doc, "労働契約の期間に関する事項"),

    // テーブル2: 企業情報
    company: getRowValue(doc, "企業名"),
    founded: getRowValue(doc, "設立"),
    address: getRowValue(doc, "本社所在地"),
    capital: getRowValue(doc, "資本金"),
    employees: getRowValue(doc, "従業員数"),
    business: getRowValue(doc, "事業概要"),
    company_url: getRowValue(doc, "企業ホームページ"),
    reference_url: getRowValue(doc, "参考URL"),

    // PERSONA に該当なし
    requirements: null,
    preferred: null,
    ideal_candidate: null,
    job_details: null,
    department: null,
    career_path: null,
    onboarding: null,
    work_environment: null,
    allowances: null,
    raise_bonus: null,
    overtime: null,
    vacation: null,
    work_style: null,
    compensation: null,
    agent_info: null,
    recruitment_background: null,
    target: null,
    headcount: null,
    selection_process: null,
    recruitment_period: null,
    priority: null,
    target_companies: null,
    contact: null,
    representative: null,
    clients: null,
    branch_address: null,
    group_companies: null,
    company_details: null,

    source_url: url,
    extracted_at: new Date().toISOString(),
  };
}
