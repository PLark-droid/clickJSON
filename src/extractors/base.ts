import type { JobPosting } from "@/types/job-posting";
import type { AtsType } from "@/utils/detector";
import { extractHrmos } from "./hrmos";
import { extractHerp } from "./herp";

export interface Extractor {
  extract(doc: Document, url: string): JobPosting;
}

export function getExtractor(ats: NonNullable<AtsType>): Extractor {
  switch (ats) {
    case "HRMOS":
      return { extract: extractHrmos };
    case "HERP":
      return { extract: extractHerp };
    default:
      throw new Error(`Unsupported ATS: ${ats}`);
  }
}
