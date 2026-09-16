# 04. Portfolio World — Technical Architecture

## 1. Repository Strategy

기존 `MyPage` 저장소 유지.

```text
MyPage/
├─ 기존 정적 웹
├─ portfolio-world/
├─ world/
├─ docs/portfolio-world/
└─ reports/portfolio-world/
```

## 2. M01 Scope Separation

Root의 기존 M01 관련 문서는 역사적 과제 기준으로 보존한다.

Portfolio World는 별도 확장 범위다.

권장 root 문서 보정:

- `CLAUDE.md`: M01 legacy scope와 Portfolio World scope를 분리
- `HANDOFF.md`: M01 완료 상태와 이후 Portfolio Extension 상태를 구분
- 필요 시 기존 M01 규칙 앞에 적용 범위 명시

Portfolio World 안에서는 npm/Vite/Phaser 사용 가능.

## 3. Existing Site

현재 root:

- 정적 HTML/CSS/JS
- package.json 없음

기존 사이트 전체를 Vite/React로 마이그레이션하지 않는다.

## 4. Suggested Stack

- Phaser
- Vite
- JavaScript 또는 TypeScript
- Tiled 후보
- Playwright 또는 browser smoke test
- Node/npm

정확한 버전은 Sprint 0에서 lock한다.

## 5. Build Strategy

현재:

```text
GitHub Pages
main / root
```

후보:

```text
source:
portfolio-world/

build:
world/
```

검증 항목:

- `/MyPage/` base path
- asset relative path
- build output commit 여부
- Actions 전환 필요성

## 6. Runtime Structure

```text
portfolio-world/
├─ package.json
├─ src/
│  ├─ main.*
│  ├─ scenes/
│  ├─ systems/
│  └─ data/
├─ maps/
├─ assets/
└─ tests/
```

## 7. Architecture Rules

1. WorldScene에 모든 책임 집중 금지
2. Portfolio link mapping 분리
3. interaction data 분리
4. Portfolio content 복제 금지
5. local absolute path 금지
6. local environment file commit 금지
7. asset license 추적
