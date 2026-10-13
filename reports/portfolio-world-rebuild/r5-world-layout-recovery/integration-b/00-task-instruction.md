# Codex 테라 High — R5 Integration B 작업 지시서

## 1. 작업 기본 정보

**TASK ID:** `R5-INTEGRATION-B-NAVIGATION-DESTINATION-UX`

**작업명:** R5 정식 Runtime의 캐릭터 이동·A* 경로 탐색·목적지 UX 통합

- Repository: `C:\Users\hyun0\MyPage`
- Branch: `design/world-layout-recovery-r5`
- 시작 HEAD: `6e647ae49b7e27685257aa5d2a4583c6f7994f33`
- 실행 AI: Codex 테라 High
- 승인 범위: **Integration B만**
- 기준 Runtime: Integration A `R5WorldScene`
- 원본 Pilot: `r5-hybrid-pilot.html`

**금지:** `main` 병합, GitHub Pages 실제 배포, Integration C 선행 구현.

이번 지시서의 전체 원문을 다음 파일에 저장한다.

`reports/portfolio-world-rebuild/r5-world-layout-recovery/integration-b/00-task-instruction.md`

요약본이 아닌 전체 원문을 보존한다.

---

## 2. 작업 목적

Integration A에서 완성한 R5 정식 Runtime 진입 구조에, Hybrid Pilot에서 사용자 플레이 검증을 통과한 기능을 이식한다.

이번 단계의 최종 결과는 다음과 같아야 한다.

1. 캐릭터가 방향키와 WASD로 움직인다.
2. 마우스로 지면이나 목적지를 클릭하면 자동으로 이동한다.
3. 실제 보행로를 따라 A* 경로를 탐색한다.
4. 바다·절벽·건물을 통과하지 않는다.
5. 네 개 목적지의 Marker와 설명이 표시된다.
6. 목적지 선택 시 경로 안내가 표시된다.
7. 실제 도착 후 장소명과 방문 가능 상태가 표시된다.
8. 기존 Pilot에서 승인된 캐릭터 외형과 걷기 모션을 유지한다.
9. 기존 R4 Runtime과 Hybrid Pilot이 그대로 작동한다.

**가장 중요한 추가 조건: Workshop → Hall 자동 이동 중단 문제를 재현하고 해결해야 한다.**

Integration B는 정식 콘텐츠 페이지 연결과 실제 배포를 포함하지 않는다. 이는 Integration C의 범위다.

---

## 3. 승인된 Baseline 고정

### 월드 및 카메라

| 항목 | 고정값 |
|---|---|
| Design | Candidate B — Organic Coastal Harbor |
| World Size | 1280×720 |
| Logical Viewport | 1024×576 |
| Camera Zoom | 1.25 |
| Player Frame | 28×56 |
| Collision Body | 28×16 |
| Ground Anchor | Bottom-center |
| Movement Speed | 170 world px/s |
| A* Grid | 8 world px |
| Collision Segment Sweep | 2 world px |

### 승인된 캐릭터 자산

```text
idle-front-v3.png
idle-back-v3.png
idle-side-v3.png

walk-front-v3.png
walk-back-v3.png
walk-side-v2.png
```

일반 플레이 애니메이션 기준:

- FRONT: 8 frames / 16fps
- BACK: 8 frames / 16fps
- SIDE: 8 frames / 20fps
- 우측 이동은 기존 Side FlipX 정책 유지

사용자가 직접 승인한 캐릭터의 체형·걸음걸이·프레임 비율을 변경하지 않는다.

### 네 방문 공간

| ID | 목적지 | 도착 좌표 | 콘텐츠 매핑 |
|---|---|---|---|
| hall | Exhibition Hall | (175, 190) | teaching.html |
| workshop | Workshop | (245, 440) | making.html |
| archive | Harbor Archive | (180, 560) | gallery.html |
| hero | Hero Ship | (1020, 364) | career.html |

`visualAnchor`, `navigationTarget`, `interactionRange`는 각각 다른 의미의 데이터로 유지한다.

Hero Ship은 Boarding Threshold까지만 접근한다.

오른쪽 Future Expansion Reserve에 다섯 번째 POI나 신규 보행 영역을 만들지 않는다.

---

## 4. Task A — Hybrid Pilot의 실행 구조 분리

### 현재 구조

```text
portfolio-world/
  src/
    main.ts
    scenes/
      BootScene.ts
      R5WorldScene.ts

    prototypes/
      r5-hybrid/
        hybridPilot.ts
        hybridCollision.ts
        hybridNavigation.ts
```

현재 `hybridPilot.ts`에는 다음 내용이 혼재되어 있다.

- Phaser Scene
- 별도의 Phaser.Game 생성
- DOM UI 참조
- 전역 이벤트 등록
- 캐릭터 이동
- 경로 탐색 호출
- 목적지 상태
- 콘텐츠 패널
- QA 기능

이 파일을 통째로 정식 Runtime에 import하지 않는다.

특히 하단에 존재하는 별도의 `new Phaser.Game()` 호출을 정식 Runtime으로 가져오지 않는다.

### 권장 분리 구조

```text
src/world/r5/
  r5WorldContract.ts
  r5PoiContract.ts
  r5NavigationController.ts
  r5PlayerController.ts
  r5DestinationUI.ts
  r5RouteGuide.ts
```

기존 구조에 맞게 이름과 위치를 조정할 수 있다.

단, 다음 원칙을 적용한다.

1. 순수 데이터와 경로 탐색 로직은 가능하면 그대로 재사용한다.
2. Runtime Scene의 입력·카메라·Lifecycle은 별도로 관리한다.
3. DOM UI를 모듈 import 시점에 조회하거나 조작하지 않는다.
4. HTML 이벤트 리스너를 Scene 시작과 종료에 맞춰 등록·해제한다.
5. Pilot과 Runtime이 동일 기능을 서로 다르게 구현해 장기적으로 불일치하는 구조를 피한다.

**불필요한 대규모 리팩터링은 금지한다.**

기존 Pilot의 동작과 승인된 기능을 먼저 보존한다.

---

## 5. Task B — 캐릭터 이동 및 애니메이션 통합

기존 `R5WorldScene`은 정지 캐릭터만 표시한다.

이를 실제 이동 가능한 캐릭터로 전환한다.

### 수동 이동

지원 입력:

- WASD
- 방향키
- 대각선 이동
- 이동 후 Idle 전환

반드시 승인된 V3/V2 캐릭터 애니메이션을 사용한다.

### 자동 이동

마우스로 지면을 클릭하면:

1. 화면 좌표를 월드 좌표로 변환한다.
2. 이동 가능한 지면인지 확인한다.
3. 현재 위치에서 목적지까지 안전한 경로를 계산한다.
4. 캐릭터가 경로를 따라 이동한다.
5. 도착 시 정지한다.

이동 중 방향키를 누르면 자동 이동을 취소하고 수동 이동으로 전환한다.

자동 이동 중 다시 클릭하면 기존 이동을 취소하고 새 경로를 계산한다.

### 필수 조건

- 기존 이동 속도 170px/s 유지
- Camera Zoom 1.25 유지
- 이동 중 방향에 맞는 Walk 애니메이션 사용
- 정지 시 해당 방향 Idle 사용
- 캐릭터 크기 변화 금지
- 캐릭터의 발 접점 유지
- 카메라 Bounds 이탈 금지

현재 만족스러운 걷기 모션을 새로 제작하지 않는다.

---

## 6. Task C — A* 경로 탐색 및 충돌 통합

### 재사용 대상

```text
hybridCollision.ts
hybridNavigation.ts
```

다음 기존 동작을 최대한 그대로 사용한다.

- Walkable Polygon
- Collision Footprint
- 28×16 Feet Body
- 2px Swept Segment Validation
- A* 8px Grid
- Path Smoothing
- Unreachable Target 처리

**충돌을 통과시키기 위해 Walkable 영역을 임의로 확장하는 것은 금지한다.**

### C-1. Workshop → Hall 오류 재현

Integration Human Gate에서 실제 다음 오류가 보고됐다.

```text
Route:
Workshop → Exhibition Hall

Observed Stop:
(160, 358)

Message:
Route blocked — no unsafe shortcut used
```

이 오류는 Integration B의 P0 작업이다.

수정 전에 다음을 확인한다.

1. A*가 생성한 전체 Waypoint 목록
2. 이동 실패 직전 캐릭터의 실제 좌표
3. 실패한 이동 Segment
4. 해당 Segment의 충돌 판정
5. 보행 Polygon 간 실제 연결 상태
6. Grid 정렬 과정에서 유효 영역을 벗어나는지
7. Path Smoothing 후 실제 이동 가능성이 유지되는지
8. Waypoint 도착 판정과 이동 속도의 관계
9. `delta` 시간과 다음 프레임 이동량의 관계

현재 Pilot은 한 프레임의 이동 벡터를 구한 뒤 `canOccupyFeet`와 `isMovementSegmentSafe`를 검사한다.

경로 탐색 단계에서는 유효했지만 실제 플레이 단계에서 멈추는 현상인지 우선 구분한다.

**단순히 충돌 검사를 해제하거나 이동 좌표를 강제로 변경해서 해결하지 않는다.**

### C-2. 수정 우선순위

첫째, 실제 경로의 Segment 유효성을 확인한다.

둘째, Waypoint 도착 처리와 실제 이동 스텝이 일치하는지 점검한다.

셋째, 필요한 경우 목표 지점까지의 남은 거리보다 이동 스텝이 큰 프레임에서 안전하게 정지하도록 처리한다.

넷째, Grid와 보행 Polygon의 정합성을 검증한다.

다섯째, 실제 디자인에 길이 존재하지 않는다면 이를 숨기지 않고 `LAYOUT_OR_NAVIGATION_BLOCKED`로 보고한다.

기존 C.1/C.2 원본은 수정하지 않는다.

Pilot 전용 보행 보정 데이터도 불가피한 사유와 Human 승인 없이 넓히지 않는다.

### C-3. 회귀 검증

다음 이동을 모두 실제로 수행한다.

- Workshop → Hall
- Workshop → Archive
- Workshop → Hero Ship
- Hall → Workshop
- Hall → Archive
- Archive → Hero Ship
- Hero Ship → Workshop

목적지까지 도달했는지 실제 캐릭터 좌표와 도착 이벤트를 기준으로 검증한다.

경로 계산 성공만으로 PASS 처리하지 않는다.

경로가 차단되면 지름길로 순간 이동하지 않고 실패 원인을 기록한다.

---

## 7. Task D — 네 목적지 Marker 통합

기존 Pilot에서 사용자 승인을 받은 Marker 디자인을 그대로 사용한다.

### 표시 대상

**Exhibition Hall**
- 전시관
- AX 강의와 교육 프로그램

**Workshop**
- 작업실
- AI 활용 및 제작 결과물

**Harbor Archive**
- 아카이브
- AI·AX 개념과 교육 콘텐츠

**Hero Ship**
- 히어로십
- 경력과 전문성의 여정

각 Marker는 실제 월드의 `visualAnchor`를 가리켜야 한다.

### 상태

- 기본
- Hover / Focus
- 선택
- 이동 중
- 도착

기존 Pilot의 시각 스타일을 유지한다.

Marker를 클릭하면 대응하는 `navigationTarget`으로 경로 탐색을 시작한다.

**Marker를 클릭했을 때 실제 배경 클릭이 중복 발생하면 FAIL이다.**

### 카메라 동기화

카메라 이동과 줌에 따라 Marker 위치를 갱신한다.

반드시 Phaser의 실제 Canvas 화면 위치와 DOM 레이어의 좌표 변환을 고려한다.

특히 CSS로 Canvas가 축소된 상태에서도 Marker가 다른 건물을 가리키면 안 된다.

---

## 8. Task E — 경로 가이드와 목적지 도착 상태

기존 Pilot에서 사용자가 만족한 노란 점선 가이드를 유지한다.

### 경로 안내

- 목적지 선택 시 표시
- 현재 캐릭터 위치에 따라 갱신
- 실제 보행 경로 위에만 표시
- 도착 또는 취소 시 정리
- 사용자가 ON/OFF 가능

Debug Polygon을 Normal Mode에 표시하지 않는다.

### 도착 판정

다음 상태를 정확하게 처리한다.

```text
IDLE
ROUTE_SELECTED
MOVING
ARRIVED
BLOCKED
CANCELLED
```

필요하면 구현 내부 상태명은 조정할 수 있다.

다만 상태 변경은 화면과 일치해야 한다.

- 이동 중인데 도착했다고 표시하지 않음
- 목적지에 도착했는데 계속 이동 중으로 표시하지 않음
- 경로가 막혔는데 성공으로 표시하지 않음

도착 후 장소명과 간단한 콘텐츠 설명을 표시한다.

**이번 Integration B에서는 실제 HTML 콘텐츠를 열지 않는다.**

콘텐츠 진입 버튼은 Integration C 대기 상태임을 명시하거나 비활성화한다.

기존 Pilot의 콘텐츠 연결 기능은 유지한다.

---

## 9. Task F — DOM UI와 Phaser Lifecycle

기존 정식 Runtime의 DOM 구조에 맞춰 목적지 UI를 추가한다.

다음 조건을 반드시 만족한다.

1. R5 Scene에서만 목적지 UI가 보인다.
2. R4 Scene에는 R5 UI가 나타나지 않는다.
3. Scene이 종료되면 Marker와 이벤트 리스너가 제거된다.
4. 중복 진입해도 DOM 요소가 중복 생성되지 않는다.
5. 한 페이지에 Phaser Game 인스턴스가 하나만 존재한다.
6. Pointer 이벤트가 중복 처리되지 않는다.
7. 화면 크기 변경 시 Marker 위치가 갱신된다.
8. 키보드 Focus가 일반 플레이를 방해하지 않는다.
9. 터치 입력을 막는 구조가 새로 생기지 않는다.

특히 DOM UI가 Phaser Canvas 위에 놓일 때 Pointer Event 전달과 Canvas의 실제 좌표 변환을 검증한다.

모바일 최종 UX 검증은 Integration C에서 진행하지만, 이번 단계에서 기존 터치 가능 구조를 훼손해서는 안 된다.

---

## 10. Task G — 기존 Runtime 및 Pilot 보존

### R4 보존

다음 URL이 계속 정상 실행되어야 한다.

```text
/?canonical=4
```

기존 `CanonicalRuntimeR4Scene.ts` 파일을 수정하지 않는다.

### 기본 World 보존

다음 기본 진입도 유지한다.

```text
/
```

### 기존 Pilot 보존

```text
/r5-hybrid-pilot.html
```

Pilot의 이동·마커·콘텐츠 패널이 그대로 작동해야 한다.

### 신규 R5 Runtime

```text
/?r5=1
```

여기에서만 Integration B 기능이 적용돼야 한다.

실제 R5의 배경, 캐릭터, 기존 다섯 개 전경 레이어, 카메라 기준은 Integration A와 동일하게 유지한다.

---

## 11. Task H — 실제 브라우저 플레이 검증

**정적 테스트 및 코드 검사만으로 완료 처리하지 않는다.**

### 필수 시나리오

| ID | 시나리오 | 기대 결과 |
|---|---|---|
| T01 | R5 진입 | 4개 Marker 정상 표시 |
| T02 | 방향키 이동 | 자연스러운 캐릭터 이동 |
| T03 | 클릭 이동 | 안전한 A* 경로 수행 |
| T04 | Workshop → Hall | 중단 없이 실제 도착 |
| T05 | Workshop → Archive | 실제 도착 |
| T06 | Workshop → Hero | 부두·갱웨이를 따라 도착 |
| T07 | Hall → Workshop | 실제 도착 |
| T08 | Archive → Hero | 실제 도착 |
| T09 | 바다 클릭 | 잘못된 이동 차단 |
| T10 | 장애물 클릭 | 이동 거부 |
| T11 | 자동 이동 중 키보드 | 수동 조작 전환 |
| T12 | 목적지 변경 | 새 경로 계산 |
| T13 | Marker 선택 | 중복 클릭 이벤트 없음 |
| T14 | 화면 크기 변경 | Marker와 월드 위치 일치 |
| T15 | R4 URL | 정상 실행 |
| T16 | Pilot URL | 기존 기능 정상 |
| T17 | Production Preview | R5 이동·Marker 정상 동작 |

### 검증 방법

가능하면 실제 Chrome 기반 자동화를 사용한다.

각 시나리오에 대해 다음 자료를 기록한다.

- 시작 좌표
- 목적지 좌표
- 실제 도착 좌표
- 계산된 경로
- 중간 충돌 여부
- 소요 시간
- 최종 결과
- 브라우저 오류
- 캡처 또는 영상

**목적지에 순간 이동시킨 뒤 도착했다고 보고하면 FAIL이다.**

검증 중 캐릭터가 실제로 이동한 프레임을 확보한다.

특히 Workshop → Hall은 실패 직전 좌표를 포함한 Before / After 검증을 제출한다.

---

## 12. Task I — 개발 및 Production Preview

Windows에서 개발 서버 기본 포트 5173과 5174는 사용자의 환경에서 `EACCES`가 발생한 기록이 있다.

반면 30080에서는 정상 실행이 확인됐다.

따라서 개발 서버는 다음 명령을 우선 사용한다.

```powershell
cd C:\Users\hyun0\MyPage\portfolio-world

npm run dev -- --host 127.0.0.1 --port 30080 --strictPort
```

신규 R5 Runtime 검증 주소:

`http://127.0.0.1:30080/?r5=1`

기존 Pilot 검증 주소:

`http://127.0.0.1:30080/r5-hybrid-pilot.html`

30080 포트가 이미 사용 중이면 실행 중인 관련 서버를 확인하고, 임의로 종료하지 않는다. 필요하면 다른 사용 가능한 포트를 선택하여 실제 주소를 보고한다.

### Production Preview

빌드 후 별도 Preview 프로세스로 검증한다.

```powershell
npm run build

npm run preview -- --host 127.0.0.1 --port 30081 --strictPort
```

이 포트 역시 사용할 수 없으면 다른 포트를 선택한다.

실제 표시된 URL을 기준으로 `/MyPage/world/?r5=1`을 확인한다.

Production Preview에서 자산, 캐릭터 이동, Marker 및 경로 가이드가 모두 동작해야 한다.

**개발 서버에서만 정상인 상태는 완료가 아니다.**

---

## 13. 자동 테스트 및 QA

다음 명령을 실행한다.

```powershell
npm run typecheck
npm run build
npm test
```

추가로 필요한 테스트:

- R5 Scene 진입 및 Lifecycle
- 승인 자산 해시 유지
- 단일 Phaser Game
- 기존 R4 URL 우선순위
- 보행 영역 및 충돌
- A* 경로 반환
- 실제 이동 Segment 안전성
- Waypoint 도착 판정
- 목적지별 자동 이동 완료
- 수동 이동에 의한 자동 이동 취소
- Marker 카메라 좌표 변환
- DOM 중복 생성 방지
- Scene 종료 후 이벤트 정리
- Production Base Asset URL
- R4 / Pilot 회귀

**자동 테스트 통과와 실제 브라우저 플레이 통과를 별도 보고한다.**

---

## 14. 필수 산출물

저장 경로:

```text
reports/portfolio-world-rebuild/
  r5-world-layout-recovery/
    integration-b/
```

### 문서

```text
00-task-instruction.md
01-pilot-to-runtime-transfer-plan.md
02-navigation-controller-integration.md
03-workshop-hall-route-root-cause.md
04-workshop-hall-route-fix.md
05-poi-marker-integration.md
06-route-guidance-and-arrival-states.md
07-phaser-dom-lifecycle-review.md
08-browser-route-test-results.md
09-r4-and-pilot-regression.md
10-production-preview-qa.md
11-remaining-integration-c-items.md
12-final-human-gate.md
```

### 이미지

```text
13-r5-runtime-four-markers.png
14-workshop-hall-route-before-after.png
15-workshop-archive-route.png
16-workshop-hero-route.png
17-hall-arrival.png
18-normal-mode-navigation.png
19-debug-pathfinding.png
20-production-preview-r5.png
21-final-human-review-board.png
```

### 실제 브라우저 동작 증거

```text
motion-evidence/
  workshop-hall.mp4
  workshop-archive.mp4
  workshop-hero.mp4
  manual-override.mp4
  marker-selection.mp4
```

다중 프레임 GIF를 사용할 수 있지만 실제 Phaser 브라우저 플레이 영상이어야 한다.

증거 파일에는 검증한 URL, Scene, 시작·도착 좌표, 실제 이동 여부를 식별할 수 있는 기록을 함께 제출한다.

### 상태 데이터

`data/portfolio-world/r5-integration-b-navigation-draft.json`

포함 항목:

- Integration A Baseline
- Approved Assets
- Navigation Implementation
- Collision Contract
- Workshop–Hall Root Cause
- Route Fix
- Four POIs
- Marker Anchors
- Arrival States
- Browser Tests
- Production Preview
- Pilot Regression
- R4 Regression
- Remaining Issues
- Human Gate

---

## 15. 변경 금지 범위

이번 작업에서는 다음을 변경하지 않는다.

- Candidate B 원본 이미지
- 승인된 캐릭터·걷기 자산
- 카메라 Zoom 1.25
- 오른쪽 Future Expansion Reserve
- 네 개 목적지 구성
- POI 콘텐츠 매핑
- 기존 R4 Scene
- 기존 HTML 콘텐츠
- 신규 건축물·선박·장식
- 정식 배포 경로
- `main` 브랜치

A* 경로 오류를 해결하더라도 승인된 보행로를 임의로 확장하거나 바다 위 경로를 새로 만들지 않는다.

Integration C의 콘텐츠 URL 수정, Android 실기기 검증, GitHub Pages 배포 작업은 수행하지 않는다.

---

## 16. Human Gate 및 성공 조건

### Gate: `READY_FOR_R5_INTEGRATION_B_HUMAN_PLAYTEST`

다음 조건을 모두 만족할 때만 선언한다.

1. R5 Runtime에서 캐릭터가 정상적으로 움직인다.
2. 승인된 상하좌우 걷기 모션과 비율이 유지된다.
3. 클릭 A* 이동이 정상 작동한다.
4. Workshop → Hall 중단 문제가 해결됐다.
5. 네 목적지에 안전하게 도달할 수 있다.
6. Hero Ship 경로가 기존 부두와 갱웨이를 따른다.
7. 네 개 Marker와 설명이 정상 표시된다.
8. 경로 안내가 실제 이동 경로와 일치한다.
9. 목적지 도착 상태가 정상 갱신된다.
10. R4와 기존 Pilot이 보존된다.
11. 개발 서버와 Production Preview 모두 정상 동작한다.
12. 실제 브라우저 이동 영상과 테스트 결과가 존재한다.

### 다른 Gate

`CONDITIONAL_INTEGRATION_B_REWORK_REQUIRED`

- 일부 경로 또는 UI 문제가 남아 있음
- 사용자 검증 전 추가 수정 필요

`BLOCKED_R5_NAVIGATION_INTEGRATION`

- 승인된 보행 공간만으로 필수 경로를 구현할 수 없음
- Runtime 통합 과정에서 중요한 구조적 장애 확인

**Workshop → Hall 경로가 여전히 막힌 상태라면 READY 선언 금지.**

---

## 17. Git 및 완료 보고

작업은 현재 R5 브랜치에서만 진행한다.

시작 전 HEAD와 Working Tree를 확인한다.

기존 미커밋 변경은 삭제하거나 초기화하지 않는다.

작업 완료 후 관련 변경만 Commit & Push한다.

최종 보고 형식:

```text
TASK_ID: R5-INTEGRATION-B-NAVIGATION-DESTINATION-UX

HEAD:
BRANCH:
PUSH:

RUNTIME:
- Scene:
- Development URL:
- Production Preview URL:
- Phaser Game count:
- DOM Lifecycle:

PLAYER:
- Front/Back V3:
- Side V2:
- Idle/Walk:
- Movement speed:
- Ground contact:

NAVIGATION:
- A* integration:
- Collision:
- Path smoothing:
- Mouse click:
- Keyboard override:

WORKSHOP-HALL ROOT CAUSE:
- Reproduction:
- Stop coordinate:
- Failure reason:
- Fix:
- Actual browser result:

FOUR POI ROUTES:
- Workshop → Hall:
- Workshop → Archive:
- Workshop → Hero:
- Hall → Workshop:
- Hall → Archive:
- Archive → Hero:
- Hero → Workshop:

DESTINATION UX:
- Four Markers:
- Labels:
- Route Guide:
- Arrival State:
- Camera Projection:

BROWSER QA:
- Dev:
- Production Preview:
- Actual movement recordings:
- Console errors:

REGRESSION:
- R4:
- Default World:
- Hybrid Pilot:
- Approved assets:

TESTS:
- Typecheck:
- Build:
- Automated:
- Browser:

DEFERRED TO C:
- Content URLs:
- New-tab / Return:
- Android QA:
- GitHub Pages Deployment:

R4 RUNTIME MODIFIED: NO
CANDIDATE B MODIFIED: NO
MAIN MERGED: NO
PRODUCTION DEPLOYED: NO

GATE:
```

**최종 원칙:** Integration B는 승인된 Hybrid Pilot의 탐색 경험을 정식 R5 Runtime에 옮기는 단계다. 새로운 기능을 많이 만드는 것보다 기존에 만족했던 캐릭터·길 찾기·목적지 안내를 손상 없이 이전하고, Workshop → Hall 경로 오류를 실제 플레이에서 해결하는 것이 성공 기준이다.

Human의 직접 플레이 승인 전에는 Integration C를 자동 시작하지 않는다.