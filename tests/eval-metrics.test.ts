import { describe, expect, it } from "vitest";

import {
  calculateBinaryClassificationMetrics,
  calculateExactMatchAccuracy,
  calculateRetrievalMetrics,
} from "../src/lib/ai/evals/metrics";

describe("AI eval metrics", () => {
  it("calculates Recall@K and mean reciprocal rank", () => {
    const result = calculateRetrievalMetrics(
      [
        { expectedIds: ["a"], retrievedIds: ["b", "a", "c"] },
        { expectedIds: ["x", "y"], retrievedIds: ["x", "z", "q"] },
      ],
      3,
    );

    expect(result).toEqual({
      caseCount: 2,
      recallAtK: 0.75,
      meanReciprocalRank: 0.75,
    });
  });

  it("does not overcount duplicate retrieval results", () => {
    const result = calculateRetrievalMetrics(
      [
        {
          expectedIds: ["a"],
          retrievedIds: ["a", "a", "unrelated"],
        },
      ],
      3,
    );

    expect(result.recallAtK).toBe(1);
  });

  it("calculates binary precision, recall, F1, and accuracy", () => {
    const result = calculateBinaryClassificationMetrics([
      { expected: true, actual: true },
      { expected: false, actual: true },
      { expected: true, actual: false },
      { expected: false, actual: false },
    ]);

    expect(result).toEqual({
      caseCount: 4,
      accuracy: 0.5,
      precision: 0.5,
      recall: 0.5,
      f1: 0.5,
      truePositive: 1,
      falsePositive: 1,
      falseNegative: 1,
      trueNegative: 1,
    });
  });

  it("returns zero metrics for an empty dataset", () => {
    expect(calculateBinaryClassificationMetrics([])).toEqual({
      caseCount: 0,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1: 0,
      truePositive: 0,
      falsePositive: 0,
      falseNegative: 0,
      trueNegative: 0,
    });
  });

  it("calculates exact-match accuracy", () => {
    expect(calculateExactMatchAccuracy(["a", "b", "c"], ["a", "x", "c"])).toBe(
      2 / 3,
    );
  });
});
