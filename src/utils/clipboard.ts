import type { JobPosting } from "@/types/job-posting";

export async function copyToClipboard(posting: JobPosting): Promise<void> {
  const json = JSON.stringify(posting, null, 2);
  await navigator.clipboard.writeText(json);
}
