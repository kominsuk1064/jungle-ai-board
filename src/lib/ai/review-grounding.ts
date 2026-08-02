import type {
  KboGame,
  KboGameStatus,
} from "@/lib/mcp/baseball-briefing-tools";

export type ReviewDraftMode = "postgame" | "live" | "preview";

export function isFinalKboGameStatus(status: KboGameStatus): boolean {
  return status === "completed" || status === "draw";
}

export function getReviewDraftMode(game: KboGame): ReviewDraftMode {
  if (game.status === "scheduled") {
    return "preview";
  }

  return isFinalKboGameStatus(game.status) ? "postgame" : "live";
}

function getStadiumSuffix(game: KboGame): string {
  return game.stadium ? `, ${game.stadium}` : "";
}

function getLiveStateLabel(game: KboGame): string {
  const inning = game.liveState?.inning;
  const inningHalf = game.liveState?.inningHalf.trim() ?? "";

  if (inning && inningHalf) {
    return `${inning}회 ${inningHalf}`;
  }

  return inning ? `${inning}회` : inningHalf || "현재";
}

export function formatReviewGameSummary(game: KboGame): string {
  const stadium = getStadiumSuffix(game);

  if (game.status === "scheduled") {
    return `${game.gameDate} ${game.awayTeam} vs ${game.homeTeam}${stadium}, 경기 전`;
  }

  const score =
    game.awayScore === null || game.homeScore === null
      ? `${game.awayTeam} vs ${game.homeTeam}, 스코어 미정`
      : `${game.awayTeam} ${game.awayScore} : ${game.homeScore} ${game.homeTeam}`;

  if (game.status === "live") {
    return `${game.gameDate} 현재 ${score}${stadium}, ${getLiveStateLabel(game)} 진행 중`;
  }

  const resultLabel = game.status === "draw" ? "경기 종료(무승부)" : "경기 종료";

  return `${game.gameDate} ${score}${stadium}, ${resultLabel}`;
}

export function getReviewTitle(game: KboGame): string {
  const suffix =
    getReviewDraftMode(game) === "postgame"
      ? "리뷰"
      : game.status === "live"
        ? "관전 메모"
        : "프리뷰";

  return `${game.gameDate} ${game.awayTeam} vs ${game.homeTeam} ${suffix}`;
}

export function getReviewStatusNotice(game: KboGame): string {
  if (game.status === "live") {
    return "아직 경기가 진행 중이므로 현재 스코어와 확인된 장면만 정리하며, 최종 승패와 종료 기록은 확정하지 않습니다.";
  }

  if (game.status === "scheduled") {
    return "아직 경기 전이므로 예상이나 관전 포인트만 정리하며, 실제 경기 결과와 선수 기록은 단정하지 않습니다.";
  }

  return "";
}
