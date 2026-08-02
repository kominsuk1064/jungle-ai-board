<div align="center">
  <h1>KBO Talk</h1>
  <p><strong>KBO 경기 데이터와 팬 커뮤니티에 RAG·AI Agent를 연결한 풀스택 AI 애플리케이션</strong></p>
  <p>
    경기 전 정보 탐색부터 경기 중 중계, 경기 후 기록 확인과 팬 커뮤니티 참여까지<br />
    하나의 흐름으로 연결하고, 필요한 순간에 AI가 자연스럽게 개입하도록 설계했습니다.
  </p>
  <p>
    <a href="https://jungle-ai-board.vercel.app"><strong>Web Demo</strong></a>
    ·
    <a href="https://jungle-ai-board.vercel.app/mobile-app"><strong>Mobile App</strong></a>
    ·
    <a href="https://jungle-ai-board.vercel.app/portfolio/kbo-app"><strong>Case Study</strong></a>
    ·
    <a href="https://github.com/kominsuk1064/jungle-ai-board/releases/tag/v0.1.0"><strong>Android APK</strong></a>
  </p>
</div>

<p align="center">
  <a href="https://github.com/kominsuk1064/jungle-ai-board/actions/workflows/ci.yml">
    <img alt="Quality CI" src="https://github.com/kominsuk1064/jungle-ai-board/actions/workflows/ci.yml/badge.svg?branch=kominsuk" />
  </a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img alt="TypeScript 5.9" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="PostgreSQL and pgvector" src="https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="OpenAI API" src="https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai&logoColor=white" />
  <img alt="Vitest 25 tests" src="https://img.shields.io/badge/Vitest-25_tests-6E9F18?style=flat-square&logo=vitest&logoColor=white" />
</p>

![KBO Talk 메인 페이지](docs/screenshots/baseball-ai-board-demo.png)

<p align="center"><sub>오늘의 경기, 팀·태그 필터, 게시판, 인기글, 야구 도우미를 한 화면에 구성한 데스크톱 메인</sub></p>

## 프로젝트 한눈에 보기

| 구분 | 내용 |
| --- | --- |
| 형태 | 기획부터 배포까지 직접 진행한 개인 풀스택 프로젝트 |
| 문제 | 경기 일정·기록·뉴스·팬 반응이 여러 화면에 흩어져 사용 흐름이 자주 끊기는 문제 |
| 해결 | 경기방을 중심으로 경기 전·중·후 정보와 커뮤니티 참여를 하나의 흐름으로 연결 |
| AI 활용 | 유사 글 검색, 중복 글 방지, 관련 글 요약, 리뷰 초안, 모더레이션, 게시판 도우미 |
| 운영 기반 | 오프라인 eval, 단위·라우트 통합 테스트, 구조화 텔레메트리, GitHub Actions CI |
| 배포 | Vercel, Supabase PostgreSQL + pgvector, Android WebView APK |

## 핵심 성과

| 주제 | 구현 결과 |
| --- | --- |
| 실제 사용 흐름 속 AI | 기술 데모를 별도 화면에 두지 않고 글쓰기·검색·경기방·운영 흐름에 AI 기능을 배치 |
| 품질 회귀 방지 | 중복 위험과 모더레이션 정책을 검증하는 19개 fixture 및 오프라인 eval 구축 |
| 자동 검증 | Vitest 6개 파일·31개 테스트와 audit → lint → typecheck → test → eval → build CI 구성 |
| 런타임 관측성 | 10개 AI API에 trace ID, 처리 시간, 결과 상태를 기록하는 공용 텔레메트리 적용 |
| 개인정보 보호 | 프롬프트·게시글·URL·사용자 식별자를 구조화 로그에서 제외 |
| 제품 완성도 | 반응형 웹, 모바일 앱형 화면, Android APK, 배포 및 데모 데이터까지 end-to-end 구현 |

## 해결하고 싶었던 문제

### 1. 흩어진 야구 정보를 경기 하나로 묶기

야구 팬은 경기 전에는 선발투수와 라인업을 보고, 경기 중에는 문자중계를 확인하고, 경기 후에는 박스스코어·뉴스·팬 반응을 찾아봅니다. KBO Talk는 이 정보를 <strong>경기방</strong>에 모아 화면을 계속 오가야 하는 불편을 줄였습니다.

### 2. 정보 확인을 커뮤니티 참여로 연결하기

경기와 기록을 확인한 뒤 흐름이 끝나지 않도록 관련 게시글, 리뷰 작성, 댓글 참여를 이어 붙였습니다. 뉴스 URL 브리핑과 경기 리뷰 초안도 게시글 작성으로 자연스럽게 연결됩니다.

### 3. AI 기능을 만들고 끝내지 않기

AI 기능은 결과가 매번 달라질 수 있고, 배포 후에는 오류 원인을 찾기 어렵습니다. 결정론적 정책은 오프라인 eval로 회귀를 막고, 모든 AI API에는 같은 텔레메트리 스키마를 적용해 오류율과 지연 시간을 비교할 수 있게 했습니다.

## 주요 기능

| 영역 | 기능 |
| --- | --- |
| 커뮤니티 | 회원가입·로그인, 게시글·댓글 CRUD, 태그, 검색, 페이지네이션, 추천·비추천, 인기글 |
| 경기방 | 일정·결과, 선발투수, 라인업, 문자중계, 박스스코어, 타자·투수 기록, 관련 글 |
| 기록·뉴스 | KBO 팀 순위, 선수 기록실, 야구 뉴스, 외부 URL 브리핑 |
| RAG | 유사 게시글 추천, 작성 중 중복 위험 안내, 경기·팀 관련 글 묶음 요약 |
| Agent | 경기 리뷰 초안, 게시글·댓글 모더레이션, 야구 게시판 도우미, 경기 전망 |
| 모바일 | 홈·경기·기록·뉴스·MY 탭, PWA 스타일 화면, Android WebView APK |

## 아키텍처

~~~mermaid
flowchart LR
    User["사용자"] --> UI["Next.js / React UI"]
    UI --> API["Next.js API Routes"]

    API --> Auth["JWT + HttpOnly Cookie"]
    API --> DB["PostgreSQL"]
    DB --> Vector["pgvector / PostEmbedding"]

    API --> AI["AI Application Layer"]
    AI --> RAG["RAG"]
    AI --> Agent["Agent"]
    AI --> Tools["JSON-RPC Tool Layer"]

    RAG --> Vector
    RAG --> OpenAI["OpenAI API"]
    Agent --> OpenAI
    Agent --> Tools
    Tools --> KBO["KBO 경기·기록 데이터"]
    Tools --> News["Google News RSS / 외부 URL"]

    API --> Telemetry["AI Telemetry"]
    Telemetry --> Logs["Structured Logs"]
~~~

### 요청 흐름

~~~text
사용자 요청
→ Next.js API Route
→ 공용 인증·텔레메트리 계층
→ PostgreSQL / RAG / Agent / JSON-RPC Tool
→ OpenAI·KBO·뉴스 데이터 호출
→ trace ID와 Server-Timing, 처리시간 보조 헤더를 포함한 응답
~~~

## AI 설계

### RAG: 게시판 데이터를 검색 가능한 지식으로

게시글의 제목·본문·태그를 임베딩해 PostgreSQL pgvector에 저장하고, 코사인 유사도 검색 결과를 LLM context로 전달합니다.

- 게시글 상세에서 유사 글과 유사도를 제공
- 작성 중인 글과 기존 글의 중복 위험을 <code>none</code>·<code>low</code>·<code>medium</code>·<code>high</code>로 분류
- 경기 또는 팀과 관련된 게시글을 모아 공통 의견과 쟁점을 요약
- 게시글 변경 시 content hash를 사용해 불필요한 임베딩 재생성 방지

주요 코드:

~~~text
src/lib/ai/rag.ts
src/lib/ai/duplicate-risk.ts
src/app/api/ai/rag/**
~~~

### JSON-RPC 도구 계층: 외부 데이터를 일관된 인터페이스로

MCP의 도구 호출 패턴을 참고해 JSON-RPC 2.0 기반 <code>tools/list</code>·<code>tools/call</code> 인터페이스를 구현했습니다. 외부 데이터를 라우트에 직접 결합하지 않고, Agent와 API가 같은 도구 계층을 재사용하도록 구성했습니다.

| Tool | 역할 |
| --- | --- |
| <code>get_kbo_games</code> | KBO 공식 경기 일정·결과 조회 |
| <code>brief_kbo_game_record</code> | 공식 스코어보드·박스스코어 기반 기록 브리핑 |
| <code>search_baseball_news</code> | 야구 뉴스 검색 |
| <code>brief_external_url</code> | 외부 URL 제목·설명·본문 일부 추출 |

외부 URL은 localhost, 사설 IP, local domain 접근을 차단해 SSRF 위험을 줄였습니다. <code>MCP_SHARED_SECRET</code>을 설정하면 직접 호출 시 공유 비밀도 검증합니다.

주요 코드:

~~~text
src/lib/mcp/json-rpc.ts
src/lib/mcp/baseball-briefing-tools.ts
src/app/api/mcp/baseball-briefing/route.ts
~~~

### Agent: 도구 선택과 실행 결과를 반영하는 작업 흐름

Agent는 목적에 맞는 도구를 선택하고 실행 결과를 다음 판단에 반영합니다.

- 경기 메모와 실제 기록을 결합한 리뷰 초안 생성
- 규칙 기반 판정을 우선하고 LLM을 보조로 사용하는 모더레이션
- 게시글·순위·기록·경기·뉴스를 탐색하는 야구 도우미
- 최대 반복 횟수 제한, 같은 도구의 반복 호출 방지, 도구 실패 fallback

주요 코드:

~~~text
src/lib/ai/review-agent.ts
src/lib/ai/moderation-agent.ts
src/lib/ai/board-assistant-agent.ts
src/lib/ai/game-prediction.ts
~~~

### Evals: 배포 전 품질 회귀 차단

외부 API와 데이터베이스가 없어도 반복 실행할 수 있는 결정론적 평가 기준을 만들었습니다.

| 평가 대상 | Fixture | 기준 |
| --- | ---: | --- |
| 중복 위험 정책 | 8개 | 위험 등급 exact match, 차단 여부 Precision·Recall·F1 |
| 모더레이션 정책 | 11개 | <code>allow</code>·<code>warn</code>·<code>block</code> exact match, 차단 여부 Precision·Recall·F1 |

현재 fixture 기준 exact-match accuracy와 blocking F1은 모두 <code>1.0</code>입니다. 이 값은 일반적인 모델 성능 점수가 아니라, 버전 관리되는 정책 회귀 기준선입니다.

평가 데이터와 확장 계획은 [evals/README.md](evals/README.md)에 정리했습니다.

### Observability: 배포 후 오류와 지연 추적

모든 <code>/api/ai/*</code> 라우트에 공용 텔레메트리 래퍼를 적용했습니다.

- 한 줄 JSON으로 기능명, HTTP 상태, 결과, 처리 시간을 기록
- 응답의 <code>x-ai-trace-id</code>로 장애 제보와 서버 로그를 연결
- <code>Server-Timing</code>으로 브라우저에서 AI API 지연 시간을 확인
- 프록시가 표준 헤더를 제거해도 <code>x-ai-duration-ms</code>로 같은 처리 시간을 확인
- 질문·프롬프트·게시글·URL·사용자 식별자는 기록하지 않음
- Agent, RAG, 도구 호출, 경기 전망을 같은 이벤트 스키마로 비교

이벤트 스키마와 운영 지표는 [AI Runtime Observability](docs/ai-observability.md)에 정리했습니다.

## 품질 검증

### CI 자동 검증

[Quality CI](https://github.com/kominsuk1064/jungle-ai-board/actions/workflows/ci.yml)는 push와 pull request마다 다음 순서로 실행됩니다.

~~~text
npm audit
→ ESLint
→ TypeScript typecheck
→ Vitest
→ offline AI eval
→ Next.js production build
~~~

| 검사 | 현재 기준 |
| --- | --- |
| Dependency audit | <code>npm audit --audit-level=high</code>, 0 vulnerabilities |
| Unit·route integration tests | 6개 파일, 31개 테스트 통과 |
| Offline AI eval | 19개 fixture 통과 |
| Lint·typecheck·build | 모두 통과 |
| Runtime telemetry coverage | AI API 10개 적용 |

### 수동 기능 검증

| 영역 | 확인 항목 |
| --- | --- |
| 인증·게시판 | 회원가입, 로그인, 게시글·댓글 CRUD, 태그, 검색, 페이지네이션, 추천·비추천 |
| KBO 데이터 | 일정·결과, 순위, 선수 기록, 박스스코어, 라인업, 문자중계 |
| RAG | 유사 글 검색, 중복 위험 안내, 관련 글 요약 |
| Agent·도구 | 리뷰 초안, 모더레이션, 게시판 도우미, JSON-RPC tool 호출 |
| 배포 | 홈 화면 응답, Vercel 웹, 모바일 앱형 화면, Android APK |

## 기술 스택

| 영역 | 기술 | 선택 이유 |
| --- | --- | --- |
| Frontend | React 19, Next.js 16 App Router, Tailwind CSS | 화면과 서버 컴포넌트, API를 하나의 TypeScript 프로젝트에서 관리 |
| Backend | Next.js Route Handlers | UI와 가까운 API를 빠르게 설계하고 공통 인증·관측성 적용 |
| Database | PostgreSQL, Prisma | 관계형 커뮤니티 데이터와 타입 안전한 데이터 접근 |
| Vector search | pgvector, LangChain.js | 별도 벡터 DB 없이 게시글 데이터와 임베딩을 함께 관리 |
| AI | OpenAI Chat·Embedding API | 요약, 초안, 도구 선택, 벡터 임베딩 구현 |
| Quality | Vitest, JSONL eval dataset | 빠른 단위·통합 테스트와 재현 가능한 정책 회귀 검사 |
| Operations | GitHub Actions, structured JSON telemetry | 변경 전 품질 검증과 배포 후 오류·지연 추적 |
| Deployment | Vercel, Supabase | 웹 애플리케이션과 PostgreSQL + pgvector 운영 |
| Mobile | PWA UI, Android WebView | 동일한 웹 기능을 모바일 앱형 경험과 APK로 확장 |

## 로컬 실행

### 요구 사항

- Node.js 22
- PostgreSQL과 pgvector 확장
- OpenAI API Key

### 설치

~~~bash
git clone https://github.com/kominsuk1064/jungle-ai-board.git
cd jungle-ai-board
npm ci
~~~

프로젝트 루트에 <code>.env</code>를 만들고 <code>.env.example</code>을 참고해 값을 설정합니다.

~~~env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/baseball_ai_board?schema=public"
AUTH_SECRET="replace-with-at-least-32-characters"
OPENAI_API_KEY="replace-with-openai-api-key"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"
OPENAI_EMBEDDING_DIMENSIONS="1536"
OPENAI_CHAT_MODEL="gpt-4o-mini"
MCP_SHARED_SECRET="replace-with-optional-mcp-secret"
~~~

데이터베이스를 준비하고 개발 서버를 실행합니다.

~~~bash
npm run db:migrate
npm run seed:demo-posts
npm run dev
~~~

개발 서버는 <http://localhost:3000>에서 열립니다. Windows PowerShell에서 실행 정책 문제가 있으면 <code>npm</code>과 <code>npx</code> 대신 <code>npm.cmd</code>과 <code>npx.cmd</code>을 사용합니다.

### 전체 품질 검사

~~~bash
npm audit --audit-level=high
npm run quality
npx prisma migrate status
~~~

## 데모에서 볼 수 있는 흐름

1. 메인 화면에서 오늘의 경기와 게시글·인기글 확인
2. 경기방에서 선발투수, 라인업, 문자중계, 박스스코어 확인
3. 글쓰기 화면에서 기존 글과의 중복 위험 확인
4. 경기 메모와 실제 기록을 이용해 리뷰 초안 생성
5. 게시글 상세에서 유사 글을 찾고 경기방에서 팬 반응 요약
6. 댓글 작성 시 모더레이션의 경고·차단 흐름 확인
7. 야구 도우미에게 경기·순위·선수 기록·게시글 질문
8. 모바일 앱형 화면과 Android APK에서 같은 흐름 확인

<details>
<summary><strong>대표 API 보기</strong></summary>

| API | 역할 |
| --- | --- |
| <code>/api/posts</code> | 게시글 목록 조회·작성 |
| <code>/api/kbo/standings</code> | KBO 팀 순위 |
| <code>/api/kbo/player-records</code> | 선수 기록 |
| <code>/api/kbo/boxscore</code> | 경기 박스스코어와 타자·투수 기록 |
| <code>/api/mcp/baseball-briefing</code> | JSON-RPC 도구 서버 |
| <code>/api/ai/rag/similar-posts</code> | 유사 게시글 추천 |
| <code>/api/ai/rag/draft-similar-posts</code> | 작성 중인 글의 중복 위험 확인 |
| <code>/api/ai/rag/related-post-summary</code> | 경기·팀 관련 글 묶음 요약 |
| <code>/api/ai/agent/review-assistant</code> | 경기 리뷰 초안 |
| <code>/api/ai/agent/moderation</code> | 게시글·댓글 모더레이션 |
| <code>/api/ai/agent/board-assistant</code> | 야구 게시판 도우미 |
| <code>/api/ai/prediction/game</code> | 경기 전망 |

</details>

## 문서

| 문서 | 내용 |
| --- | --- |
| [AI Runtime Observability](docs/ai-observability.md) | 이벤트 스키마, 개인정보 보호 원칙, 운영 지표 |
| [AI Evals](evals/README.md) | 평가 데이터셋, 실행 방법, live retrieval eval 계획 |
| [Deployment](docs/deployment.md) | Vercel·Supabase 배포 절차 |
| [Service Portfolio](docs/portfolio.md) | 서비스 문제 정의와 사용자 흐름 |
| [Release Notes](docs/release-notes-v0.1.0.md) | Android v0.1.0 릴리스 정보 |

## 한계와 다음 단계

- 현재 offline eval은 결정론적 정책 회귀 기준선이며, 실제 embedding·pgvector를 사용하는 live retrieval eval은 아직 분리되어 있습니다.
- 구조화 로그는 배포 플랫폼에서 확인할 수 있지만 장기 저장, 대시보드, OpenTelemetry trace export는 연결하지 않았습니다.
- KBO와 네이버 스포츠 데이터는 외부 페이지 구조 변경의 영향을 받을 수 있습니다.
- RAG 품질은 게시글의 양과 내용 품질에 영향을 받습니다.
- 경기 전망은 전용 예측 모델이 아닌 경기 정보 기반 LLM 브리핑이므로 참고용입니다.

다음 단계는 실제 검색 결과에 대한 Recall@K·MRR 이력 관리, AI 실행 로그의 SLO 대시보드 연결, Agent 상태 관리 고도화입니다.

## 회고

처음에는 게시판에 AI 기능을 추가하는 데 초점을 두었지만, 구현하면서 중요한 것은 AI 기능의 개수가 아니라 <strong>사용자가 필요로 하는 순간에 자연스럽게 도움을 주는가</strong>라는 점을 배웠습니다. 그래서 게시판·경기방·뉴스·기록실의 제품 흐름을 먼저 만들고, RAG와 Agent가 그 흐름을 보조하도록 구조를 바꾸었습니다.

이번 품질 개선에서는 “동작한다”는 설명만으로는 부족하다는 점에 집중했습니다. 평가 데이터, 자동 테스트, CI, 개인정보를 남기지 않는 텔레메트리를 함께 구축하며 AI 애플리케이션을 반복해서 검증하고 운영할 수 있는 형태로 발전시켰습니다.
