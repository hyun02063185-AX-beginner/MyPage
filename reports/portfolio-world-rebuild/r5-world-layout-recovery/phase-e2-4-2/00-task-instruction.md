# Codex 5.6 High — R5 Phase E2.4.2 작업 지시서

**작업명:** Front/Back 보행 개선 및 방향별 체형 일관성 보정
**TASK ID:** `R5-E2.4.2-FRONTBACK-GAIT-BODY-CONSISTENCY`

## 목표

Hybrid Pilot의 좌우 보행 개선을 유지하면서, 단순한 상하 보행과 Side 대비 얇아 보이는 Front/Back 체형을 보정한다. Front/Back은 실제 걷는 느낌이 나야 하며, 방향을 바꿔도 같은 사람처럼 보여야 한다.

## 변경 범위

수정 가능 범위는 Front/Back Idle·Walk, 필요 시 Side Idle·Walk의 미세 보정, fps/cadence, 방향별 idle/walk 선택의 미세 보정이다. Candidate B 배경, 길·충돌·A*·클릭 이동, 목적지/설명 UI, 콘텐츠, 카메라, Hall/Workshop/Archive/Hero Ship 배치, 전경 가림 구조, R4 정식 Runtime은 수정 금지다.

## 핵심 요구사항

- 머리, 어깨 폭, 몸통 볼륨, 골반, 다리 길이, 전체 체격 인상이 방향별로 일관되어야 한다.
- Front/Back Walk는 반대 팔·다리 교대, 체중 이동, 걸음 리듬, 정지↔보행 전환이 읽혀야 한다.
- Side의 개선된 보행감과 Idle↔Walk 크기 일관성은 유지해야 한다.
- 논리 프레임 28×56, bottom-centre 발 접점, 네이비 상의/밝은 셔츠/갈색 하의 및 승인된 인상을 유지한다.

## QA와 Human gate

Front/Back/Side Idle↔Walk, Front→Side, Side→Back, 클릭 이동 중 방향 전환, 도착 Idle 복귀를 실제 Hybrid Pilot에서 확인한다. 통과 기준은 자연스러운 상하 보행, 방향별 체형 일관성, Side 품질 유지 및 기존 입력/목적지 UI 유지다. 실패 기준은 종이처럼 얇은 Front/Back, 급격한 체형 변화, 단순/과장 보행, 기존 기능 회귀다.

## 산출물과 최종 게이트

이 폴더의 감사 문서, 4개 PNG 보드, `front-walk.mp4`, `back-walk.mp4`, `side-walk.mp4`, `direction-transition.mp4`를 제공한다. 최종 상태는 `READY_FOR_R5_E2_4_2_HUMAN_PLAYTEST` 또는 `CONDITIONAL_REWORK_REQUIRED` 중 하나로 보고한다.
