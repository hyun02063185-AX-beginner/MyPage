# R5 Phase A — 공간 설계 실패 감사

## 목적과 범위

이 감사는 사용자에게 책임을 돌리지 않는다. R4까지의 문서·데이터·Git 이력이 부분적인 안전/렌더링 검증을 전체 공간 승인으로 확대할 수 있었던 구조를 찾아, R5에서 같은 일이 반복되지 않게 하는 기록이다. 기준 커밋은 `a829f907c6a579e7c1f171fdc4d2669b1b7fda20`이며, 이 Phase는 Runtime 파일을 수정하지 않는다.

## 이력에서 확인한 전환점

| 시점 | 기록 | 실제로 잠긴 것 | 빠져 있던 전체 질문 |
| --- | --- | --- | --- |
| Canonical Projection A | 원래 Hall / Workshop / Hero의 비대칭 항구 구도 | 초기 세 랜드마크와 고정 프레임 | 4번째 포인트가 들어간 완성형 전체 구도 |
| Amendment 01 | `canonical-target-amendment-01-fourth-visitable-point.json` | Office-B 후보, P8, Lower Plaza–Central Quay join | 중앙 여백과 새 건물이 동선을 막지 않는지 |
| Amendment 02 | 앵커를 기존 walkable 영역의 가장 가까운 안전 좌표로 이동 | 새 배치가 아닌 기존 polygon 안전성 | 안전한 좌표가 좋은 공간 설계를 뜻하는지 |
| R2.4 Foundation Master B | 기존 geometry 위에 시각 Foundation을 통합 | 계단·quay·수면·건물 layer | 건물 수가 늘어난 전체 구도의 위계 |
| R3 C3 / Runtime | Foundation, P1–P8, player, camera를 parity로 유지 | 구도 변형 없이 scenic/props 통합 | Hero Ship의 전체 육지·수면·부두 논리 |
| R4 Player | 28×56 및 R3 기하를 유지한 Sprite 통합 | 애니메이션·물리체·R3 parity | 실제 게임 카메라에서 플레이어 존재감 |

## Root cause

### Fourth point

Amendment 01은 스스로 `PENDING_HUMAN`이었지만, R1 geometry 문서는 이를 `APPROVED_AND_INTEGRATED`로 기록하며 Office-B, P8, apron을 기존 프레임에 삽입했다. “네 번째 의미 있는 방문점” 요구가 “중앙에 독립된 네 번째 건물”이라는 구현 가정으로 축소됐다.

### Harbor Office placement

추천 Placement A는 `(700,505)`의 Lower Plaza–Central Quay join이었다. 이는 Workshop→Office 분기를 만들려는 의도였지만, 이미 Hall·계단·광장·Hero Quay가 만나는 시각적 허브에 건물 질량을 더했다. 이후 Foundation과 scenic이 그 연결부를 더 매끈하게 보이게 했지만, 중앙의 기능은 ‘연결 공간’이 아니라 ‘건물 사이 남은 공간’이 되었다.

### Geometry lock

Amendment 02는 실제 충돌 안에 있던 5개 앵커를 가장 가까운 기존 walkable surface로 옮겼다. 이는 안전성 수리로는 적절했지만, 그 뒤 R2/R3/R4가 geometry parity를 성공 기준으로 삼게 하는 효과가 있었다. 그 결과 미적·공간적 결함을 고칠 때도 기존 polygon을 보존하는 것이 암묵적 우선순위가 되었다.

### Ship grounding

R2.4/R3의 water·quay QA는 calm water, contact shadow, depth layer와 개별 Hero asset을 확인했지만, ‘선체 전체가 수면 위에 있고, 옆 부두와 갱웨이가 육지에서 연속되는가’를 완성형 전체 구도에서 거부 조건으로 검사하지 않았다. 시각 레이어와 충돌 규칙의 분리가 장점이었으나, 그 사이의 항만 물리 관계를 검증하는 Gate가 없었다.

### Player scale

28×56은 R1 skeleton에서 고정되었고 R2/R3/R4에서 parity 보호 대상이 되었다. R4는 고정 스케일·바닥 앵커·애니메이션 일관성을 검증했지만, 실제 gameplay camera에서 ‘사람이 충분히 읽히는가’는 별도 선택 변수로 비교되지 않았다. 즉, 기술적 안정성이 체감 크기 결정보다 먼저 잠겼다.

### Human Gate failure

각 Gate는 Foundation 연속성, 특정 랜드마크, route 안전성, player animation처럼 자기 범위에서는 유용한 증거를 만들었다. 그러나 Gate 사이에 ‘변경된 전체 Beauty Master와 같은 구도의 Navigation Overlay를 다시 보고 승인했는가’를 요구하는 상위 검토가 없었다. `READY_FOR_*` 상태와 부분 PASS를 전체 공간의 명시적 Human 승인으로 해석할 수 있는 문서 구조가 재발 방지 대상이다.

## 재발 방지

1. 새 building / stair / berth / route / player-camera 변화는 기본적으로 `STOP_AND_REVIEW`다.
2. Beauty Master와 Navigation Overlay가 같은 구도에서 모두 성립하지 않으면 Candidate 탈락이다.
3. `EXPERIMENT`, `CANDIDATE`, `APPROVED`는 서로 대체되지 않는다. PASS와 추천은 APPROVED가 아니다.
4. Runtime geometry·collision·player 크기는 Human design selection 이후에만 새 Blueprint로 분해한다.
