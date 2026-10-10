Codex 5.6 High — R5 Phase E.2.4.1 작업 지시서
작업명: 캐릭터 방향별 비율 통일 및 자연스러운 걷기 모션 보정
TASK ID: R5-E2.4.1-CHARACTER-PROPORTION-NATURAL-GAIT
이번 작업은 E.2.4에서 발견한 세 가지 문제를 함께 해결하는 데 집중한다.
- 좌우로 걷다가 멈추면 캐릭터가 작아지는 현상
- 좌우와 상하 방향에서 캐릭터의 키와 체형이 달라지는 현상
- 미끄러짐은 개선됐지만 걸음이 지나치게 빨라 뛰는 것처럼 보이는 현상
기존에 사용자가 만족한 월드 디자인, 경로 탐색, 목적지 안내, 콘텐츠 방문 기능은 변경하지 않는다.
1. 작업 환경 및 기준
항목	값
Repository	C:\Users\hyun0\MyPage
Branch	design/world-layout-recovery-r5
시작 HEAD	51f03f70e899ff85b56ce414dd163c6697a52307
실행 AI	Codex 5.6 High
구현 대상	R5 Hybrid Pilot 한정
정식 R5 Runtime	구현 금지
작업 전에 브랜치, HEAD, Working Tree 상태를 확인한다. 예상하지 못한 변경이 있으면 임의로 덮어쓰지 않는다.
이번 지시서의 전체 원문을 다음 경로에 저장한다.
reports/portfolio-world-rebuild/r5-world-layout-recovery/phase-e2-4-1/00-task-instruction.md
작업 지시서 원문 보존은 필수다. 채팅 화면에서 지시서가 사라지더라도 GitHub를 통해 복구할 수 있어야 한다.

2. 현재 구현에서 확인된 문제
기존 E.2.4 코드와 보고서에서 확인된 사실은 다음과 같다.
2.1 서로 다른 출처의 Idle / Walk 자산
현재 SIDE Idle과 SIDE Walk는 서로 다른 제작 단계의 결과물이다.
SIDE Idle
public/assets/r5-hybrid/pilot-player/side-idle-normalized.png

SIDE Walk
public/assets/r5-hybrid/pilot-player/walk-side-v2.png


SIDE Idle은 E.2.2에서 보정한 캐릭터이고, SIDE Walk는 E.2.4에서 새로 제작한 8프레임 자산이다.
두 이미지는 모두 28×56 논리 프레임을 사용하지만, 실제 인물의 신체 비율이 같다는 보장은 없다.
특히 현재 코드는 setDisplaySize(28, 56)을 사용하기 때문에 이미지 내부의 신체 크기 차이는 해결하지 못한다.
2.2 과도한 애니메이션 속도
현재 설정:
Movement Speed: 170 world px/s

FRONT Walk: 4 frames / 24fps
BACK Walk:  4 frames / 24fps
SIDE Walk:  8 frames / 48fps

Walk Cycle: 약 0.167초


이는 걷기 한 주기가 초당 약 6회 반복되는 속도다.
미끄러짐을 줄이는 데는 도움이 됐지만, 사용자는 실제 플레이에서 뛰거나 다급하게 걷는 것처럼 느꼈다.
애니메이션 FPS를 다시 조정해야 하며, 필요하면 보폭과 이동 속도의 관계도 재검토한다.

3. Task A — 캐릭터 비율 정밀 분석
우선순위 P0
A-1. 전체 방향·동작 비교
다음 조합을 모두 분석한다.
방향	Idle	Walk
FRONT	분석	전체 프레임 분석
BACK	분석	전체 프레임 분석
LEFT	분석	전체 프레임 분석
RIGHT	분석	전체 프레임 분석
각 이미지의 실제 불투명 픽셀과 신체 구조를 비교한다.
검사 항목:
1. 머리부터 발끝까지 전체 높이
2. 머리 크기와 어깨 너비
3. 몸통 길이
4. 골반·다리 길이
5. 발 접점과 중심선
6. 머리와 몸통의 상대 위치
7. Idle ↔ Walk 전환 전후 시각적 크기
8. 동일한 캐릭터로 인식되는지
정면보다 측면이 자연스럽게 좁아 보이는 것은 허용한다.
하지만 방향을 바꾼다고 키나 전체 체격이 크게 달라지는 것은 허용하지 않는다.
A-2. 동일 기준 비교 보드
다음 여섯 자세를 동일한 바닥선에 배치한다.
- FRONT Idle
- FRONT Walk 대표 프레임
- BACK Idle
- BACK Walk 대표 프레임
- SIDE Idle
- SIDE Walk 대표 프레임
신체의 머리·어깨·골반·발 위치를 표시한다.
문제가 되는 부분을 측정한 뒤 수정한다.
논리 프레임이 같다는 이유로 PASS 처리하지 않는다.

4. Task B — Idle / Walk 캐릭터 비율 통일
우선순위 P0
B-1. 캐릭터 기준 모델 정의
사용자가 E.2.2에서 승인한 Refined Portfolio Guide의 외형을 기준으로 한다.
반드시 유지:
- 헤어스타일
- 얼굴
- 네이비 계열 상의
- 밝은 셔츠
- 갈색 계열 바지
- 기존 전체적인 체형
- 28×56 논리 프레임
- Bottom-center 발 접점
기존 캐릭터와 전혀 다른 디자인을 생성하지 않는다.
B-2. SIDE Idle / Walk 일치
이번 작업에서 가장 중요한 수정이다.
SIDE Idle과 SIDE Walk는 동일한 신체 기준을 사용해야 한다.
다음을 해결한다.
- 걷다가 멈춰도 키가 작아지지 않음
- 정지 후 머리·몸통이 갑자기 좁아지지 않음
- 걷는 프레임에서 다리 길이가 비정상적으로 늘어나지 않음
- Idle과 Walk의 복장 형태가 일치
- 발 접점이 동일
- 좌우 FlipX 후에도 동일한 크기 유지
기존 Idle 이미지와 Walk 이미지 중 어느 쪽을 기준으로 수정할지 비교해 결정한다.
단순히 작은 이미지를 무조건 확대하거나 큰 이미지를 축소하는 것으로 해결하지 않는다.
필요하면 SIDE Idle과 SIDE Walk를 공통 캐릭터 기준으로 함께 재제작한다.
B-3. FRONT / BACK도 동일하게 검증
상하 방향도 함께 비교한다.
문제가 없는 기존 프레임은 보존한다.
방향별 비율 통일을 이유로 모든 스프라이트를 불필요하게 다시 만들지 않는다.
B-4. 테스트 조건
다음 전환에서 시각적 크기를 비교한다.
SIDE Idle → SIDE Walk → SIDE Idle

FRONT Idle → FRONT Walk → FRONT Idle

BACK Idle → BACK Walk → BACK Idle

FRONT Walk → SIDE Walk
SIDE Walk → BACK Walk
BACK Walk → FRONT Walk


정지·걷기 전환 중 키나 체형이 갑자기 변하면 FAIL이다.

5. Task C — 자연스러운 걷기 리듬 보정
우선순위 P0
C-1. 현재 문제
현재 SIDE는 8프레임을 48fps로 재생한다.
한 주기가 약 0.167초로 지나치게 짧아, 자연스러운 걸음보다 빠른 발놀림처럼 보인다.
이번에는 FPS를 임의로 하나 선택하지 말고 실제 브라우저에서 비교한다.
C-2. 비교 후보
모드	SIDE 8프레임	FRONT/BACK 4프레임	성격
기존	48fps	24fps	현재 빠른 동작
A	24fps	12fps	빠른 걷기
B	20fps	10fps	자연스러운 걷기 후보
C	16fps	8fps	여유로운 걷기
이 값들은 검증 후보이며 최종 확정값이 아니다.
동일한 이동 속도에서 애니메이션을 느리게 하면 다시 미끄러질 수 있으므로, FPS만 평가해서는 안 된다.
필요하면 실제 캐릭터 이동 속도와 보폭도 함께 비교한다.
C-3. 이동 속도 후보
현재 이동 속도 170px/s는 사용자 승인된 기준값으로 유지한다.
별도 실험 모드에서 다음 속도를 비교할 수 있다.
- 170px/s — 현재 기준
- 150px/s — 중간 후보
- 130px/s — 느린 이동 후보
단, 이동 속도를 변경하면 클릭 이동의 도착 시간과 전반적인 탐색 경험에 영향을 준다.
따라서 속도 변경은 Human 검증 전까지 실험 모드에만 적용한다.
C-4. 걸음걸이 판단 기준
- 양발이 자연스럽게 번갈아 움직이는가
- 걸음이 지나치게 빠르지 않은가
- 이동 거리 대비 보폭이 적절한가
- 정지 후 발 움직임이 즉시 멈추는가
- 걸음 시작이 자연스러운가
- 화면에서 달리는 것처럼 보이지 않는가
- 좌우·상하의 보행 리듬이 일관되는가
팔과 다리 동작에 과도한 바운스 효과를 적용하지 않는다.
FPS 숫자보다 실제 플레이 시 느껴지는 자연스러움을 우선한다.

6. Task D — 실제 브라우저 A/B/C 비교 기능
이번 단계의 중요한 요구사항이다.
D-1. 실험 모드 구현
기존 Pilot URL을 유지한다.
http://127.0.0.1:5173/r5-hybrid-pilot.html
일반 플레이는 기존 UX를 유지한다.
QA 모드에서만 FPS와 이동 속도를 변경할 수 있도록 한다.
예시:
/r5-hybrid-pilot.html?animationQa=1


QA 화면에는 다음 기능을 제공한다.
- Animation Preset 선택
- Movement Speed 비교
- Idle / Walk 반복 테스트
- FRONT / BACK / SIDE 방향 선택
- 동일한 위치에서 비교
- 현재 FPS 및 이동 속도 표시
- 기본값 복원
프리셋 변경 시 Phaser 애니메이션을 실제로 변경해야 한다.
단순히 설정값만 화면에 표시하는 방식은 금지한다.
D-2. 비교 조건
같은 장소, 같은 카메라, 같은 방향, 같은 이동 거리에서 비교한다.
출발 지점은 Workshop 앞의 시야가 확보된 보행 영역을 사용한다.
가능하면 난간이나 식재에 캐릭터가 가려지지 않는 위치로 QA 전용 Spawn을 정의한다.
이는 테스트용 설정이므로 일반 플레이 Spawn은 변경하지 않는다.
D-3. 사용자 평가 기준
Human이 직접 다음을 비교할 수 있어야 한다.
1. 좌우로 걷기
2. 좌우 이동 후 정지
3. 상하 걷기
4. 정면에서 측면 전환
5. 측면에서 정면 전환
6. 클릭 자동 이동
7. 자동 이동 도착 후 정지
이번에는 Codex가 하나의 결과를 일방적으로 PASS 처리하지 않는다.
Codex는 기술적으로 적합한 기본 후보를 추천할 수 있지만, 최종 걸음 속도와 표현은 Human이 결정한다.

7. Task E — 방향 전환 및 움직임 연결
E-1. 부드러운 방향 전환
현재 FRONT / BACK / SIDE의 기존 방향 선택 규칙을 유지한다.
다만 다음 사항을 확인한다.
- 대각선에서 방향이 빠르게 번갈아 바뀌지 않는가
- 프레임 전환 시 크기가 달라지지 않는가
- SIDE LEFT ↔ RIGHT 전환 시 즉시 비정상적인 자세가 발생하지 않는가
- 자동 이동 경로의 코너에서 캐릭터가 튀지 않는가
새 대각선 캐릭터 제작은 이번 범위에 포함하지 않는다.
E-2. Idle 전환
정지 시에는 기존 방향에 맞는 Idle 자세를 사용한다.
Walk → Idle 전환 순간 다음 문제가 발생해서는 안 된다.
- 캐릭터 크기 축소
- 발 위치 급변
- 머리 위치 튐
- 복장 형태 급변
- 좌우 반전 오류
실제 사용자에게 발생했던 “좌우로 걷다가 멈추면 작아지는 현상”을 필수 회귀 테스트로 등록한다.

8. Task F — 애니메이션 자산 관리
기존 R4와 E.2.4 원본은 보존한다.
새 자산은 R5 Pilot 전용으로 생성한다.
권장 경로:
portfolio-world/public/assets/r5-hybrid/pilot-player/

  idle-front-v3.png       # 수정 필요 시
  idle-back-v3.png        # 수정 필요 시
  idle-side-v3.png

  walk-front-v3.png       # 수정 필요 시
  walk-back-v3.png        # 수정 필요 시
  walk-side-v3.png


필요하지 않은 파일을 형식적으로 생성하지 않는다.
제작 원칙
- 실제 인물의 비율 통일
- 각 프레임의 발 접점 유지
- 자연스러운 자세 변화
- 프레임 사이 캐릭터 정체성 유지
- 기존 이미지의 색감·화풍 유지
- 단순 프레임 복제 금지
- 프레임별 과도한 리사이즈 금지
E.2.4 생성 과정의 프레임별 스케일과 종횡비 보정도 검토한다.
기존 build_r5_e2_4_walk_assets.py에서는 생성 원본의 포즈를 추출하고, 공통 크기에 맞추기 위해 수평 및 수직 배율을 계산했다.
그 결과 SIDE 캐릭터의 몸통·다리 비율이 원래 Idle과 달라졌을 가능성이 있으므로, SIDE Idle / Walk 자산을 같은 신체 기준으로 보정한다.
외부 생성 모델을 사용하더라도 사용자가 승인한 캐릭터 디자인을 변경하지 않는다.

9. Task G — QA 및 회귀 검증
필수 시각 테스트
ID	검증 항목	통과 기준
T01	SIDE Idle → Walk	크기 변화 없음
T02	SIDE Walk → Idle	축소 현상 없음
T03	FRONT → SIDE	키·체형 자연스러움
T04	SIDE → BACK	신체 비율 유지
T05	좌우 반복 걷기	뛰는 듯한 느낌 개선
T06	상하 반복 걷기	자연스러운 리듬
T07	방향 전환	프레임 튐 없음
T08	클릭 자동 이동	보행 애니메이션 유지
T09	목적지 도착	자연스러운 Idle
T10	자동 이동 중 방향키	정상 전환
기존 기능 회귀
다음은 변경하거나 훼손하지 않는다.
- A* 클릭 이동
- 방향키 및 WASD 이동
- Hero Ship까지 부두 이동
- 바다 진입 차단
- 목적지 Marker와 설명
- 콘텐츠 방문 패널
- 기존 HTML 콘텐츠 연결
- 전경 가림
- 카메라 Zoom 1.25
- Candidate B 배경
자동 테스트
실제 저장소에서 실행한다.
cd C:\Users\hyun0\MyPage\portfolio-world

npm run typecheck
npm run build
npm test


추가 검사:
- 28×56 프레임 규격
- Idle / Walk 실제 실루엣 비교
- 발 접점
- 캐릭터 방향별 기준 비율
- 애니메이션 속도 전환
- 방향 전환
- 기존 R4 자산 해시 유지
자동 테스트가 모두 PASS하더라도 사람이 보기에 부자연스러우면 시각 QA는 FAIL이다.

10. 증거 자료 제작 기준
이번에는 이전에 발생했던 GIF 문제도 방지한다.
제출되는 GIF 또는 MP4는 실제 움직임이 있어야 한다.
- GIF는 최소 2개 이상의 실제 프레임을 가져야 한다.
- 첫 프레임과 마지막 프레임뿐 아니라 중간 동작이 포함되어야 한다.
- 영상 파일의 길이와 프레임 수를 자동 확인한다.
- 실제 Phaser 실행 화면에서 캡처한다.
- 정지 PNG를 GIF 확장자로 저장하지 않는다.
- 이미지 합성 결과를 실제 게임 캡처로 보고하지 않는다.
비교 영상은 같은 위치와 조건에서 촬영한다.

11. 필수 산출물
경로:
reports/portfolio-world-rebuild/
  r5-world-layout-recovery/
    phase-e2-4-1/


문서
00-task-instruction.md
01-idle-walk-proportion-audit.md
02-character-proportion-standard.md
03-animation-cadence-comparison.md
04-direction-transition-review.md
05-updated-asset-review.md
06-browser-ab-playtest.md
07-independent-visual-qa.md
08-regression-test-report.md
09-human-playtest-guide.md
10-final-human-gate.md


이미지
11-idle-walk-before-after.png
12-front-back-side-proportion-board.png
13-side-idle-walk-transition.png
14-gait-cadence-comparison.png
15-final-human-review-board.png


실제 동영상
motion-evidence/
  side-idle-to-walk.mp4
  side-walk-to-idle.mp4

  front-walk.mp4
  back-walk.mp4
  side-walk.mp4

  directional-transition.mp4
  auto-navigation.mp4


MP4 생성이 어려우면 검증된 다중 프레임 GIF로 대체 가능하다.
데이터
data/portfolio-world/r5-character-proportion-gait-correction-draft.json
필수 기록 항목:
- Original Idle / Walk Assets
- Visual Proportion Measurements
- New Pilot Assets
- FPS Comparison Presets
- Movement Speed Candidates
- Idle / Walk Consistency
- Direction Transition
- Browser Motion Evidence
- Automated QA
- Human Gate
- Remaining Issues

12. 완료 조건 및 Human Gate
이번 단계는 캐릭터 비율 문제와 자연스러운 걷기 문제가 함께 해결되어야 성공이다.
다음 중 하나라도 남으면 최종 PASS를 선언할 수 없다.
- 걷다가 멈추면 캐릭터가 작아짐
- 좌우와 상하의 키·체형이 부자연스럽게 다름
- 걷기가 여전히 지나치게 빠름
- 걸음 주기를 낮추면서 발 미끄러짐이 심해짐
- 방향 전환 시 자세가 크게 튐
- 기존 클릭 이동 또는 방문 UX가 손상됨
Gate
READY_FOR_R5_E2_4_1_HUMAN_PLAYTEST
캐릭터 비율 보정, 동작 후보 비교, 브라우저 QA 및 회귀 테스트가 완료된 상태. 최종 보행 속도와 자연스러움은 Human이 평가한다.
CONDITIONAL_REWORK_REQUIRED
비율 또는 걸음 동작의 일부 문제가 남은 상태.
BLOCKED_CHARACTER_ASSET
현재 원본이나 제작 방식으로 동일 인물의 자연스러운 Idle / Walk 자산을 확보할 수 없는 상태.
Human의 실제 플레이 승인 전에는 R5 정식 통합 단계로 넘어가지 않는다.

13. 변경 금지 범위
이번 작업에서는 다음을 변경하지 않는다.
- Candidate B 배경
- Hall / Workshop / Archive / Hero Ship 배치
- 기존 4개 방문 포인트
- 목적지 표시와 설명
- A* 경로 탐색
- 충돌 다각형
- 카메라 기준
- 콘텐츠 패널 및 콘텐츠 연결
- R4 Runtime
- R4 캐릭터 원본
- 정식 R5 Runtime
애니메이션 비교에 필요한 QA 전용 기능은 추가할 수 있다.
기존 사용자 승인 기능을 변경할 필요가 생기면 임의로 수정하지 말고 영향과 이유를 보고한다.

14. Git 및 최종 보고
완료 후 현재 R5 브랜치에 Commit & Push한다.
최종 보고 양식:
TASK_ID: R5-E2.4.1-CHARACTER-PROPORTION-NATURAL-GAIT

HEAD:
BRANCH:
PUSH:

ROOT CAUSE:
- SIDE Idle vs Walk:
- FRONT/BACK vs SIDE:
- Excessive gait speed:

CHARACTER PROPORTION:
- Front Idle/Walk:
- Back Idle/Walk:
- Side Idle/Walk:
- Direction transitions:
- Ground anchor:

ANIMATION:
- Original FPS:
- Candidate A:
- Candidate B:
- Candidate C:
- Recommended default:
- Movement speed comparison:

ART:
- Updated assets:
- Source preserved:
- Visual consistency:

BROWSER QA:
- Actual motion evidence:
- Idle → Walk:
- Walk → Idle:
- Direction change:
- Click navigation:

REGRESSION:
- A*:
- Hero Ship:
- Markers:
- Content panel:
- Camera:

TESTS:
- Typecheck:
- Build:
- Automated tests:
- Visual QA:

R4 RUNTIME MODIFIED: NO
CANDIDATE B MODIFIED: NO
R5 FORMAL RUNTIME IMPLEMENTED: NO

GATE:


최종 작업 원칙: 캐릭터의 프레임 크기를 같게 만드는 것이 목적이 아니다. 동일한 사람이 정지하거나 걷거나 방향을 바꾸더라도 크기와 신체 비율이 일정하고, 실제 배경 위에서 자연스러운 속도로 걷는 것이 목적이다.