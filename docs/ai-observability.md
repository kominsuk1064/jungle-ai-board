# AI Runtime Observability

KBO Talk의 AI API가 배포 환경에서 실제로 동작하는지 확인하기 위한 최소 관측성 기준입니다. 모든 `/api/ai/*` 요청을 같은 이벤트 스키마로 기록해 기능별 오류율과 지연 시간을 비교할 수 있게 했습니다.

## 적용 범위

| Feature | API |
| --- | --- |
| `agent.moderation` | 게시글·댓글 모더레이션 |
| `agent.review-assistant` | 경기 리뷰 초안 생성 |
| `agent.board-assistant` | 게시판 도우미 |
| `rag.similar-posts` | 게시글 기준 유사 글 검색 |
| `rag.draft-similar-posts` | 작성 중인 글의 중복 위험 확인 |
| `rag.related-post-summary` | 경기·팀 관련 글 요약 |
| `mcp.briefing` | 뉴스·URL 브리핑 |
| `mcp.kbo-games` | KBO 경기 도구 호출 |
| `mcp.kbo-game-record` | KBO 공식 기록 도구 호출 |
| `prediction.game` | 경기 전망 생성 |

## 이벤트 스키마

완료된 요청은 한 줄의 JSON으로 기록합니다.

```json
{
  "schemaVersion": 1,
  "event": "ai.operation.completed",
  "timestamp": "2026-08-02T00:00:00.000Z",
  "traceId": "8b6c92b5-61f4-4e98-b88e-2f2c18a91d38",
  "feature": "agent.moderation",
  "method": "POST",
  "outcome": "success",
  "httpStatus": 200,
  "durationMs": 184
}
```

`outcome`은 다음 네 값 중 하나입니다.

| Outcome | 기준 |
| --- | --- |
| `success` | HTTP 400 미만 |
| `client_error` | HTTP 400~499 |
| `server_error` | HTTP 500 이상 |
| `exception` | 응답 생성 전에 처리되지 않은 예외 발생 |

예외 이벤트에는 메시지 대신 `TypeError` 같은 `errorType`만 기록합니다.

## 응답 상관관계

모든 AI API 응답에 다음 헤더를 추가합니다.

- `x-ai-trace-id`: 사용자가 전달한 장애 시점과 서버 로그를 연결하는 식별자
- `server-timing`: 브라우저 개발자 도구에서 확인할 수 있는 전체 AI API 처리 시간

기존 `Server-Timing` 값이 있으면 덮어쓰지 않고 `ai;dur=<milliseconds>`를 뒤에 추가합니다.

## 개인정보 보호

텔레메트리에는 다음 데이터를 기록하지 않습니다.

- 질문, 프롬프트, 게시글 제목·본문, 댓글
- URL과 검색어
- 사용자 ID, 이메일, 인증 토큰
- 예외 메시지와 외부 API 원문

기능명, HTTP 메서드, 상태 코드, 지연 시간, 무작위 trace ID만 남깁니다. 이 기준은 로그가 운영 외부 도구로 전달되더라도 사용자 입력이 그대로 확산되지 않게 하기 위한 것입니다.

## 운영 지표

구조화 로그에서 다음 지표를 만들 수 있습니다.

1. 기능별 성공률
   - `success / 전체 요청`
2. 기능별 서버 오류율
   - `(server_error + exception) / 전체 요청`
3. 기능별 p50·p95 지연 시간
   - `durationMs` 분포
4. 입력 오류 비율
   - `client_error / 전체 요청`

초기 알림 기준 예시는 다음과 같습니다.

- 최근 5분 서버 오류율이 5% 초과
- 기능별 p95 지연 시간이 평시 기준의 2배 초과
- 특정 기능에서 `exception`이 연속 3회 발생

## 구현 파일

```text
src/lib/ai/telemetry.ts
tests/telemetry.test.ts
src/app/api/ai/**/route.ts
```

## 현재 한계와 다음 단계

현재 구현은 배포 플랫폼의 구조화 로그를 이용하는 기준선입니다. 별도 DB에 로그를 장기 보관하거나 대시보드·알림 시스템과 연결하지는 않았습니다.

다음 단계에서는 OpenTelemetry 기반 trace export, 모델명·토큰 사용량·fallback 여부처럼 원문을 포함하지 않는 AI 메타데이터, 기능별 SLO 대시보드를 추가합니다.
