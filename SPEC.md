# MyPage 구현 스펙

김현래 개인 홈페이지 겸 AX 강사 포트폴리오.
코디세이 본과정 미션1(순수 HTML/CSS/JS 포트폴리오) 과제를 겸한다.

- 저장소: https://github.com/hyun02063185-AX-beginner/MyPage
- 배포: GitHub Pages

---

## 1. 원칙

**개인 홈페이지가 먼저, 포트폴리오는 그 안에 담긴다.**
방문자가 "이 사람 뭐 하는 사람이지" 하고 들어와서 결과적으로
"강의를 맡겨도 되겠다"고 느끼는 흐름. 홍보 톤으로 기울지 않는다.

**인터랙션 기준**
- 넣을 것: 스크롤하면 저절로 살아나는 연출 (등장, 진행선, 시차)
- 뺄 것: 방문자에게 조작을 요구하는 장치 (클릭해야 다음이 나오는 구조)

**문체**
- 경어체 (`~했습니다`). 평서체(`~했다`) 금지.
- 1인칭. 과장·최상급 표현 금지. 사실만 쓴다.
- 스토리 원고의 톤이 사이트 전체의 기준이다.

**금지**
- 외부 라이브러리 (React/Vue/jQuery/Bootstrap/Tailwind 등) — 미션 제약
  Font Awesome, Google Fonts만 허용
- 개인정보: 생년월일, 자격증·수료증 번호, 주소, 연락처
- 출강 학교 실명, 출강 횟수·건수 숫자
- 저장소 링크 (개발자 포트폴리오가 아님). 링크는 열리는 데모만.
- 인라인 `style="..."`, HTML `onclick` 속성, `var`

---

## 2. 섹션 구성

순서대로 세로 스크롤 한 장.

| # | 섹션 | 내용 |
|---|---|---|
| 1 | hero | 한 문장 자기 정의 + 자격 요약 한 줄 |
| 2 | story | 5장면. 이 사이트의 중심 |
| 3 | explain | 이렇게 설명합니다. AI를 대하는 관점 + 설명 사례 카드 |
| 4 | teaching | 강의 주제 목록 (분류 3개) |
| 5 | credentials | 자격·수료 (텍스트만, 작게) |
| 6 | work | 프로젝트 카드 + 필터 |
| 7 | github | GitHub API 저장소 목록 |
| 8 | contact | 강의 문의 폼 |
| 9 | footer | 저작권, GitHub 링크 |

### hero
```
IT 현장에서 20년을 보냈습니다. 웹 서비스를 만들고, 운영했습니다. 지금은 그 경험으로 AI 활용을 가르칩니다.
AX 전문강사 · AICE Future 1급 · CISA
```

### story
5장면. 각 장면 = 소제목 + 3~4문장. 원고는 `js/data/story.js`.
장면마다 시기·소속 배지를 단다. 별도 career 섹션은 두지 않는다 —
이 5장면이 곧 타임라인이다.

1. 토요일, 친구네 집 — 중2, MSX2 삼국지2
2. 만드는 사람 — 인턴 1년, 다음커뮤니케이션, 만화속세상 개편
3. 지키는 사람 — 삼성화재 9년, 개발과 운영의 차이
4. 가르치는 사람 — 신입 기획자, 신입 개발자 온보딩
5. 다시, 그때 그 느낌 — 바이브코딩, 지금

### explain
2단 구성. 상단은 관점, 하단은 설명 사례 카드. 원고는 `js/data/explain.js`.

**상단 — 관점 + 대표 이미지**
- 이미지: `kyulshimhandang.webp`
- 캡션: "이 그림도 AI로 만들었습니다. 자세히 보면 한글이 네 군데 틀려 있습니다. 그래서 결과물은 제가 이해하고 있어야 합니다."
- 관점 문장 3개:
  1. "AI를 대하는 태도는 주도적이어야 합니다. 구조는 제가 먼저 잡고, 결과물은 제가 이해합니다."
  2. "이해가 안 되면 될 때까지 다시 물어봅니다."
  3. "부장이 실무자에게 일을 맡기듯 대합니다."

**하단 — 설명 사례 카드**
웹툰 이미지 + 제목 + 개념 + 해설 문단으로 구성한 카드 목록.
- 대표 사례: 제주 동문시장 API 비유. 원고는 콘텐츠 에이전트가 별도로 받아 작성한다.
- 나머지 사례는 `public/comics/`의 md·json 원본에서 가져온다.

**이미지 정책**
- 웹툰 이미지는 정사각형이라 카드 썸네일에서 잘리면 안 된다. work 섹션 프로젝트 카드의 16:9 비율과는 분리해서 처리한다 (별도 비율/클래스).
- 한글 오타가 있는 이미지(`kyulshimhandang.webp` 등)는 오타를 다루는 맥락에서만 사용한다. 다른 곳의 대표 이미지로 재사용하지 않는다.

### teaching
학교명·횟수 없이 주제만.
- AI 활용 코딩: 드론 코딩, 자율주행 자동차 (KT 코디니 블록코딩 기반)
- 진로·학과 특강: 건축공학, 생명공학, 핀테크·금융IT, 개발자 직업체험
- 융합·기타: 리빙랩, 메타버스, 학습코칭

도입부 한 줄: 낯선 분야를 빠르게 강의로 만들어내는 일을 해왔다는 취지.

### credentials
| 항목 | 기관 | 시기 | 링크 |
|---|---|---|---|
| AICE Future 1급 | KT | 2024-11 | 없음 |
| CISA | ISACA | 2023-09 | Credly 배지 |
| 인공지능(AI)융합교육지도사 | 국제강사인증교육원 | 2025-08 | 없음 |
| 현장형 AX전문강사 양성과정 (경영·행정·데이터) | KIBWA | 2026-07 | 없음 |
| 현장형 AX전문강사 양성과정 (마케팅 콘텐츠 기획) | KIBWA | 2026-07 | 없음 |
| 생성형 AI 활용 프로그래밍 기초·심화 | 광운대 국가인적자원개발센터 | 2025-03, 2025-06 | 없음 |

AICE 하위 급수(2급·3급)는 표기하지 않는다.
AICE Junior는 "AI 출강 자격 요건으로 취득" 맥락을 한 줄 붙여 별도 표기.

### work
`content/*.md` 15장 중 4개(ax-lecture, ax-lecture-studio, webtoon-generator-v2,
science-qbank-v2)를 골라 `js/data/projects.js`로 변환해 사용.
- 카드 4개를 모두 노출한다. 더보기 기능은 없다.
- 카테고리 필터 버튼 (강의 콘텐츠 / 실무 도구 / 개인 프로젝트)
- 링크는 열리는 데모만. 없으면 링크 없이 스크린샷.

### github
`https://api.github.com/users/hyun02063185-AX-beginner/repos`
로딩 / 성공 / 에러(재시도 버튼) / 빈 상태 4가지를 모두 UI로.
403 레이트리밋도 에러 상태로 처리.

---

## 3. 인터랙션 목록

### 전역
| 기능 | 사양 |
|---|---|
| 다크모드 토글 | `[data-theme="dark"]`, localStorage 저장 |
| 햄버거 메뉴 | 768px 미만에서 노출, `classList.toggle` |
| 부드러운 스크롤 | 네비 클릭 시 해당 섹션으로 |
| 스크롤탑 버튼 | 300px 이상에서 노출 (README에 명시) |
| 네비 배경 변경 | 60px 이상에서 전환 (README에 명시) |
| 등장 애니메이션 | IntersectionObserver, threshold 0.2 (README에 명시) |

### 섹션별
- hero: 문장 페이드업. (보너스로 타이핑 효과 검토)
- story: 왼쪽 진행선이 스크롤에 따라 차오름. 장면별 시차 등장.
- teaching: 태그가 순서대로 등장 (stagger)
- work: 필터 클릭 → 카드 재렌더링, hover 시 카드 반응
- contact: 실시간 유효성 검사, 필드 옆 에러 메시지, 제출 시 성공 메시지

**상태 → 렌더링 흐름 3개 이상** (미션 요구)
1. 다크모드 토글 → 테마 상태 → 전체 스타일
2. GitHub API → 로딩/성공/에러 상태 → github 섹션
3. 필터 클릭 → 필터 상태 → work 카드 목록
4. 폼 입력 → 유효성 상태 → 에러 메시지

---

## 4. 데이터 스키마

콘텐츠와 코드를 완전히 분리한다. 내용 수정은 `js/data/`만 건드린다.

```js
// js/data/hero.js
export const hero = {
  heading: "IT 현장에서 20년을 보냈습니다. 웹 서비스를 만들고, 운영했습니다. 지금은 그 경험으로 AI 활용을 가르칩니다.",
  sub: "AX 전문강사 · AICE Future 1급 · CISA"
};

// js/data/story.js
export const story = [
  {
    id: "scene-1",
    title: "토요일, 친구네 집",
    badge: "중학교 2학년",
    paragraphs: ["...", "..."]
  }
];

// js/data/explain.js
export const explain = {
  perspective: {
    image: "images/kyulshimhandang.webp",
    imageAlt: "...",
    caption: "이 그림도 AI로 만들었습니다. 자세히 보면 한글이 네 군데 틀려 있습니다. 그래서 결과물은 제가 이해하고 있어야 합니다.",
    statements: [
      "AI를 대하는 태도는 주도적이어야 합니다. 구조는 제가 먼저 잡고, 결과물은 제가 이해합니다.",
      "이해가 안 되면 될 때까지 다시 물어봅니다.",
      "부장이 실무자에게 일을 맡기듯 대합니다."
    ]
  },
  cases: [
    {
      title: "...",
      concept: "...",
      image: "images/....webp",
      imageAlt: "...",
      paragraphs: ["...", "..."]
    }
  ]
};

// js/data/teaching.js
export const teaching = [
  { category: "AI 활용 코딩", topics: ["드론 코딩", "자율주행 자동차"],
    note: "KT 코디니 블록코딩 기반", highlight: true }
];

// js/data/credentials.js
export const credentials = [
  { name: "AICE Future 1급", issuer: "KT", date: "2024-11", verifyUrl: null, note: "" },
  { name: "AICE Junior", issuer: "KT", date: "2025-08", verifyUrl: null,
    note: "AI 출강 자격 요건으로 취득" }
];

// js/data/projects.js
export const projects = [
  {
    slug: "ax-lecture",
    title: "AX_Lecture",
    period: "2026",
    role: "1인 기획·개발",
    problem: "...",
    work: "...",
    result: "...",
    category: "강의 콘텐츠",
    demoUrl: null,
    image: "images/ax-lecture.png"
  }
];
```

---

## 5. 파일 구조와 에이전트 경계

에이전트는 자기 폴더 밖의 파일을 수정하지 않는다.

```
index.html          ← 구조·스타일 에이전트
css/
  tokens.css        ← 구조·스타일 에이전트
  base.css
  layout.css
  sections.css
js/
  data/*.js         ← 콘텐츠 에이전트
  motion/*.js       ← 인터랙션 에이전트
  render/*.js       ← 데이터·API 에이전트
  main.js           ← 오케스트레이터만 수정
images/             ← 콘텐츠 에이전트
README.md           ← 오케스트레이터
```

| 에이전트 | 담당 | 산출물 |
|---|---|---|
| 콘텐츠 | `content/*.md` → 데이터 변환, 이미지 정리 | `js/data/`, `images/` |
| 구조·스타일 | 시맨틱 마크업, 디자인 토큰, 라이트/다크 2세트, 반응형 | `index.html`, `css/` |
| 인터랙션 | 전역 6종 + 섹션별 연출 | `js/motion/` |
| 데이터·API | 렌더 함수, 상태 패턴, GitHub API, 폼 검증 | `js/render/` |

**공용 렌더 함수 원칙**: work 섹션과 github 섹션은 같은 카드 렌더 함수와
같은 로딩/에러/빈 상태 처리를 공유한다. 섹션마다 따로 만들지 않는다.

---

## 6. 검수 체크리스트 (미션1 요구사항)

- [ ] 시맨틱 태그: header, nav, main, section, article, footer
- [ ] 모든 img에 의미 있는 alt
- [ ] label과 input이 for-id로 연결
- [ ] CSS 변수(:root) + 다크모드 변수 별도 정의
- [ ] 네비 Flexbox, work 카드 Grid (auto-fit, minmax)
- [ ] 모바일 퍼스트, 브레이크포인트 768 / 1024
- [ ] JS는 defer로 연결, const/let만 사용
- [ ] addEventListener만 사용 (onclick 속성 금지)
- [ ] 인라인 style 금지
- [ ] 화살표 함수, 템플릿 리터럴, 구조분해, map/filter/forEach 사용
- [ ] fetch + async/await + try/catch
- [ ] GitHub API 4상태 모두 구현 (로딩/성공/에러+재시도/빈)
- [ ] 다크모드 localStorage 유지
- [ ] 폼 필수값·이메일 형식 검증, preventDefault, 성공 메시지
- [ ] GitHub Pages 배포, 배포 URL에서 전 기능 동작
- [ ] README: 프로젝트 설명, 사용 기술, 배포 URL, 스크린샷, 임계값 3종 명시
- [ ] 제출용 스크린샷 3종 (데스크톱 / 모바일 / 다크모드)
