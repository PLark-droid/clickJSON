export interface JobPosting {
  // 求人情報
  position: string | null;
  job_title: string | null;
  employment_type: string | null;
  salary: string | null;
  location: string | null;
  qualifications: string | null;
  requirements: string[] | null;
  preferred: string[] | null;
  benefits: string[] | null;
  job_details: string | null;
  agent_info: string | null;

  // 企業情報
  company: string | null;
  representative: string | null;
  founded: string | null;
  business: string | null;
  clients: string | null;
  capital: string | null;
  address: string | null;
  group_companies: string | null;
  company_details: string | null;

  // メタ情報
  source_url: string;
  extracted_at: string;
}
