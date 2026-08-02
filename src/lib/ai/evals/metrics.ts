export type RetrievalEvalCase = {
  expectedIds: readonly string[];
  retrievedIds: readonly string[];
};

export type RetrievalMetrics = {
  caseCount: number;
  recallAtK: number;
  meanReciprocalRank: number;
};

export type BinaryClassificationCase = {
  expected: boolean;
  actual: boolean;
};

export type BinaryClassificationMetrics = {
  caseCount: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
};

function divide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function calculateExactMatchAccuracy<T>(
  expected: readonly T[],
  actual: readonly T[],
): number {
  if (expected.length === 0 || expected.length !== actual.length) {
    return 0;
  }

  const matches = expected.reduce(
    (total, value, index) => total + Number(value === actual[index]),
    0,
  );

  return matches / expected.length;
}

export function calculateRetrievalMetrics(
  cases: readonly RetrievalEvalCase[],
  k: number,
): RetrievalMetrics {
  if (cases.length === 0 || k <= 0) {
    return { caseCount: cases.length, recallAtK: 0, meanReciprocalRank: 0 };
  }

  let recallTotal = 0;
  let reciprocalRankTotal = 0;

  for (const item of cases) {
    const expected = new Set(item.expectedIds);
    const retrieved = item.retrievedIds.slice(0, k);
    const relevantCount = new Set(
      retrieved.filter((id) => expected.has(id)),
    ).size;
    const firstRelevantIndex = retrieved.findIndex((id) => expected.has(id));

    recallTotal += divide(relevantCount, expected.size);
    reciprocalRankTotal +=
      firstRelevantIndex === -1 ? 0 : 1 / (firstRelevantIndex + 1);
  }

  return {
    caseCount: cases.length,
    recallAtK: recallTotal / cases.length,
    meanReciprocalRank: reciprocalRankTotal / cases.length,
  };
}

export function calculateBinaryClassificationMetrics(
  cases: readonly BinaryClassificationCase[],
): BinaryClassificationMetrics {
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;
  let trueNegative = 0;

  for (const item of cases) {
    if (item.expected && item.actual) truePositive += 1;
    else if (!item.expected && item.actual) falsePositive += 1;
    else if (item.expected && !item.actual) falseNegative += 1;
    else trueNegative += 1;
  }

  const precision = divide(truePositive, truePositive + falsePositive);
  const recall = divide(truePositive, truePositive + falseNegative);

  return {
    caseCount: cases.length,
    accuracy: divide(truePositive + trueNegative, cases.length),
    precision,
    recall,
    f1: divide(2 * precision * recall, precision + recall),
    truePositive,
    falsePositive,
    falseNegative,
    trueNegative,
  };
}
