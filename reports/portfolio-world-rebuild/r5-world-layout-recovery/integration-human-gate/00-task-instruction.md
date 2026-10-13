Codex 5.6 High — R5 통합 Human Gate 작업 지시서
TASK ID: R5-FINAL-INTEGRATION-READINESS-GATE
Repository: C:\Users\hyun0\MyPage
Branch: design/world-layout-recovery-r5
시작 HEAD: b4e67948d1c12b46784441cc752d1fad3c2bdb04
작업 성격: 통합 준비 검증 / 승인 기준 고정 / 구조 분석 / 통합 계획 수립
이번 단계에서는 정식 R5 Runtime을 구현하거나 main 브랜치에 병합하지 않는다.

1. 작업 목표
R5 Hybrid Pilot에서 검증된 디자인·캐릭터·탐색·콘텐츠 UX를 기준으로, 실제 포트폴리오 World Runtime에 통합 가능한지 판단한다.
다음 네 가지를 완료한다.
1. 사용자 승인 기능과 자산을 재현 가능한 기준으로 고정한다.
2. Pilot과 기존 정식 Runtime의 차이를 분석한다.
3. 통합 과정에서 발생할 수 있는 기술·디자인·배포 문제를 사전에 확인한다.
4. 다음 단계에서 Codex가 실행할 정식 통합 작업의 범위와 순서를 확정한다.
이번 작업은 새로운 디자인 제작이나 기능 추가가 아니라, 성공한 Pilot을 안전하게 실제 서비스로 전환하기 위한 Gate다.
2. 사용자 승인 사항
다음은 Human이 실제 플레이 후 수용한 항목이다.
항목	고정 기준
월드 디자인	Candidate B — Organic Coastal Harbor
캐릭터	E.2.4.2 Front/Back V3 및 Side 개선 버전
걷기	상하좌우 움직임과 방향별 체형 수용
이동	클릭 A* + WASD/방향키
Hero Ship 경로	부두·갱웨이로 안전하게 접근
길 안내	선택 목적지 경로 표시
목적지 UX	네 곳의 Marker와 설명
콘텐츠	목적지 도착 후 방문 패널
카메라	1024×576, Zoom 1.25
오른쪽 공간	Future Expansion Reserve 유지
이 항목들은 새로운 후보를 생성하거나 불필요하게 수정하지 않는다.
다만 이번 승인 기록은 Pilot의 사용자 경험을 수용했다는 의미이며, 배포용 자산 전체의 기술적 승인까지 자동으로 의미하지 않는다.
콘텐츠 매핑 고정
방문 공간	연결 페이지
Exhibition Hall	teaching.html
Workshop	making.html
Harbor Archive	gallery.html
Hero Ship	career.html
방문 지점은 정확히 4개다.
Hero Ship은 Boarding Threshold까지만 접근한다.

3. Task A — Approved Pilot Baseline 고정
현재 E.2.4.2 Pilot을 정식 통합의 기준 버전으로 기록한다.
필수 작업:
- 캐릭터 Idle/Walk 자산 목록 및 SHA-256 기록
- 실제 선택된 기본 애니메이션 FPS 확인
- QA 전용 프리셋과 일반 플레이 설정 구분
- 충돌·경로 탐색 데이터 버전 기록
- 목적지 좌표 및 콘텐츠 매핑 고정
- Scenic Plate 및 전경 자산 해시 기록
- Pilot의 정상 실행 명령 기록
특히 E.2.4.2에서 Human이 승인한 실제 기본 실행 버전을 기준으로 한다.
개발용 QA 파라미터나 실험 설정을 임의로 최종값으로 승격하지 않는다.
승인 상태 기록
E.2.4.2 문서에는 기술적으로 Human Gate 대기 상태가 남아 있다.
이번 작업에서는 최근 사용자 피드백을 근거로 캐릭터 표현의 수용 사실을 기록한다.
단, 실제 플레이 수용과 정식 Runtime 승인 상태를 구분한다.

4. Task B — Pilot과 기존 Runtime 구조 차이 분석
분석 대상:
portfolio-world/src/main.ts
portfolio-world/src/config/gameConfig.ts
portfolio-world/src/scenes/
portfolio-world/src/prototypes/r5-hybrid/
portfolio-world/r5-hybrid-pilot.html
portfolio-world/index.html
portfolio-world/vite.config.ts


현재 기존 정식 World는 R4 Canonical Scene을 유지하고, R5는 별도 HTML에서 실행되는 독립 Pilot이다.
따라서 단순히 Pilot Scene을 기존 Runtime에 복사하는 것으로 끝내면 안 된다.
필수 분석
1. Phaser 실행 구조
- 현재 Scene 진입 방식
- BootScene과 자산 로딩
- R4 Scene 선택 방식
- R5를 안전하게 진입시키는 방법
- 기존 R4 실행 기능을 유지할 방법
2. 월드 좌표 계약
- R4의 월드 좌표 및 크기
- R5 Candidate B의 1280×720 검증 좌표
- Pilot 보행 영역
- 카메라 경계 및 Zoom
- 캐릭터 충돌 Body
R4의 1920×1080 좌표나 기존 Anchor를 R5에 그대로 적용하지 않는다.
3. UI 구성
현재 Pilot은 Phaser Canvas와 HTML UI를 함께 사용한다.
분석할 항목:
- Destination Marker
- 콘텐츠 방문 패널
- 경로 안내
- Debug Mode
- 키보드·마우스 입력
- 모바일 반응형 UI
정식 통합에서도 Phaser와 DOM UI 사이의 위치 동기화가 유지되어야 한다.
4. 파일·모듈 의존성
- Pilot 전용 자산
- R4에서 재사용 가능한 자산
- 독립 유지해야 하는 모듈
- 중복 가능성이 있는 로직
- 불필요한 QA 코드
기존 사용자 경험을 변경하지 않는 범위에서 정리 방안을 제안한다.

5. Task C — 배포 구조 및 URL 검증
이번 Gate의 중요 검증 항목이다.
현재 Vite 설정은 Production Build의 기본 경로를 다음과 같이 사용한다.
/MyPage/world/
반면 현재 R5 Pilot은 별도 HTML 엔트리이며 개발 서버에서 실행된다.
따라서 다음 문제를 반드시 검토한다.
C-1. R5 배포 엔트리
- 현재 vite build 결과에 R5 Pilot의 실행 코드가 포함되는가?
- R5가 정식 Runtime에 들어갈 때 별도 HTML이 필요한가?
- 기존 world/ 진입점에 Scene으로 통합하는 방식이 적합한가?
- 기존 R4 URL을 유지하면서 R5를 검증할 수 있는가?
- GitHub Pages에서 자산 경로가 올바르게 계산되는가?
개발 서버에서 정상 실행된다는 사실만으로 배포 가능 판정 금지.
C-2. 콘텐츠 링크 경로
현재 Pilot에서는 콘텐츠 URL을 상대 경로로 생성한다.
new URL(candidate.content, window.location.href)


정식 World가 /MyPage/world/ 아래에서 실행되는 경우, 기존 최상위 포트폴리오 페이지로 연결하는 경로가 달라질 수 있다.
다음 네 콘텐츠 경로를 실제 배포 구조 기준으로 검증한다.
- /MyPage/teaching.html
- /MyPage/making.html
- /MyPage/gallery.html
- /MyPage/career.html
기존 콘텐츠 페이지 파일을 이동하거나 변경하지 않는다.
로컬과 GitHub Pages의 URL 해석 차이를 분석하고 안전한 해결 방안을 제시한다.
C-3. 배포 안전성
- 기존 홈페이지 정상 유지
- 기존 World 접근 가능
- R4 Regression 유지
- R5 검증용 진입점 분리 가능
- 문제 발생 시 이전 버전으로 복귀 가능
이번 Gate에서 실제 배포를 변경하지 않는다.

6. Task D — 디자인·플레이 종합 QA
새 자산을 만들지 않고 승인된 Pilot을 검증한다.
검증 시나리오
ID	검증 항목	기대 결과
T01	첫 진입	항구와 네 목적지를 인식
T02	캐릭터 좌우 이동	체형과 걷기 자연스러움
T03	캐릭터 상하 이동	체형과 걷기 자연스러움
T04	클릭 이동	경로를 따라 정상 이동
T05	키보드 전환	자동 이동 정상 취소
T06	Hall 방문	teaching.html 연결
T07	Workshop 방문	making.html 연결
T08	Archive 방문	gallery.html 연결
T09	Hero Ship 방문	career.html 연결
T10	콘텐츠 복귀	기존 캐릭터 위치 유지
T11	해안 및 수면	바다·절벽 통과 없음
T12	목적지 가독성	Marker와 설명 정상
T13	오른쪽 예약 공간	신규 건물·POI 없음
T14	R4 Regression	기존 실행 상태 유지
남은 결함 처리
기존 E.2.3에서 ART_OCCLUSION_REQUIRED로 보고했던 해안 석벽 가림은 별도 미해결 사항으로 기록한다.
사용자가 현재 가림 수준을 수용했으므로, 이번 단계에서 아트 추출 작업을 재개하지 않는다.
다만 해당 결함이 실제 방문 경로에서 캐릭터를 심하게 가리거나 통과시키는 경우에는 배포 전 해결이 필요한 Major 또는 Blocker로 분류한다.
사용자 수용 사실을 근거로 기술적 결함을 숨기지 않는다.

7. Task E — 실제 포트폴리오 관점 UX 점검
현재 Pilot은 게임 검증 화면이다.
정식 포트폴리오로 통합할 때 다음 사항을 확인해야 한다.
E-1. 사용자 진입
사용자가 홈페이지에서 World에 진입했을 때:
- 무엇을 탐험하는 공간인지 이해하는가?
- 네 목적지를 쉽게 발견하는가?
- 마우스로 클릭할 수 있다는 사실을 아는가?
- 게임을 하지 않고도 기존 콘텐츠에 접근할 수 있는가?
E-2. 콘텐츠 방문 및 복귀
현재 새 탭 방식은 유효한 Pilot 후보이다.
그러나 정식 서비스에서는 다음을 비교한다.
방식	검토 기준
새 탭	월드 상태 보존, 탭 증가
같은 탭	탐색 흐름, 복귀 상태 관리
게임 내 Overlay	몰입감, 콘텐츠 표시·유지보수 비용
이번 Gate에서는 구현 방식을 최종 확정하지 않는다.
실제 구현 난이도와 포트폴리오 사용자 경험을 비교해 권고안을 제출한다.
현재 새 탭 동작은 유지한다.
E-3. 모바일
모바일에서는 키보드가 없으므로 클릭·터치 자동 이동이 중요하다.
검토:
- 목적지 Marker 터치
- 터치 이동
- 콘텐츠 패널
- 반응형 크기
- 화면 가림
- 복귀 흐름
- Android 실기기 검증 필요 여부
브라우저 시뮬레이션 통과와 실제 Android 사용성 통과를 구분한다.

8. Task F — 정식 통합 아키텍처 제안
이번 Gate의 핵심 산출물이다.
다음 두 접근을 비교한다.
Option A — 기존 Runtime 내부에 R5 Scene 통합
현재 World 실행 구조를 유지하고 R5를 새 Scene으로 추가한다.
검토 항목:
- 기존 R4 보존
- R5 진입 경로
- Phaser 설정 재사용
- 자산과 UI 통합
- 빌드 및 배포
Option B — Hybrid Pilot을 별도 World 실행 구조로 승격
현재 Pilot 실행 구조를 정식 배포 가능한 형태로 발전시킨다.
검토 항목:
- 기존 홈페이지와 연결
- 별도 엔트리 유지 비용
- 자산·상태 관리
- 배포 경로
- 향후 확장성
비교 기준
- 현재 승인된 사용자 경험 보존
- 변경 파일 수와 영향 범위
- 기존 R4 회귀 위험
- 배포 안정성
- 유지보수성
- 향후 콘텐츠 확장성
- 오른쪽 Reserve 활용 가능성
추천안 하나를 선정하되 실제 구현은 하지 않는다.
추천 이유와 대안의 단점을 구체적인 코드 및 배포 구조로 설명한다.

9. Task G — 단계별 통합 계획 수립
다음 정식 구현 작업을 한 번에 대규모로 진행하지 않도록 계획을 나눈다.
권장 구조:
Integration A — Runtime Entry & Asset Integration
- R5 진입점
- 배경·캐릭터·전경 자산
- 카메라·월드 구성
- R4 보존
Integration B — Navigation & Destination UX
- A* 경로 탐색
- 이동·충돌
- 목적지 Marker
- UI 동기화
Integration C — Content & Deployment
- 콘텐츠 방문
- 복귀
- 모바일 대응
- GitHub Pages QA
단, 이 단계는 이번 작업에서 확정할 제안 구조이며 아직 구현 승인이 아니다.
각 Integration 단계에 다음 내용을 명시한다.
- 변경할 파일
- 재사용할 자산·모듈
- 테스트 방법
- 회귀 위험
- 완료 기준
- Human 확인 지점
- Rollback 방법

10. 필수 산출물
저장 경로:
reports/portfolio-world-rebuild/
  r5-world-layout-recovery/
    integration-human-gate/


문서
00-task-instruction.md
01-approved-pilot-baseline.md
02-pilot-vs-runtime-difference.md
03-runtime-architecture-options.md
04-content-routing-and-deployment.md
05-gameplay-regression-review.md
06-visual-and-ux-review.md
07-mobile-readiness-review.md
08-known-risks-and-deferred-items.md
09-integration-implementation-plan.md
10-human-gate-decision.md


00-task-instruction.md에는 이번 작업 지시서의 원문과 기준 HEAD, 승인 계약을 보존한다.
시각 증거
11-approved-world-overview.png
12-four-destination-flow.png
13-character-and-navigation-proof.png
14-content-open-return-flow.png
15-integration-human-review-board.png


기존 자료를 재사용할 수 있다.
단, 이전 단계의 정지 이미지만으로 현재 Runtime 동작 검증을 대체하지 않는다.
설계 데이터
data/portfolio-world/r5-integration-readiness-gate.json
필수 항목:
- Baseline Commit
- Approved Assets
- Approved User Experience
- Runtime Architecture Options
- Content Routing
- Deployment Risks
- Regression Tests
- Deferred Issues
- Integration Stages
- Human Decision Required

11. 검증 기준
다음을 실제 실행하고 기록한다.
cd C:\Users\hyun0\MyPage\portfolio-world

npm run typecheck
npm run build
npm test


추가로 기존 R4 실행 경로 및 R5 Pilot을 브라우저에서 검증한다.
검증이 불가능한 항목은 NOT_TESTED로 기록한다.
자동 테스트가 PASS했다고 해서 모바일 실기기나 배포 구조 검증까지 PASS로 기록하지 않는다.
통합 Gate 조건
다음이 확보되면 Gate 심의를 요청할 수 있다.
1. 승인된 R5 자산 및 UX 기준이 명확하다.
2. 현재 Pilot과 정식 Runtime의 차이가 정리됐다.
3. GitHub Pages 배포 방식과 콘텐츠 링크 경로에 대한 해결안이 존재한다.
4. 기존 R4에 대한 안전한 보존·복귀 계획이 있다.
5. 남은 시각·기술 결함이 명확하게 분류됐다.
6. 정식 통합 구현 순서와 테스트 계획이 마련됐다.
7. 사용자의 최종 결정이 필요한 사항이 구분됐다.

12. 변경 금지
이번 단계에서 다음 작업은 하지 않는다.
- Candidate B 재디자인
- 캐릭터 재제작
- 이동 로직 변경
- 콘텐츠 페이지 수정
- 신규 POI 추가
- 오른쪽 예약 공간 개발
- 기존 R4 Scene 수정
- main 병합
- GitHub Pages 실제 배포 변경
- 정식 R5 Scene 구현
분석 결과 위험이 발견되면 해결 방안을 제안하되, 승인 없이 개발 범위를 확장하지 않는다.

13. 완료 보고 형식
TASK_ID: R5-FINAL-INTEGRATION-READINESS-GATE

HEAD:
BRANCH:
PUSH:

APPROVED BASELINE:
- Candidate B:
- Character V3:
- Side Walk:
- Movement:
- POI / Content:
- Camera:
- Reserve:

ARCHITECTURE:
- Current Pilot:
- Current R4 Runtime:
- Differences:
- Recommended Integration Option:
- Reason:

DEPLOYMENT:
- Vite build:
- R5 entry:
- GitHub Pages paths:
- Content links:
- Rollback:

QUALITY:
- Gameplay:
- Character:
- Occlusion:
- Navigation:
- Content:
- Mobile:
- Remaining Blockers:

INTEGRATION PLAN:
- Stage A:
- Stage B:
- Stage C:

TESTS:
- Typecheck:
- Build:
- Automated tests:
- Browser QA:

R4 RUNTIME MODIFIED: NO
R5 FORMAL RUNTIME IMPLEMENTED: NO
MAIN MERGED: NO
PRODUCTION DEPLOYMENT CHANGED: NO

GATE:


최종 Gate 판정
- READY_FOR_R5_INTEGRATION_HUMAN_APPROVAL — 통합 구조와 작업 범위를 Human에게 승인 요청할 수 있음
- CONDITIONAL_INTEGRATION_READINESS — 일부 위험의 해결 방향이나 추가 검증 필요
- BLOCKED_R5_INTEGRATION — 현재 구조로 정식 통합하기 어려운 핵심 장애 존재
Codex가 READY를 선언하더라도 정식 Runtime 개발을 자동으로 시작하지 않는다.
Commit & Push 후 Human의 결정을 기다린다.