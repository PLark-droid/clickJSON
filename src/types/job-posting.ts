export interface JobPosting {
  source_ats: "HRMOS" | "HERP";

  // 求人情報
  position: string | null;
  job_title: string | null;
  employment_type: string | null;
  salary: string | null;
  location: string | null;
  description: string | null;
  qualifications: string | null;
  requirements: string[] | null;
  preferred: string[] | null;
  ideal_candidate: string | null;
  benefits: string[] | null;
  job_details: string | null;
  work_schedule: string | null;
  probation: string | null;
  other: string | null;

  // エージェント向け情報
  agent_info: string | null;
  recruitment_background: string | null;
  target: string | null;
  headcount: string | null;
  selection_process: string | null;
  recruitment_period: string | null;
  compensation: string | null;
  priority: string | null;

  // 企業情報
  company: string | null;
  representative: string | null;
  founded: string | null;
  business: string | null;
  clients: string | null;
  capital: string | null;
  address: string | null;
  branch_address: string | null;
  employees: string | null;
  group_companies: string | null;
  company_url: string | null;
  company_details: string | null;

  // メタ情報
  source_url: string;
  extracted_at: string;
}
