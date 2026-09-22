# Portfolio World — Visual Pass 5 Human Visual Feel Test
## Retro Harbor Campus — Art Style Application

> Recommended repo path:
> `reports/portfolio-world/visual-pass-05/05-human-visual-feel-test.md`

## 1. Test Status

```text
VISUAL_PASS_5_APPROVED_FOR_ASSET_APPLICATION
```

Visual Pass 5의 현재 구조, 배치, 밀도와 스타일 방향은 다음 단계로 진행하기에 충분하다고 판단한다.

이번 평가는 최종 아트 완성도를 평가한 것이 아니라, 실제 디자인 에셋을 적용하기 전의 **구조·배치·시각 방향성 검증**이다.

---

## 2. User Verdict

사용자 피드백 요약:

```text
현재 구조와 배치 빈도는 괜찮다.

공터에 무엇을 더 채우거나 배치할지는
차차 정리해도 된다.

현재 스타일에 실제 디자인 에셋을 적용해도 좋다.
```

따라서 다음 단계에서는 더 이상 공터 채우기나 구조 재배치를 우선하지 않는다.

---

## 3. Layout / Density Decision

현재 항구 도시의 기본 구조는 유지한다.

승인 대상:

- Harbor Square
- Guild Hall
- Academy
- Workshop
- Exhibition Hall
- inner harbor
- dock / pier
- large ship zone
- small boat fleet
- warehouse / cargo support area
- reserved lots
- current open-space density

Decision:

```text
KEEP_CURRENT_LAYOUT
KEEP_CURRENT_DENSITY
DEFER_EMPTY_LOT_FILLING
```

공터는 향후 필요에 따라:

- 보조 건물
- 식생
- 항구 소품
- 안내 구조물
- 포트폴리오 콘텐츠 확장

등을 추가할 수 있으나, 현재 단계의 blocker로 보지 않는다.

---

## 4. Style Decision

Visual Pass 5에서 검증된 스타일 방향:

```text
Retro Harbor Campus
```

현재 programmatic rendering은 구조와 분위기를 검증하는 mockup 역할을 충분히 수행했다.

다음 단계에서는 이 스타일을 기반으로 **실제 디자인 에셋 품질을 적용**한다.

Decision:

```text
STYLE_DIRECTION_APPROVED
READY_FOR_REAL_ART_ASSET_APPLICATION
```

---

## 5. Large Ship Direction

큰 배는 현재 mockup 비율을 최종 비율로 고정하지 않는다.

사용자 판단:

```text
배는 지금보다 크게 적용되어야 한다.
```

이유:

- 항구의 대표 랜드마크 역할을 해야 함
- 현재보다 더 강한 시각적 존재감 필요
- 기존 참고 이미지에서 본 건물 대비 배의 비율감을 참고할 가치가 있음
- 실제 디자인 스타일에 따라 최종 크기 판단은 달라질 수 있음

Decision:

```text
LARGE_SHIP_SCALE_NOT_LOCKED
INCREASE_HERO_SHIP_VISUAL_PRESENCE
```

---

## 6. Reference Image Usage

기존에 참고한 항구 이미지들은 직접 복제 대상이 아니다.

참고 항목:

- 건물 대비 큰 배의 전체 비율
- 선체와 상부 구조의 존재감
- 돛대와 돛의 세로 실루엣
- 항구 수면 안에서 배가 차지하는 시각적 비중
- 도시와 배가 하나의 항구 풍경으로 느껴지는 관계

Decision:

```text
REFERENCE_FOR_PROPORTION_AND_IMPRESSION_ONLY
NO_LITERAL_COPY
```

---

## 7. Visual Size vs Collision Size

실제 에셋 단계에서는 다음을 분리해 설계한다.

```text
visual footprint
collision / gameplay footprint
```

큰 배의 시각 에셋은 현재보다 더 크게 보일 수 있다.

특히:

- mast
- sail
- upper structure
- bow / stern silhouette

은 충돌 footprint보다 넓고 높게 표현될 수 있다.

배의 상부 구조가 육지 쪽 시각 영역과 일부 겹쳐 보이는 것도 허용 가능하다.

단:

- 항구 이동 동선 방해 금지
- collision geometry 과도한 확대 금지
- Exhibition Hall / 주요 목적지를 완전히 가리는 연출 금지

Decision:

```text
SEPARATE_VISUAL_SCALE_FROM_COLLISION_SCALE
ALLOW_LARGER_MAST_AND_SAIL_SILHOUETTE
```

---

## 8. Next Phase Priority

다음 단계 우선순위:

1. Large hero ship
2. Four destination buildings
3. Water / dock material quality
4. Small boats
5. Warehouse / cargo support assets
6. Secondary props / greenery
7. Empty-lot filling later

---

## 9. Human Feel Gate

```text
VISUAL_PASS_5_HUMAN_GATE = APPROVED
PROCEED_TO_ART_ASSET_PHASE
```

Visual Pass 5는 구조와 스타일 방향 검증 단계로 종료한다.

다음 단계는 실제 디자인 에셋을 적용하는 별도 Phase로 진행한다.
