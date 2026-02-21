export interface JobPosting {
  title: string | null;
  company: string | null;
  location: string | null;
  employment_type: string | null;
  salary: string | null;
  description: string | null;
  requirements: string[] | null;
  preferred: string[] | null;
  benefits: string[] | null;
  source_ats: "HRMOS" | "HERP";
  source_url: string;
  extracted_at: string;
}
