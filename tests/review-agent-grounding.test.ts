import { describe, expect, it } from "vitest";

import {
  formatReviewGameSummary,
  getReviewDraftMode,
  getReviewStatusNotice,
  getReviewTitle,
  isFinalKboGameStatus,
} from "../src/lib/ai/review-grounding";
import type { KboGame } from "../src/lib/mcp/baseball-briefing-tools";

function createGame(overrides: Partial<KboGame> = {}): KboGame {
  return {
    gameDate: "2026-08-02",
    displayDate: "08.02",
    time: "14:00",
    awayTeam: "SSG",
    homeTeam: "키움",
    awayScore: 1,
    homeScore: 3,
    status: "live",
    stadium: "고척",
    tv: "M-T",
    note: "",
    gameId: "20260802SKWO0",
    awayStartingPitcher: null,
    homeStartingPitcher: null,
    winningPitcher: null,
    losingPitcher: null,
    savePitcher: null,
    liveState: {
      inning: 4,
      inningHalf: "초",
      balls: 0,
      strikes: 0,
      outs: 0,
      firstBaseOccupied: false,
      secondBaseOccupied: false,
      thirdBaseOccupied: false,
      awayCurrentPlayer: null,
      homeCurrentPlayer: null,
    },
    reviewUrl: null,
    highlightUrl: null,
    ...overrides,
  };
}

describe("review grounding", () => {
  it("keeps a live game as a current-state memo", () => {
    const game = createGame();

    expect(isFinalKboGameStatus(game.status)).toBe(false);
    expect(getReviewDraftMode(game)).toBe("live");
    expect(getReviewTitle(game)).toBe(
      "2026-08-02 SSG vs 키움 관전 메모",
    );
    expect(formatReviewGameSummary(game)).toContain("4회 초 진행 중");
    expect(getReviewStatusNotice(game)).toContain("최종 승패");
  });

  it("labels a scheduled game as a preview without a score", () => {
    const game = createGame({
      awayScore: null,
      homeScore: null,
      status: "scheduled",
      liveState: null,
    });

    expect(getReviewDraftMode(game)).toBe("preview");
    expect(getReviewTitle(game)).toBe("2026-08-02 SSG vs 키움 프리뷰");
    expect(formatReviewGameSummary(game)).toBe(
      "2026-08-02 SSG vs 키움, 고척, 경기 전",
    );
    expect(getReviewStatusNotice(game)).toContain("실제 경기 결과");
  });

  it("allows postgame language only for final statuses", () => {
    const completed = createGame({ status: "completed", liveState: null });
    const draw = createGame({ status: "draw", liveState: null });

    expect(isFinalKboGameStatus(completed.status)).toBe(true);
    expect(isFinalKboGameStatus(draw.status)).toBe(true);
    expect(getReviewDraftMode(completed)).toBe("postgame");
    expect(getReviewTitle(completed)).toBe(
      "2026-08-02 SSG vs 키움 리뷰",
    );
    expect(formatReviewGameSummary(completed)).toContain("경기 종료");
    expect(formatReviewGameSummary(draw)).toContain("무승부");
  });
});
