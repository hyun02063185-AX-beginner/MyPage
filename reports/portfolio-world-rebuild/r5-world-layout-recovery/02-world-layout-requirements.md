# R5 Phase A — World Layout Requirements

## 유지하는 제품 요구

- AI 전문강사 포트폴리오를 탐색하는 직접 이동형 2D 월드
- 밝고 고급스러운 Mediterranean / refined retro harbor, elevated oblique 시점
- Hall, Workshop, Hero Ship과 총 4개의 의미 있는 방문·상호작용 목적
- 비대칭적이지만 초행자도 읽을 수 있는 이동 구조
- stone / wood / plaster / greenery / calm teal water의 일관된 물질 언어
- Hero Ship은 Tier 1 landmark이며, 부두 옆 수면에 떠 있고 육지와 갱웨이로 연결됨

## R5에서 다시 설계하는 변수

| 변수 | 이전 상태 | R5 처리 원칙 |
| --- | --- | --- |
| Harbor Office | Lower Plaza 중앙권 독립 건물 | 중앙 독립 건물 가정 폐기; Workshop 연계 Archive를 우선 검토 |
| P1–P8 / walkable / collision | R1→R4 parity 보호 대상 | Human 승인 후 새 Blueprint에서 다시 정의 |
| Foundation / stairs / fountain | Master B 및 F1 footprint | 새 구도에 종속; fountain은 필수가 아님 |
| Hero berth / support fleet | 기존 quay·ship layer | 선체-수면-부두-갱웨이 물리 논리를 우선 |
| world bounds / camera / player scale | 1920×1080, fixed 28×56, 기존 zoom | 비교 변수; gameplay 체감으로 결정 |

## 후보 공통 공간 논리

1. Hall은 상부 terrace와 넓은 계단을 통해 열린 plaza와 연결한다.
2. Workshop은 낮은 위계의 작업 yard와 전면 접근 공간을 가진다.
3. Hero Ship은 full hull 아래·주변에 수면이 보이며, side dock과 gangway가 육지에서 이어진다.
4. 중앙은 건물·대형 장식이 아닌 방향 전환과 시야 확보를 위한 여백이다.
5. 네 번째 방문점은 Tier-1 landmark가 아니며, Option A Workshop-linked Harbor Archive를 권고하되 Human 승인 전 확정하지 않는다.
6. Fountain은 어떤 후보에도 필수 요소가 아니다. Hall plaza와 동선 모두를 강화할 때만 후속 Blueprint에서 재검토한다.

## Candidate 평가 기준

| 항목 | 배점 | 탈락 조건 |
| --- | ---: | --- |
| 전체 공간 자연스러움 | 5 | 중앙부가 건물 질량으로 막힘 |
| 이동 경로 직관성 | 5 | 길·계단·수면 경계가 읽히지 않음 |
| Hall / Workshop / Hero Ship 배치 | 5 | 위계나 접근 순서가 불명확 |
| 네 번째 포인트 적합성 | 5 | 숫자만 채우는 독립 중심 건물 |
| 선박과 수면 관계 | 5 | 선체가 육지/석조 platform에 올라온 듯 보임 |
| player / camera 적합성 | 5 | gameplay read에서 사람이 너무 작거나 부자연스러움 |

배가 육지에 올라와 보임, 중앙 landmark가 동선을 끊음, 계단 연결이 비현실적임, 길이 불명확함, player scale이 부자연스러움 중 하나라도 있으면 점수와 관계없이 FAIL이다.

## 이번 Human Gate 이후의 순서

`Complete World Design → Human Approval → Spatial Blueprint → Asset Decomposition → Runtime → Actual Play QA`

이번 Phase는 첫 단계까지만 완료한다. 후보가 선택되기 전에는 새 Phaser geometry, collision, scene, player animation, UI, 콘텐츠를 만들지 않는다.
