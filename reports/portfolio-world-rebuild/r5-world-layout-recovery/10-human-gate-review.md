# R5 Full World Design — Human Gate Review

## 제출 상태

`EXPERIMENT`가 아닌 비교 가능한 `CANDIDATE` 두 개를 제출한다. Codex의 추천은 선택이 아니며, 이 문서는 `APPROVED`를 기록하지 않는다.

| 항목 | Candidate A — Three-Landmark Open Harbor | Candidate B — Organic Coastal Harbor |
| --- | --- | --- |
| 중심 읽기 | 큰 원형 plaza와 세 분기 | 빈 수면 basin과 곡선 waterfront promenade |
| Hall / Workshop | 명확하고 균형 잡힌 terrace / work yard | 더 유기적인 cliff terrace / waterfront yard |
| Hero berth | side dock, water-surrounded hull | shore-connected long pier, side dock, gangway |
| 4th point | Workshop attached Archive wing | seawall Archive alcove 표현 |
| player / camera | 28×56은 전경에서만 제한적으로 읽힘 | 더 가까운 카메라 또는 32×64 비교가 더 설득력 있음 |

## 검토 순서

1. `03`, `04` Beauty Master를 텍스트 없이 보고 첫 시선·목적지·수면 여백을 판단한다.
2. `06` Navigation Overlay에서 네 목적지까지의 보행 route가 육지/계단/부두 위로만 이어지는지 확인한다.
3. `07`에서 Overview scale과 gameplay scale을 분리해 판단한다. 28×56을 자동 유지하지 않는다.
4. `08`에서 hull 아래 수면, dock의 측면 위치, shore-to-gangway 연속성을 본다.
5. `09`에서 네 번째 포인트의 의미와 비중을 판단한다.
6. `11`, `12`의 Overview / Workshop / central / Hall / Hero camera crop을 보고, 전체 축소 화면만 예쁜 후보를 배제한다. 이 보드는 Runtime capture가 아니라 Human Gate 전의 동일구도 camera simulation이다.

## 선택 양식

아래 중 하나를 사용자의 명시적 응답으로 기록해야 한다.

```text
HUMAN_DESIGN_SELECTION = A | B | REJECT_BOTH
FOURTH_VISITABLE_POINT = A | B | C | REVISIT
PLAYER_CAMERA_DIRECTION = CURRENT_28x56 | CLOSER_CAMERA | 32x64_TEST | REVISIT
APPROVAL_SCOPE = COMPLETE_WORLD_DESIGN_ONLY
```

`APPROVAL_SCOPE`는 선택된 전체 디자인을 Spatial Blueprint로 분해하는 허가일 뿐 Runtime 구현 허가가 아니다. 어떤 값도 사용자가 명시적으로 응답하기 전에는 설정되지 않는다.

## Current recommendation

추천은 **Candidate B + Option A Workshop-linked Harbor Archive + closer-camera/32×64 comparative blueprint**이다. B는 Hero Ship의 수면 negative space, cliff/shoreline 비대칭, 연결된 waterfront pier가 더 자연스럽게 읽힌다. 이는 `RECOMMENDED_PENDING_HUMAN`이며 승인 기록이 아니다.

```text
HUMAN_DESIGN_SELECTION = PENDING
RUNTIME_INTEGRATION = BLOCKED
NEXT = R5_FULL_WORLD_DESIGN_HUMAN_GATE
GATE = READY_FOR_R5_FULL_WORLD_DESIGN_HUMAN_GATE
```
