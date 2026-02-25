import { describe, expect, it } from "vitest";
import { detectAgent } from "./detector";

describe("detectAgent", () => {
  it("detects each supported ATS URL", () => {
    expect(
      detectAgent("https://hrmos.co/agent/corporates/acme/jobs/123/detail"),
    ).toBe("HRMOS");
    expect(
      detectAgent("https://agent.herp.cloud/p/acme/requisitions/id/abc"),
    ).toBe("HERP");
    expect(
      detectAgent(
        "https://agent.talentio.com/r/ats/requisitions/abc/candidates/new",
      ),
    ).toBe("TALENTIO");
  });

  it("returns null for unsupported or invalid URL", () => {
    expect(detectAgent("https://example.com/jobs/1")).toBeNull();
    expect(detectAgent("not a url")).toBeNull();
  });
});
