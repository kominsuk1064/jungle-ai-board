import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluateDuplicateRisk,
  type DuplicateRisk,
} from "../src/lib/ai/duplicate-risk";
import {
  calculateBinaryClassificationMetrics,
  calculateExactMatchAccuracy,
} from "../src/lib/ai/evals/metrics";
import {
  runRuleBasedModeration,
  type ModerationTargetType,
  type ModerationVerdict,
} from "../src/lib/ai/moderation-rules";

type DuplicateFixture = {
  id: string;
  similarities: number[];
  expectedRisk: DuplicateRisk;
};

type ModerationFixture = {
  id: string;
  targetType: ModerationTargetType;
  title?: string;
  content: string;
  expectedVerdict: ModerationVerdict;
};

const EVAL_ROOT = dirname(fileURLToPath(import.meta.url));
const BLOCKING_DUPLICATE_RISKS = new Set<DuplicateRisk>(["medium", "high"]);

async function readJsonLines<T>(fileName: string): Promise<T[]> {
  const source = await readFile(resolve(EVAL_ROOT, "datasets", fileName), "utf8");

  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

async function evaluateDuplicatePolicy() {
  const fixtures = await readJsonLines<DuplicateFixture>("duplicate-risk.jsonl");
  const actual = fixtures.map((fixture) =>
    evaluateDuplicateRisk(
      fixture.similarities.map((similarity) => ({ similarity })),
    ).duplicateRisk,
  );
  const expected = fixtures.map((fixture) => fixture.expectedRisk);
  const blockingMetrics = calculateBinaryClassificationMetrics(
    fixtures.map((fixture, index) => ({
      expected: BLOCKING_DUPLICATE_RISKS.has(fixture.expectedRisk),
      actual: BLOCKING_DUPLICATE_RISKS.has(actual[index]),
    })),
  );

  return {
    fixtureCount: fixtures.length,
    exactMatchAccuracy: round(calculateExactMatchAccuracy(expected, actual)),
    blockingPrecision: round(blockingMetrics.precision),
    blockingRecall: round(blockingMetrics.recall),
    blockingF1: round(blockingMetrics.f1),
    failures: fixtures
      .map((fixture, index) => ({
        id: fixture.id,
        expected: fixture.expectedRisk,
        actual: actual[index],
      }))
      .filter((failure) => failure.expected !== failure.actual),
  };
}

async function evaluateModerationPolicy() {
  const fixtures = await readJsonLines<ModerationFixture>("moderation.jsonl");
  const actual = fixtures.map(
    (fixture) =>
      runRuleBasedModeration({
        targetType: fixture.targetType,
        title: fixture.title,
        content: fixture.content,
      }).verdict,
  );
  const expected = fixtures.map((fixture) => fixture.expectedVerdict);
  const blockingMetrics = calculateBinaryClassificationMetrics(
    fixtures.map((fixture, index) => ({
      expected: fixture.expectedVerdict === "block",
      actual: actual[index] === "block",
    })),
  );

  return {
    fixtureCount: fixtures.length,
    exactMatchAccuracy: round(calculateExactMatchAccuracy(expected, actual)),
    blockingPrecision: round(blockingMetrics.precision),
    blockingRecall: round(blockingMetrics.recall),
    blockingF1: round(blockingMetrics.f1),
    failures: fixtures
      .map((fixture, index) => ({
        id: fixture.id,
        expected: fixture.expectedVerdict,
        actual: actual[index],
      }))
      .filter((failure) => failure.expected !== failure.actual),
  };
}

async function main(): Promise<void> {
  const duplicatePolicy = await evaluateDuplicatePolicy();
  const moderationPolicy = await evaluateModerationPolicy();
  const report = {
    generatedAt: new Date().toISOString(),
    mode: "offline-deterministic",
    duplicatePolicy,
    moderationPolicy,
  };

  console.log(JSON.stringify(report, null, 2));

  const passed =
    duplicatePolicy.exactMatchAccuracy === 1 &&
    moderationPolicy.exactMatchAccuracy === 1;

  if (!passed) {
    console.error("Offline AI eval did not meet the required baseline.");
    process.exitCode = 1;
  }
}

void main().catch((error: unknown) => {
  console.error("Offline AI eval failed to run.", error);
  process.exitCode = 1;
});
