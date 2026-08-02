import { describe, expect, it } from "vitest";

import { runRuleBasedModeration } from "../src/lib/ai/moderation-rules";

describe("runRuleBasedModeration", () => {
  it.each([
    ["오늘 선발투수 제구가 정말 좋았습니다.", "allow", "safe"],
    ["시발 오늘 수비는 너무 아쉽다.", "warn", "caution"],
    ["감독은 진짜 쓰레기니까 당장 꺼져.", "block", "unsafe"],
    ["연락처는 010-1234-5678 입니다.", "block", "unsafe"],
    ["팬들의 응원이 오늘 정말 죽여줬다.", "allow", "safe"],
    ["상대 팀 팬들을 찾아가 모두 죽여버리겠다.", "block", "unsafe"],
    [
      "자료는 https://a.test https://b.test https://c.test 에 있습니다.",
      "warn",
      "caution",
    ],
    ["ㅋㅋㅋㅋㅋㅋㅋㅋㅋ", "warn", "caution"],
  ] as const)("classifies policy fixture %#", (content, verdict, severity) => {
    const result = runRuleBasedModeration({ targetType: "comment", content });

    expect(result.verdict).toBe(verdict);
    expect(result.severity).toBe(severity);
    expect(result.modelUsed).toBe(false);
    expect(result.toolTrace).toHaveLength(4);
  });

  it("reports privacy as the blocking reason", () => {
    const result = runRuleBasedModeration({
      targetType: "post",
      title: "연락처 공유",
      content: "문의는 fan@example.com 으로 보내주세요.",
    });

    expect(result.verdict).toBe("block");
    expect(result.categories).toContain("privacy");
    expect(result.reasons[0]).toContain("개인정보");
  });

  it("reports a violent threat as a targeted attack", () => {
    const result = runRuleBasedModeration({
      targetType: "post",
      title: "원정 팬 위협",
      content: "상대 팀 팬들을 찾아가 모두 죽여버리겠다.",
    });

    expect(result.verdict).toBe("block");
    expect(result.categories).toContain("targeted_attack");
    expect(result.reasons[0]).toContain("위협");
  });
});
