# Codex 테라 High — R5 Integration B.1 작업 지시서

## 1. 작업 기본 정보

**TASK ID:** R5-INTEGRATION-B1-DESTINATION-NAV-RESTORE

**작업명:** R5 정식 Runtime 하단 목적지 메뉴 복원 및 탐색 UX 검증

| 항목 | 기준 |
|---|---|
| Repository | `C:\Users\hyun0\MyPage` |
| Branch | `design/world-layout-recovery-r5` |
| 시작 HEAD | `c9abfe9b6cf06b05c89c5243ea28562407441ca8` |
| 모델 | Codex 테라 High |
| 작업 권한 | Integration B.1만 승인 |
| 비교 원본 | `portfolio-world/r5-hybrid-pilot.html` |
| 실제 적용 | `portfolio-world/src/scenes/R5WorldScene.ts` |

기존 Integration B 코드를 기반으로 작업한다.

이번 작업지시서의 전체 원문을 `reports/portfolio-world-rebuild/r5-world-layout-recovery/integration-b1/00-task-instruction.md`에 저장한다.

작업 전 브랜치, HEAD 및 Working Tree 상태를 확인한다. 기존 미커밋 파일을 임의로 삭제하거나 초기화하지 않는다.

## 2. 작업 배경 및 목표

사용자가 Integration B의 신규 R5 Runtime을 직접 실행하여 캐릭터 이동이 정상적으로 동작함을 확인했다.

다만 기존 Hybrid Pilot에 있던 **화면 하단의 목적지 선택 버튼 5개가 정식 Runtime으로 이전되지 않은 상태**다.

현재 R5 Runtime에서는 카메라 화면에 들어오는 건물 Marker만 선택할 수 있다. 화면 밖의 Exhibition Hall이나 Hero Ship을 바로 선택하기 어렵다는 UX 문제가 있다.

이를 해결하기 위해 Pilot에서 이미 검증한 하단 메뉴를 복원한다.

작업 완료 후 다음 두 가지 탐색 방식이 동시에 가능해야 한다.

- 월드 안의 건물 Marker를 클릭해서 이동
- 화면 하단의 목적지 버튼을 클릭해서 이동

두 방식 모두 동일한 기존 A* 이동 기능을 호출해야 한다.

새로운 이동 알고리즘을 만들거나 기존 월드 디자인을 변경하지 않는다.

## 3. Task A — 기존 Pilot 하단 메뉴 분석

원본:

`portfolio-world/r5-hybrid-pilot.html`

기존 Pilot의 하단 메뉴는 다음 다섯 버튼으로 구성돼 있다.

| 버튼 | 기능 |
|---|---|
| Exhibition Hall | 전시관으로 자동 이동 |
| Workshop | 작업실로 자동 이동 |
| Harbor Archive | 아카이브로 자동 이동 |
| Hero Ship | 히어로십 탑승 지점으로 이동 |
| Route guide | 이동 경로 표시 ON/OFF |

기존 메뉴의 디자인, 버튼 크기, 색상, Hover, Focus 상태를 확인한다.

**시각적으로 기존 Pilot과 같은 계열의 메뉴를 복원한다.**

단, 정식 Runtime의 헤더와 Footer 구조에 맞춰 배치한다. Pilot의 HTML 전체를 복사해서 중복 레이아웃을 만들지 않는다.

## 4. Task B — R5 전용 하단 목적지 메뉴 구현

권장 구조:

- R5 전용 Navigation 컨테이너
- 네 개 목적지 버튼
- 한 개 Route guide 버튼

R5 Scene이 실행될 때만 메뉴를 생성한다.

하단 메뉴는 **게임 Canvas 아래의 독립된 UI 영역**에 배치한다. Canvas를 덮어서 캐릭터나 길을 가리지 않도록 한다.

기존 `world-shell` 구조를 고려해, R5에서만 메뉴 공간을 확보한다.

현재 R4의 Header, Footer 및 게임 크기를 변경하지 않는다.

필요한 경우 `world.css`에 R5 전용 CSS를 추가한다.

### 레이아웃 기준

Desktop:

- 기존 Pilot처럼 다섯 버튼을 한 줄로 표시
- 화면 중앙 정렬
- 버튼 간격 일정
- 주변과 구분되는 어두운 배경
- 기존 항구 디자인과 어울리는 색감 유지

Narrow viewport:

- 버튼 줄바꿈 또는 Grid 적용
- 텍스트 잘림 최소화
- 가로 스크롤 강제 금지
- 메뉴가 Canvas나 다른 기능 위에 겹치지 않음

모바일 실기기 최종 UX는 Integration C에 속한다. 다만 이번 단계에서 반응형 레이아웃의 기본 동작을 구현한다.

## 5. Task C — 목적지 버튼과 A* 이동 연결

현재 POI 데이터의 단일 기준은 다음 파일이다.

`portfolio-world/src/world/r5/r5PoiContract.ts`

하단 메뉴와 월드 Marker가 동일한 `R5_POIS` 데이터를 사용하도록 한다.

새로운 별도 POI 배열을 만들지 않는다.

### 목적지 연결

| 버튼 | POI ID | Navigation Target |
|---|---|---|
| Exhibition Hall | hall | (175, 190) |
| Workshop | workshop | (245, 440) |
| Harbor Archive | archive | (180, 560) |
| Hero Ship | hero | (1020, 364) |

하단 버튼을 누르면 현재 `R5WorldScene.requestRoute()`와 동일한 경로 요청 흐름을 사용한다.

가능하면 버튼 클릭과 Marker 클릭이 공통 함수로 연결되도록 정리한다.

다음 기능이 모두 정상이어야 한다.

1. 하단 버튼 클릭 → 목적지 선택
2. A* 경로 계산
3. 캐릭터 자동 이동
4. 이동 중 상태 표시
5. 도착 상태 표시
6. 다른 버튼 선택 시 경로 변경
7. 이동 중 WASD 조작 시 자동 이동 취소
8. 잘못된 경로인 경우 BLOCKED 처리

Marker 클릭과 메뉴 클릭이 중복 이벤트를 발생시키지 않아야 한다.

**목적지가 현재 화면 밖에 있어도 하단 메뉴 버튼은 항상 선택 가능해야 한다.**

단, 실제 도착 가능 여부는 기존 A*와 충돌 검사에 따른다.

## 6. Task D — 선택 및 이동 상태 동기화

하단 메뉴와 월드 Marker는 하나의 상태를 공유해야 한다.

다음 상태를 명확하게 표현한다.

| 상태 | 하단 버튼 표시 |
|---|---|
| IDLE | 기본 |
| MOVING | 선택한 목적지 강조 |
| ARRIVED | 도착한 목적지 강조 |
| BLOCKED | 이동 불가 안내 |
| CANCELLED | 이동 취소 상태 반영 |

예시:

Exhibition Hall 버튼을 클릭했을 때

- Exhibition Hall 버튼 강조
- 해당 Marker도 강조
- Route guide가 ON이면 경로 표시
- 캐릭터 이동
- 도착 후 ARRIVED 안내

이동 중 Hero Ship 버튼을 클릭하면

- 기존 경로 취소
- Hero Ship 버튼 강조
- Hero Ship 목표 경로 생성
- 이전 목적지 선택 상태 해제

메뉴와 Marker의 상태가 서로 다르게 보이면 안 된다.

접근성을 위해 버튼의 키보드 Focus, 선택 상태를 나타내는 ARIA 속성도 구현한다.

## 7. Task E — Route guide 버튼 통합

현재 Runtime에는 화면 좌측 상단에 `Route guide: ON` 버튼이 있다.

이번에는 Pilot처럼 Route guide 기능을 하단 목적지 메뉴에 통합한다.

따라서 기존 상단 버튼을 그대로 남겨 **중복 UI가 발생하지 않게 한다.**

반드시 하나의 `routeGuideEnabled` 상태를 사용한다.

기본 동작:

- 초기값: ON
- 클릭 시 OFF
- 다시 클릭 시 ON
- OFF여도 자동 이동은 정상 동작
- ON일 때 현재 이동 경로 표시
- 목적지 변경 시 경로 안내 갱신

필요하면 버튼 문구를 `Route guide: ON` / `Route guide: OFF`로 사용한다.

버튼에는 `aria-pressed`를 적용해 ON/OFF 상태가 전달되도록 한다.

## 8. Task F — DOM 및 Phaser Lifecycle 검증

현재 `R5WorldScene`은 런타임에 DOM Marker와 HUD를 생성한다.

하단 메뉴도 동일한 Scene Lifecycle로 관리한다.

다음 조건을 만족해야 한다.

- R5 Scene 시작 시 메뉴가 한 번만 생성됨
- Scene 종료 시 메뉴 제거
- 다시 진입해도 중복 생성 없음
- DOM 이벤트 리스너 정리
- Phaser Pointer 이벤트 중복 방지
- R4 Scene에 메뉴 노출 없음
- 기본 World에 메뉴 노출 없음
- 기존 Hybrid Pilot에 영향 없음

기존 `mountRuntimeUi()`와 `destroyRuntimeUi()`의 책임을 점검한다.

필요하면 UI 모듈을 분리할 수 있다. 단, 이번 작업을 이유로 Scene 전체를 대규모 리팩터링하지 않는다.

특히 Phaser `input`과 `scale`에 등록한 이벤트 리스너도 종료 시 안전하게 해제되는지 확인한다.

## 9. Task G — 디자인 및 플레이 회귀 보호

다음 항목은 변경하지 않는다.

| 보호 영역 | 기준 |
|---|---|
| 배경 | Candidate B |
| 캐릭터 | 승인된 Front/Back V3, Side |
| 월드 크기 | 1280×720 |
| 카메라 Zoom | 1.25 |
| 이동 속도 | 170px/s |
| 충돌 Body | 28×16 |
| A* Grid | 8px |
| 목적지 | 정확히 4개 |
| Hero Ship | Boarding Threshold까지만 |
| 오른쪽 공간 | Future Expansion Reserve |

기존 Workshop → Hall 경로의 Waypoint overshoot 수정도 유지한다.

이동 기능을 보완하기 위해 충돌 판정을 해제하거나 보행 Polygon을 확장해서는 안 된다.

**캐릭터 디자인·걸음걸이·경로 탐색 로직은 사용자 승인 Baseline으로 취급한다.**

## 10. Task H — 사용자 경험 검증

### 필수 UI 시나리오

| ID | 검증 항목 | 성공 기준 |
|---|---|---|
| U01 | R5 최초 진입 | 하단 메뉴 5개 표시 |
| U02 | Exhibition Hall 선택 | 해당 목적지로 이동 시작 |
| U03 | Workshop 선택 | 해당 목적지로 이동 시작 |
| U04 | Harbor Archive 선택 | 해당 목적지로 이동 시작 |
| U05 | Hero Ship 선택 | 탑승 지점으로 안전하게 이동 시작 |
| U06 | 화면 밖 목적지 선택 | 하단 버튼으로 선택 가능 |
| U07 | 목적지 변경 | 기존 경로 취소 후 새 경로 |
| U08 | Marker 클릭 | 하단 선택 상태 동기화 |
| U09 | Route guide OFF | 경로만 숨김 |
| U10 | Route guide ON | 경로 다시 표시 |
| U11 | 수동 이동 전환 | 자동 경로 정상 취소 |
| U12 | 좁은 화면 | 버튼 겹침·잘림 없음 |
| U13 | R4 진입 | 하단 R5 메뉴 없음 |
| U14 | Pilot 진입 | 기존 메뉴 유지 |

### 필수 플레이 경로

가능한 경우 실제 브라우저에서 다음 경로를 검증한다.

- Workshop → Hall
- Workshop → Archive
- Workshop → Hero Ship
- Hall → Workshop
- Archive → Hero Ship

검증 시 실제 이동과 도착을 구분해 기록한다.

**A* 경로 생성 성공만으로 실제 도착 PASS를 선언하지 않는다.**

브라우저 자동화가 프레임 제한 때문에 실제 이동 검증을 수행하지 못하면, `NOT_VERIFIED_IN_BROWSER`로 보고하고 Human Playtest 항목으로 남긴다.

이전과 같이 정지 화면이나 계산 결과를 이동 완료 증거로 제출하지 않는다.

## 11. Task I — 테스트 및 Production Preview

### 개발 서버

사용자 Windows 환경에서 5173·5174는 EACCES가 발생했고 30080은 정상 실행됐다.

우선 다음 명령을 사용한다.

`npm run dev -- --host 127.0.0.1 --port 30080 --strictPort`

R5 검증 주소:

`http://127.0.0.1:30080/?r5=1`

Pilot:

`http://127.0.0.1:30080/r5-hybrid-pilot.html`

### Production Preview

`npm run build`

`npm run preview -- --host 127.0.0.1 --port 30081 --strictPort`

Production Preview 주소:

`http://127.0.0.1:30081/MyPage/world/?r5=1`

포트가 이미 사용 중이거나 사용할 수 없다면, 안전한 다른 포트를 선택하여 실제 주소를 보고한다.

### 자동 검증

실행:

- `npm run typecheck`
- `npm run build`
- `npm test`

추가 테스트:

- 메뉴 버튼 정확히 5개
- POI 데이터 단일 기준
- 메뉴와 Marker가 동일한 경로 요청 사용
- 선택 상태 동기화
- Route guide 중복 제거
- 경로 ON/OFF
- DOM 생성·정리
- Scene 재진입 중복 방지
- R4 보존
- 기존 Pilot 보존
- Production Preview 렌더링

Browser Console 및 Asset Load 오류도 확인한다.

## 12. 필수 산출물

저장 경로:

`reports/portfolio-world-rebuild/r5-world-layout-recovery/integration-b1/`

### 보고 문서

1. `00-task-instruction.md`
2. `01-existing-pilot-menu-analysis.md`
3. `02-runtime-bottom-navigation-implementation.md`
4. `03-poi-and-marker-state-sync.md`
5. `04-route-guide-integration.md`
6. `05-responsive-and-accessibility-review.md`
7. `06-browser-playtest-results.md`
8. `07-r4-and-pilot-regression.md`
9. `08-final-human-gate.md`

### 시각 증거

- `10-r5-runtime-bottom-menu.png`
- `11-pilot-vs-runtime-menu.png`
- `12-offscreen-destination-selected.png`
- `13-route-guide-on-off.png`
- `14-production-preview-bottom-menu.png`

각 이미지는 실제 해당 Runtime 브라우저 실행에서 캡처한다.

기존 Pilot 이미지를 신규 Runtime 캡처로 제출하지 않는다.

### 설계 상태 데이터

`data/portfolio-world/r5-integration-b1-menu-restoration.json`

포함 항목:

- Task ID
- Baseline Commit
- Bottom Menu
- POI Mapping
- Route Guide
- Selection States
- DOM Lifecycle
- Browser QA
- R4 Regression
- Pilot Regression
- Human Gate
- Remaining Integration C Items

## 13. 작업 금지 범위

이번 작업에서는 다음을 금지한다.

- Candidate B 수정
- 캐릭터 자산 재생성
- A* 알고리즘 전면 재작성
- 충돌 영역 임의 변경
- 목적지 추가 또는 좌표 변경
- Hero Ship 보행 범위 변경
- 새 건물·배·전경 자산 제작
- 기존 R4 Scene 수정
- 기존 Pilot UX 변경
- 콘텐츠 HTML 페이지 변경
- 콘텐츠 새 탭 기능 구현
- Android 실기기 최종 QA
- GitHub Pages 실제 배포
- `main` 병합

모든 변경은 Integration B.1의 메뉴 복원과 필요한 연결 작업에 국한한다.

## 14. 완료 Gate

### `READY_FOR_R5_INTEGRATION_B1_HUMAN_PLAYTEST`

다음 조건을 만족하면 선언한다.

1. 하단 목적지 버튼 5개가 정상 표시된다.
2. Pilot과 시각적으로 일관된 디자인이다.
3. 화면 밖의 목적지 선택이 가능하다.
4. 하단 버튼과 Marker가 동일한 A* 경로 기능을 사용한다.
5. 목적지 변경과 선택 상태 동기화가 정상이다.
6. Route guide 기능이 하단 메뉴로 통합됐다.
7. 기존 상단의 중복 버튼이 제거됐다.
8. Desktop·좁은 화면에서 메뉴가 사용 가능하다.
9. 기존 R4 및 Pilot에 회귀 문제가 없다.
10. Build와 자동 테스트를 통과한다.
11. 개발 서버 및 Production Preview에서 실제 메뉴가 표시된다.

### 조건부 Gate

`CONDITIONAL_INTEGRATION_B1_REWORK_REQUIRED`

메뉴·상태 동기화·레이아웃 등에 문제가 남았을 때 적용한다.

### 차단 Gate

`BLOCKED_R5_BOTTOM_NAVIGATION`

기존 런타임 구조와 충돌해 메뉴를 안전하게 통합할 수 없을 때 적용한다.

**Human 승인 전 Integration C를 시작하지 않는다.**

## 15. Git 및 최종 완료 보고

현재 `design/world-layout-recovery-r5` 브랜치에서 관련 변경만 Commit & Push한다.

완료 보고 형식:

**TASK_ID:** R5-INTEGRATION-B1-DESTINATION-NAV-RESTORE

**HEAD:**  
**BRANCH:**  
**PUSH:**

**BOTTOM NAVIGATION**
- Five buttons:
- Visual compatibility:
- Offscreen destination selection:
- Desktop layout:
- Responsive layout:

**DESTINATION UX**
- POI mapping:
- Marker synchronization:
- Route selection:
- Route guide ON/OFF:
- Arrival state:
- Keyboard override:

**REGRESSION**
- Workshop → Hall:
- R4 Runtime:
- Default World:
- Hybrid Pilot:
- Approved assets:

**TESTS**
- Typecheck:
- Build:
- Automated tests:
- Browser QA:
- Production Preview:
- Actual arrival verification:
- Console errors:

**SCOPE**
- Candidate B modified: NO
- R4 source modified: NO
- Content pages modified: NO
- Main merged: NO
- Production deployed: NO

**GATE:**

### 최종 원칙

이번 작업은 새로운 디자인이나 기능을 발명하는 단계가 아니다.

**사용자가 기존 Pilot에서 사용하던 하단 목적지 메뉴를 정식 R5 Runtime에 복원하고, 이미 구현된 캐릭터 이동·경로 탐색과 정확히 연결하는 것이 목표다.**

실제 플레이 및 Human 검증 전에는 전체 Integration B 완료 또는 Integration C 진행을 선언하지 않는다.