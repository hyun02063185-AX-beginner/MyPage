# 08. Portfolio World — Environment & Work Context Policy

## 1. 환경 프로필

### CODYSSEY_SHARED_MAC

- 공용 iMac
- 장소 이동하며 여러 장비 사용 가능
- sudo 없음
- 사용자 영역 Node/npm
- 현재 기준 Volta 방식
- DeepSeek 사용 불가

### HOME_WINDOWS

- 제약 적음
- Codex
- Claude Code
- DeepSeek

### WINDOWS_NOTEBOOK

- 제약 적음
- Codex
- Claude Code
- DeepSeek는 기본 사용 환경 아님

## 2. 장소 자동 추론 금지

hostname 또는 machine ID를 물리적 장소로 간주하지 않는다.

자동 판별 대상:

- OS
- machine
- repo
- branch
- git state
- runtime
- tool availability
- logical environment profile

## 3. Local Profile

예:

```text
.portfolio-work-context.local.json
```

`.gitignore` 대상.

공용 Mac에서는 clone마다 없을 수 있으므로 최초 1회 profile 선택 가능.

## 4. Environment Gate

코드 수정 전에:

- profile
- OS
- branch
- git clean/dirty
- origin sync
- node/npm
- Codex
- Claude
- DeepSeek
- 91_STATUS
- 92_HANDOFF

확인.

## 5. Machine Switch

마지막 handoff와 machine/profile이 다르면:

```text
MACHINE OR ENVIRONMENT SWITCH DETECTED
```

표시.

이것은 장소 변경 판정이 아니다.

## 6. Switch Procedure

1. git status
2. git pull --ff-only
3. status/handoff 확인
4. dependency 확인
5. baseline test
6. 현재 환경에 맞춰 agent routing

## 7. Shared Mac Security

- API key commit 금지
- `.env` commit 금지
- credential file commit 금지
- 작업 종료 후 필요 시 logout
- Downloads/Desktop에 민감 파일 방치 금지
