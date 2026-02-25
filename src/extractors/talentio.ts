import type { JobPosting } from "@/types/job-posting";
import { parseList } from "./common";

function normalizeLabel(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[：:]/g, "")
    .replace(/\s+/g, "")
    .trim()
    .replace(/等$/, "");
}

function getFieldValueElement(doc: Document, label: string): Element | null {
  const normalizedLabel = normalizeLabel(label);
  const items = doc.querySelectorAll(".requisition-details__items-item");
  for (const item of items) {
    const title = item.querySelector(".requisition-details__items-item-title");
    if (!title?.textContent) continue;
    if (normalizeLabel(title.textContent) === normalizedLabel) {
      return item.querySelector(".requisition-details__items-item-value");
    }
  }
  return null;
}

/** Talentio の div ベースフィールドからラベルに一致する値を取得 */
function getFieldValue(doc: Document, label: string): string | null {
  return getFieldValueElement(doc, label)?.textContent?.trim() || null;
}

function getListFieldValue(doc: Document, label: string): string[] | null {
  const valueElement = getFieldValueElement(doc, label);
  if (!valueElement) return null;

  const items = Array.from(valueElement.querySelectorAll("li"))
    .map((item) => item.textContent?.trim() || "")
    .filter(Boolean);

  if (items.length) {
    return items;
  }

  return parseList(valueElement.textContent?.trim() || null);
}

export function extractTalentioAgent(
  doc: Document,
  url: string,
): JobPosting {
  return {
    source_ats: "TALENTIO",

    // ヘッダー情報
    company: doc.querySelector(".requisition-details__company-name")?.textContent?.trim() || null,
    job_title: doc.querySelector(".requisition-details__requisition-name")?.textContent?.trim() || null,
    position: doc.querySelector(".requisition-details__job-title-name")?.textContent?.trim() || null,

    // 求人情報
    business: getFieldValue(doc, "事業内容"),
    recruitment_background: getFieldValue(doc, "募集背景"),
    department: getFieldValue(doc, "配属部署"),
    description: getFieldValue(doc, "仕事内容"),
    career_path: getFieldValue(doc, "将来のキャリアパス"),
    onboarding: getFieldValue(doc, "入社後の流れ"),
    requirements: getListFieldValue(doc, "必須条件"),
    preferred: getListFieldValue(doc, "歓迎条件"),
    work_environment: getFieldValue(doc, "その他環境"),
    ideal_candidate: getFieldValue(doc, "求める人物像等"),
    employment_type: getFieldValue(doc, "雇用形態"),
    contract_period: getFieldValue(doc, "契約期間"),
    salary: getFieldValue(doc, "給与"),
    probation: getFieldValue(doc, "試用期間"),
    allowances: getFieldValue(doc, "諸手当"),
    compensation: getFieldValue(doc, "想定年収"),
    raise_bonus: getFieldValue(doc, "昇給・賞与"),
    work_schedule: getFieldValue(doc, "勤務時間"),
    overtime: getFieldValue(doc, "残業"),
    location: getFieldValue(doc, "勤務場所"),
    holidays: getFieldValue(doc, "休日"),
    vacation: getFieldValue(doc, "休暇"),
    benefits: getListFieldValue(doc, "福利厚生"),
    insurance: getFieldValue(doc, "社会保険"),
    smoking_policy: getFieldValue(doc, "受動喫煙防止措置"),
    selection_process: getFieldValue(doc, "選考フロー"),
    work_style: getFieldValue(doc, "勤務状況"),
    other: getFieldValue(doc, "補足"),

    // エージェント向け情報
    target: getFieldValue(doc, "ペルソナ"),
    target_companies: getFieldValue(doc, "経験企業"),
    agent_info: getFieldValue(doc, "補足情報"),
    contact: getFieldValue(doc, "担当者連絡先"),

    // Talentio に該当なし
    qualifications: null,
    job_details: null,
    headcount: null,
    recruitment_period: null,
    priority: null,
    representative: null,
    founded: null,
    clients: null,
    capital: null,
    address: null,
    branch_address: null,
    employees: null,
    group_companies: null,
    company_url: null,
    company_details: null,

    source_url: url,
    extracted_at: new Date().toISOString(),
  };
}
