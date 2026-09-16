# MyPage

김현래 개인 홈페이지 겸 AX 강사 포트폴리오.
코디세이 미션1(순수 HTML/CSS/JS 포트폴리오) 과제를 겸한다.

**작업 전 `SPEC.md`를 반드시 읽는다.** 스펙에 적힌 결정은 확정된 것이니
바꾸거나 재검토하지 않는다. 스펙에 없는 판단이 필요하면 작업을 멈추고 물어본다.

## Scope 우선순위 — M01 legacy vs Portfolio World

- 코디세이 미션1(M01)은 완료된 과제다. 아래 "절대 규칙"·"코드 규칙"에 적힌 M01 전용
  제약(외부 라이브러리 금지 등)은 기존 M01 결과물을 보존·유지하기 위한 역사적 규칙으로
  계속 남는다.
- `portfolio-world/`, `docs/portfolio-world/`, `reports/portfolio-world/`와 빌드
  산출물 `world/`는 별도의 Portfolio Extension 트랙이다.
- "외부 라이브러리 금지"를 비롯한 M01 전용 기술 제약은 Portfolio World 트랙에는
  적용하지 않는다.
- 보안·크레덴셜·Git 안전·비파괴적 변경 원칙 등 저장소 전역 규칙은 어디서나 계속
  적용된다.
- Portfolio World 범위는 아래 문서를 따른다:
  - `docs/portfolio-world/03_REQUIREMENTS.md`
  - `docs/portfolio-world/04_ARCHITECTURE.md`
  - `docs/portfolio-world/05_AI_WORKFLOW.md`
  - `docs/portfolio-world/91_STATUS.md`
  - `docs/portfolio-world/92_HANDOFF.md`

## 절대 규칙

1. **외부 라이브러리 금지** — React/Vue/jQuery/Bootstrap/Tailwind 등 일체.
   Font Awesome, Google Fonts만 허용. 미션 제약이라 위반 시 과제 실패.
2. **문체는 경어체** — `~했습니다`. 평서체 금지.
3. **개인정보 금지** — 생년월일, 자격증·수료증 번호, 주소, 연락처.
   수료증·자격증 이미지 파일은 참조하지 않는다.
4. **출강 학교 실명·횟수 금지** — 강의 주제만 표기.
5. **저장소 링크 금지** — 링크는 실제로 열리는 데모만.
6. **없는 성과를 쓰지 않는다** — 근거가 없으면 비워두고 보고한다.

## 코드 규칙

- `const`/`let`만. `var` 금지
- `addEventListener`만. HTML `onclick` 속성 금지
- 인라인 `style="..."` 금지
- JS는 `defer`로 연결
- 콘텐츠는 `js/data/`에만 둔다. HTML/JS에 문구를 하드코딩하지 않는다

## 에이전트 파일 경계

자기 담당 폴더 밖의 파일은 수정하지 않는다.

| 에이전트 | 담당 경로 |
|---|---|
| 콘텐츠 | `js/data/`, `images/` |
| 구조·스타일 | `index.html`, `css/` |
| 인터랙션 | `js/motion/` |
| 데이터·API | `js/render/` |
| 오케스트레이터 | `js/main.js`, `README.md`, `SPEC.md` |

`content/*.md`는 원본 자료다. 읽기만 하고 수정하지 않는다.

> **Portfolio World 참고:** 위 서브에이전트 경계는 기존 정적 사이트(M01) 작업을
> 위해 설계된 것이다. 이 경로 경계를 `portfolio-world/`에 자동 적용하지 않는다.
> Portfolio World는 `docs/portfolio-world/05_AI_WORKFLOW.md`를 따른다.

## 완료 기준

작업을 마쳤다고 보고하기 전에 `SPEC.md`의 검수 체크리스트를 확인한다.
통과하지 못한 항목이 있으면 무엇이 남았는지 함께 보고한다.
