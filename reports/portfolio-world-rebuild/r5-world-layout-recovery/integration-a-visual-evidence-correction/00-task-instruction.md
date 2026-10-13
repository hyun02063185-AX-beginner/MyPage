Codex 테라 High — R5 Integration A 작업 지시서
TASK ID: R5-INTEGRATION-A-RUNTIME-ENTRY-ASSETS
작업명: R5 정식 Runtime 진입 구조 및 승인 자산 통합
항목	작업 기준
Repository	C:\Users\hyun0\MyPage
Branch	design/world-layout-recovery-r5
시작 HEAD	cd118b19769c2ae1d345707b7bf673de149a1a20
실행 모델	Codex 테라 High
채택 아키텍처	Option A — 기존 Runtime에 R5 Scene 추가
작업 권한	Integration A만 승인
main 병합·실제 배포	금지
1. 작업 목표
기존 Hybrid Pilot에서 사용자 검증을 통과한 R5 월드와 캐릭터를 실제 Portfolio World 실행 구조에 연결한다.
단, 이번 Integration A는 완전한 게임 기능 통합이 아니라 Runtime 진입점과 핵심 자산 통합 단계다.
작업 완료 후 다음이 가능해야 한다.
- 기존 World Runtime에서 R5 전용 Scene 실행
- Candidate B 월드가 정상 표시됨
- 승인된 캐릭터와 애니메이션 자산 로딩
- 전경 레이어와 카메라 설정 유지
- Production Build에서도 R5 Scene 실행
- R4 실행 경로 보존
- 기존 Hybrid Pilot 유지
클릭 이동, 목적지 Marker, 콘텐츠 방문 기능의 정식 통합은 Integration B/C에서 진행한다.

2. Human 승인 기준 보존
다음 사항은 변경하지 않는다.
영역	승인 기준
디자인	Candidate B — Organic Coastal Harbor
월드 이미지	1280×720 Scenic Plate
캐릭터	Front/Back V3, Side 개선 버전
캐릭터 논리 크기	28×56
충돌 Body	28×16
걷기 기본 설정	Side 20fps / Front·Back 16fps
이동 속도 기준	170px/s
논리 뷰포트	1024×576
카메라	Zoom 1.25
방문 지점	4개
오른쪽 공간	Future Expansion Reserve
기존 E.2.4.2 캐릭터 자산을 새로 만들거나 수정하지 않는다.
이전에 반복했던 선박·갱웨이 분리 작업을 재개하지 않는다.
3. Task A — 기존 실행 구조에 R5 Scene 등록
현재 구조:
portfolio-world/
  index.html
  src/
    main.ts
    config/gameConfig.ts
    scenes/
      BootScene.ts
      WorldScene.ts
      CanonicalRuntimeR4Scene.ts
    prototypes/
      r5-hybrid/
        hybridPilot.ts


이번에 새 정식 Scene을 추가한다.
권장 파일:
portfolio-world/src/scenes/R5WorldScene.ts
진입 방식
기존 R4 URL은 그대로 유지한다.
/MyPage/world/?canonical=4


R5는 별도의 명시적 선택값으로 실행한다.
/MyPage/world/?r5=1


진입 파라미터 이름은 프로젝트 전체 규칙을 검토해 조정할 수 있으나, 기존 canonical 계약과 충돌하면 안 된다.
구현 원칙
- main.ts에 R5 Scene 등록
- BootScene.ts에서 R5 선택 및 자산 로딩
- 기존 WorldScene / R1~R4 실행 유지
- Phaser Game 인스턴스는 하나만 생성
- 기존 R4 Scene 소스 수정 금지
- 기본 /MyPage/world/ 동작 변경 금지
- canonical=4와 r5=1이 동시에 전달되면 명확한 우선순위를 적용하고 테스트
hybridPilot.ts를 그대로 import하면 안 된다.
현재 파일 하단에서 별도의 new Phaser.Game()을 생성하고 HTML 이벤트를 등록하기 때문이다.
반드시 실행 부작용이 없는 모듈과 Scene을 분리한다.

4. Task B — R5 승인 자산 통합
기존 Pilot은 다음 자산을 사용한다.
월드
public/assets/r5-hybrid/
  candidate-b-scenic-plate.png


캐릭터
public/assets/r5-hybrid/pilot-player/
  idle-front-v3.png
  idle-back-v3.png
  idle-side-v3.png
  walk-front-v3.png
  walk-back-v3.png
  walk-side-v2.png


전경 레이어
public/assets/r5-hybrid/
  hall-stairs-retaining.png
  workshop-foreground.png
  archive-approach-foreground.png
  dock-piles.png
  gangway.png


위 자산의 원본 해시를 검증하고, 기존 Integration Human Gate에 기록된 SHA-256과 비교한다.
파일을 중복 복사할 필요가 없다면 기존 자산을 재사용한다.
R5 자산 Manifest
필요하면 다음 파일을 추가한다.
portfolio-world/src/world/r5RuntimeAssets.ts
이 Manifest에는 다음을 정의한다.
- Asset ID
- 실제 자산 경로
- Texture Key
- 이미지 크기
- 원본 해시
- Scene 내 배치 좌표
- 레이어 깊이
- 사용 목적
R4 자산 Key와 충돌하지 않도록 R5 전용 Key를 사용한다.

5. Task C — 자산 URL의 Production Base 대응
현재 Pilot에는 다음과 같은 절대 경로가 포함돼 있다.
"/assets/r5-hybrid/candidate-b-scenic-plate.png"


개발 서버에서는 동작하지만 GitHub Pages의 /MyPage/world/ 환경에서는 문제가 발생할 수 있다.
정식 R5 Runtime에서는 Vite의 import.meta.env.BASE_URL을 사용해 자산 경로를 처리한다.
검증 환경:
환경	R5 자산 경로 기준
로컬 개발	/assets/r5-hybrid/...
GitHub Pages 빌드	/MyPage/world/assets/r5-hybrid/...
다음을 확인한다.
1. 개발 서버에서 자산 로딩 성공
2. Production Build에 자산 포함
3. Vite Preview에서 로딩 성공
4. 상대 경로 오류 없음
5. 브라우저 콘솔에서 자산 404 없음
6. R4의 기존 자산 경로에 영향 없음
개발 서버에서 보인다는 이유만으로 Production Build 성공을 선언하지 않는다.

6. Task D — R5 Scene 기초 렌더링
이번 단계에서 R5 Scene은 다음 요소를 정상적으로 표시해야 한다.
- Candidate B 공통 배경
- 승인된 캐릭터
- 기존 다섯 개 전경 RGBA 레이어
- 1280×720 월드 범위
- 1024×576 논리 뷰포트
- Zoom 1.25 카메라
전경 레이어의 실제 배치 좌표와 깊이 규칙은 Pilot을 기준으로 유지한다.
중요 제약
이번 단계에서는 플레이어 이동이나 A* 경로 탐색을 새로 구현하지 않는다.
기본 장면에서는 승인된 캐릭터를 유효한 보행 좌표에 표시한다.
카메라 추적과 보행 기능을 구현하지 않은 상태라면 정적인 플레이어·카메라 미리보기로 제한한다.
아직 구현하지 않은 기능을 있는 것처럼 표시하지 않는다.
필요하면 QA 전용 캐릭터 포즈 미리보기 기능을 넣을 수 있지만, 충돌 검증 없는 자유 이동을 허용해서는 안 된다.
이는 기존 Hybrid Pilot의 완성도가 낮아지는 것을 방지하기 위한 제한이다.

7. Task E — Pilot과 Runtime 분리 유지
현재 r5-hybrid-pilot.html은 사용자 승인 경험을 검증한 독립 실행 환경이다.
Integration A에서는 반드시 유지한다.
필수 보존 사항
- Pilot URL 유지
- 기존 A* 정상 동작 유지
- 캐릭터 V3 애니메이션 유지
- 네 목적지 Marker 유지
- 콘텐츠 패널 유지
- 기존 QA 프리셋 유지
코드를 정리하기 위해 기존 Pilot을 대규모로 재작성하지 않는다.
Runtime과 공유할 자산 정보나 순수 데이터만 필요한 범위에서 분리한다.
Stage 구분
단계	범위
Integration A	R5 Scene 진입·자산·월드·카메라
Integration B	이동·충돌·A*·Marker·목적지 UX
Integration C	콘텐츠 방문·URL·모바일·배포 QA
Integration B/C의 코드를 미리 구현하지 않는다.

8. Task F — 화면 및 Lifecycle 검증
진입 검증
다음 세 가지를 비교한다.
기존 World
/MyPage/world/
기존 R4
/MyPage/world/?canonical=4
신규 R5
/MyPage/world/?r5=1
각 URL이 서로 영향을 주지 않아야 한다.
R5 검증 항목
- 게임 Canvas가 하나만 생성되는가
- R5 Scene이 정상 시작되는가
- Candidate B 원본 이미지가 정확히 표시되는가
- 기존 전경 레이어 좌표가 맞는가
- 캐릭터 크기·비율이 유지되는가
- 카메라가 월드 바깥을 노출하지 않는가
- Scene 종료 시 이벤트 리스너와 UI가 정리되는가
- R4로 별도 진입했을 때 R5 관련 UI가 나타나지 않는가
이번 단계에서는 목적지 클릭이나 콘텐츠 열기가 작동하지 않는 것이 정상이다.
대신 R5 화면에는 개발 검증용으로 다음과 같이 명시한다.
R5 Integration A Preview · 탐색 및 콘텐츠 기능은 Integration B/C에서 연결 예정
이 문구는 최종 사용자 UI가 아니라 QA 표시다.

9. Task G — 기존 미해결 문제 관리
Integration Human Gate에서 발견한 다음 문제는 해결 여부를 정확히 구분한다.
항목	이번 단계 처리
Workshop → Hall 경로 차단	Integration B에서 수정
기존 콘텐츠 URL의 Pages 경로 오류	Integration C에서 수정
Android 실기기 검증	Integration C에서 수행
해안 석벽 가림	기존 수용 상태 유지, 기술 부채 기록
Vite 청크 크기 경고	영향 분석 및 기록
특히 Workshop → Hall의 경로 문제를 해결하기 위해 Integration A의 작업 범위를 확대하지 않는다.
A단계 QA를 통과했더라도 전체 R5 탐색 기능이 완료됐다고 보고해서는 안 된다.

10. 필수 테스트
기존 프로젝트에서 다음 명령을 실행한다.
cd C:\Users\hyun0\MyPage\portfolio-world

npm run typecheck
npm run build
npm test


Production Preview도 실행한다.
npm run preview


Vite 기본 Preview 포트가 사용된다면 다음 주소를 검증한다.
http://127.0.0.1:4173/MyPage/world/?r5=1
실제 포트 또는 주소가 다르면 검증한 정확한 URL을 보고한다.
반드시 검증할 테스트
- R5 Scene 등록
- R5 전용 진입 파라미터
- R5 승인 이미지 해시 유지
- R5 기본 애니메이션 자산 로딩
- 개발 서버 및 Production Preview에서 배경·캐릭터 렌더링
- R4 URL 정상 동작
- 기존 기본 World 정상 동작
- Scene 초기화 중복 없음
- 자산 로딩 실패 및 콘솔 오류 없음
- Pilot 기존 기능 회귀 없음
브라우저 캡처는 실제 Runtime 실행 결과를 사용한다.
정적인 이미지 합성 결과를 Runtime 화면이라고 보고하지 않는다.

11. 필수 산출물
저장 경로:
reports/portfolio-world-rebuild/
  r5-world-layout-recovery/
    integration-a/


문서
00-task-instruction.md
01-runtime-entry-implementation.md
02-r5-asset-manifest.md
03-scene-and-camera-contract.md
04-production-base-path-validation.md
05-r4-regression-report.md
06-pilot-preservation-report.md
07-browser-visual-qa.md
08-known-issues-and-integration-b-handoff.md
09-final-human-gate.md


00-task-instruction.md에는 이번 작업 지시서의 전체 내용을 저장한다.
이미지
10-r5-runtime-first-render.png
11-r5-pilot-vs-runtime-comparison.png
12-r4-regression-screenshot.png
13-production-preview-r5.png
14-final-human-review-board.png


데이터
data/portfolio-world/r5-integration-a-runtime-draft.json
필수 내용:
- 시작 Commit
- 적용된 Scene
- 진입 URL
- 승인 자산 목록·해시
- Camera Contract
- Dev / Production 경로
- R4 보존 검증
- Pilot 보존 검증
- Browser QA
- Integration B 인계 사항
- Human Gate

12. 완료 및 승인 기준
READY_FOR_R5_INTEGRATION_A_HUMAN_GATE
다음 조건을 모두 만족할 때만 선언한다.
1. 신규 R5 Scene이 정식 World 실행 구조에서 시작된다.
2. Candidate B가 정상 표시된다.
3. 승인된 캐릭터·전경 자산이 정상 로딩된다.
4. 카메라와 월드 경계가 올바르다.
5. Production Build / Preview에서도 R5가 표시된다.
6. 기존 R4가 정상 작동한다.
7. 기존 R5 Hybrid Pilot이 보존된다.
8. Asset URL 오류가 없다.
9. 실제 브라우저 시각 검증 결과가 존재한다.
10. Integration B/C의 기능을 완료한 것으로 잘못 보고하지 않는다.
다른 Gate
- CONDITIONAL_INTEGRATION_A_REWORK_REQUIRED
- BLOCKED_R5_RUNTIME_ENTRY
Human의 실제 화면 확인 전에는 다음 단계로 자동 진행하지 않는다.

13. 변경 금지 사항
이번 Integration A에서는 다음을 금지한다.
- 기존 R4 Scene 변경
- 기존 승인 캐릭터 재생성
- Candidate B 디자인 수정
- POI 수 및 위치 변경
- C.1/C.2 원본 변경
- A* 이동 로직 재작성
- Workshop → Hall 경로의 임의 수정
- 콘텐츠 페이지 수정
- 새 건물·선박 추가
- 오른쪽 Reserve 변경
- main 병합
- GitHub Pages 실제 배포
- Integration B/C 선행 구현
기존 작업 브랜치의 미커밋 파일은 임의로 삭제하거나 초기화하지 않는다.
빌드 과정에서 생성된 파일이 기존 포트폴리오 산출물을 예상치 않게 변경했다면 원인을 확인하고, 무관한 변경을 커밋하지 않는다.

14. Commit & Push
현재 R5 작업 브랜치에만 Commit & Push한다.
최종 보고 형식:
TASK_ID: R5-INTEGRATION-A-RUNTIME-ENTRY-ASSETS

HEAD:
BRANCH:
PUSH:

RUNTIME ENTRY:
- R5 Scene:
- Entry parameter:
- Development URL:
- Production Preview URL:
- Single Phaser instance:

ASSETS:
- Candidate B:
- Player V3:
- Foreground layers:
- SHA-256 integrity:
- BASE_URL:

CAMERA:
- Logical viewport:
- World size:
- Zoom:
- Bounds:
- Visual result:

R4 REGRESSION:
- Default World:
- Canonical R4:
- Source preservation:

PILOT PRESERVATION:
- Hybrid Pilot:
- Character:
- Navigation:
- POI / Content:

BUILD:
- Typecheck:
- Build:
- Tests:
- Production Preview:
- Browser console errors:

DEFERRED:
- Integration B:
- Integration C:
- Known issues:

R5 RUNTIME ENTRY IMPLEMENTED: YES / NO
R5 FULL GAMEPLAY INTEGRATED: NO
R4 RUNTIME MODIFIED: NO
MAIN MERGED: NO
PRODUCTION DEPLOYED: NO

GATE: