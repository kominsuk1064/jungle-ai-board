import { describe, expect, it } from "vitest";

import { evaluateDuplicateRisk } from "../src/lib/ai/duplicate-risk";

describe("evaluateDuplicateRisk", () => {
  it.each([
    [[], "none", null],
    [[{ similarity: 0.67 }], "none", 0.67],
    [[{ similarity: 0.68 }], "low", 0.68],
    [[{ similarity: 0.779 }], "low", 0.779],
    [[{ similarity: 0.78 }], "medium", 0.78],
    [[{ similarity: 0.859 }], "medium", 0.859],
    [[{ similarity: 0.86 }], "high", 0.86],
  ] as const)(
    "classifies %j as %s",
    (similarPosts, expectedRisk, expectedSimilarity) => {
      const result = evaluateDuplicateRisk(similarPosts);

      expect(result.duplicateRisk).toBe(expectedRisk);
      expect(result.topSimilarity).toBe(expectedSimilarity);
      expect(Boolean(result.duplicateWarning)).toBe(expectedRisk !== "none");
    },
  );

  it("uses the highest-ranked candidate only", () => {
    const result = evaluateDuplicateRisk([
      { similarity: 0.81 },
      { similarity: 0.99 },
    ]);

    expect(result.duplicateRisk).toBe("medium");
    expect(result.topSimilarity).toBe(0.81);
  });
});
