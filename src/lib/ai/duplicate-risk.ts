export type DuplicateRisk = "none" | "low" | "medium" | "high";

export type DuplicateCheckResult = {
  duplicateRisk: DuplicateRisk;
  duplicateWarning: string | null;
  topSimilarity: number | null;
};

type SimilarityCandidate = {
  similarity: number;
};

export function evaluateDuplicateRisk(
  similarPosts: readonly SimilarityCandidate[],
): DuplicateCheckResult {
  const topSimilarity = similarPosts[0]?.similarity ?? null;

  if (topSimilarity === null) {
    return {
      duplicateRisk: "none",
      duplicateWarning: null,
      topSimilarity,
    };
  }

  if (topSimilarity >= 0.86) {
    return {
      duplicateRisk: "high",
      duplicateWarning:
        "작성 중인 글과 매우 가까운 기존 게시글이 있습니다. 새 글로 등록하기 전에 이미 같은 내용이 논의됐는지 확인해보세요.",
      topSimilarity,
    };
  }

  if (topSimilarity >= 0.78) {
    return {
      duplicateRisk: "medium",
      duplicateWarning:
        "비슷한 주제의 게시글이 있습니다. 기존 글과 관점이나 정보가 어떻게 다른지 확인한 뒤 등록하는 것을 권장합니다.",
      topSimilarity,
    };
  }

  if (topSimilarity >= 0.68) {
    return {
      duplicateRisk: "low",
      duplicateWarning:
        "일부 내용이 비슷한 게시글이 있습니다. 참고하면 글의 방향을 더 분명히 잡을 수 있습니다.",
      topSimilarity,
    };
  }

  return {
    duplicateRisk: "none",
    duplicateWarning: null,
    topSimilarity,
  };
}
