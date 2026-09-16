# 93. Root Scope Patch Guide

실제 root `CLAUDE.md`와 `HANDOFF.md`는 기존 내용을 보존한 채 최소 수정한다.

## CLAUDE.md 권장 추가 내용

```md
## Scope precedence — M01 legacy vs Portfolio World

- Codyssey M01 is complete. Existing M01-specific constraints remain historical/maintenance rules for the original M01 deliverable.
- `portfolio-world/`, `docs/portfolio-world/`, `reports/portfolio-world/`, and generated `world/` output belong to a separate Portfolio Extension track.
- M01-specific technology constraints such as "no external libraries" do not apply inside the Portfolio World track.
- Repository-wide security, credential, Git safety, and non-destructive-change rules still apply everywhere.
- For Portfolio World scope, read:
  - `docs/portfolio-world/03_REQUIREMENTS.md`
  - `docs/portfolio-world/04_ARCHITECTURE.md`
  - `docs/portfolio-world/05_AI_WORKFLOW.md`
  - `docs/portfolio-world/91_STATUS.md`
  - `docs/portfolio-world/92_HANDOFF.md`
```

기존 `.claude/agents/*`는 삭제하지 않는다.

기존 subagent 경계 표 근처에는 다음 의미를 추가한다.

```md
Portfolio World note:
The existing Claude subagent boundaries were designed for earlier static-site work.
Do not automatically project those path boundaries onto `portfolio-world/`.
Portfolio World follows `docs/portfolio-world/05_AI_WORKFLOW.md`.
```

## HANDOFF.md 권장 추가 내용

```md
## Portfolio tracks

### Codyssey M01
Status: COMPLETE

### Portfolio World
Status: FOUNDATION

Canonical status:
- `docs/portfolio-world/91_STATUS.md`

Current handoff:
- `docs/portfolio-world/92_HANDOFF.md`
```

## 금지
- root 문서 전체 교체
- M01 history 삭제
- 기존 agent 파일 삭제
- runtime 코드 수정
- package.json 생성
- Phaser/Vite 설치
