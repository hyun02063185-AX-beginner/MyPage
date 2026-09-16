# 94. Claude Code Instruction — Sprint 0A Documentation Integration

## Role
Documentation integration and scope correction only.
Model baseline: `Sonnet 5`

Do not implement runtime code.

## STEP 0 — Manual Environment Gate

실행 후 보고:

```text
pwd
git branch --show-current
git status --short
git remote -v
node -v
npm -v
```

논리 환경도 확인:

```text
CODYSSEY_SHARED_MAC
HOME_WINDOWS
WINDOWS_NOTEBOOK
UNKNOWN
```

hostname으로 물리적 장소를 추정하지 않는다.

Working tree가 dirty면 STOP.

## STEP 1 — Read Existing Root Rules

읽기:

```text
CLAUDE.md
HANDOFF.md
DECISIONS.md
README.md
```

구분:
- M01-specific constraints
- repository-wide safety/security rules
- existing Claude subagent boundaries
- current handoff language

## STEP 2 — Integrate Foundation v1.2

추가:

```text
docs/portfolio-world/
reports/portfolio-world/
```

아직 생성 금지:

```text
portfolio-world/package.json
world/
Phaser code
Vite config
```

## STEP 3 — Patch Root CLAUDE.md

`docs/portfolio-world/93_ROOT_SCOPE_PATCH_GUIDE.md`를 따른다.

- M01 history 보존
- M01 COMPLETE 명시
- Portfolio World 별도 Portfolio Extension 명시
- M01-specific no-library rule은 Portfolio World에 비적용
- repository-wide safety/security는 계속 적용
- canonical docs pointer 추가
- `.claude/agents/*` 삭제/재작성 금지
- smallest reasonable diff

## STEP 4 — Patch Root HANDOFF.md

최소 diff로:

```text
Codyssey M01 — COMPLETE
Portfolio World — FOUNDATION
```

Portfolio World pointer:

```text
docs/portfolio-world/91_STATUS.md
docs/portfolio-world/92_HANDOFF.md
```

## STEP 5 — Consistency Validation

검색:

```text
M01
미션1
외부 라이브러리
순수 HTML
package.json
Phaser
Portfolio World
```

historical 파일을 mass-edit하지 않는다.

## STEP 6 — Validate Foundation

확인:

- role name = `Director`
- model names use full form
- `03_REQUIREMENTS.md` = canonical v1 scope
- Library = v1 Deferred
- D-011, D-012, D-014, D-015 존재

## STEP 7 — Git

출력:

```text
git diff --check
git diff --stat
git status --short
```

사용자/Director 검토 전 commit하지 않는다.

## Required Final Report

1. environment profile
2. files added
3. files modified
4. CLAUDE.md correction summary
5. HANDOFF.md correction summary
6. remaining contradiction
7. `git diff --check`
8. runtime code changed? 반드시 `NO`
9. `READY_FOR_FOUNDATION_GATE` 또는 `NEEDS_FIX`
