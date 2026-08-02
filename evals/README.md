# AI Evals

이 디렉터리는 KBO Talk AI 기능의 품질 기준을 코드와 데이터로 관리합니다.

## Offline eval

```bash
npm.cmd run eval:offline
```

현재 오프라인 평가는 외부 API나 데이터베이스 없이 결정론적으로 실행됩니다.

- 중복 위험 정책: 벡터 유사도 임계값이 `none`, `low`, `medium`, `high`로 올바르게 분류되는지 검증
- 모더레이션 정책: 정상 글, 과격한 표현, 스팸, 개인정보, 특정 대상 공격을 기대한 verdict로 분류하는지 검증
- 회귀 기준: 모든 fixture가 기대 결과와 정확히 일치해야 통과

## Dataset format

평가 데이터는 `datasets/*.jsonl`에 한 줄당 하나의 JSON 객체로 저장합니다. 코드 변경과 함께 fixture를 추가해 과거에 해결한 실패 사례가 다시 발생하지 않도록 합니다.

## Retrieval eval roadmap

RAG 검색 품질은 다음 단계에서 별도 live eval로 측정합니다.

1. 재현 가능한 게시글 seed와 기대 게시글 ID를 연결
2. 실제 OpenAI embedding과 pgvector 검색 실행
3. `Recall@3`과 MRR 측정
4. 모델·프롬프트·데이터셋 버전을 결과와 함께 기록

오프라인 eval은 pull request마다 실행하고, 비용과 외부 의존성이 있는 live eval은 수동 또는 정기 실행으로 분리합니다.

## Runtime monitoring

eval이 배포 전 품질 회귀를 막는 장치라면, 런타임 텔레메트리는 배포 후 오류율과 지연 시간을 확인하는 장치입니다.

구조화 이벤트, trace ID, 개인정보 비수집 원칙은 [`docs/ai-observability.md`](../docs/ai-observability.md)에 정리했습니다.
