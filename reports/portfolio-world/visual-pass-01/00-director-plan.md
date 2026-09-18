# Portfolio World — Retro Harbor Campus Visual Pass 1 Director Plan

> Recommended repo path: `reports/portfolio-world/visual-pass-01/00-director-plan.md`

## 1. Phase Name

**Retro Harbor Campus — Visual Pass 1**

## 2. Purpose

Visual Pass 1의 목적은 전체 월드를 완성하는 것이 아니다.

이번 단계의 핵심은 현재 Sprint 2에서 검증된 이동·충돌·공간 구조 위에
`Retro Harbor Campus — Art Direction v1.0`을 실제 Phaser 화면으로 옮겨,
**Harbor Square가 실제로 매력적인 항구 포트폴리오 공간으로 보이는지 검증하는 것**이다.

이번 단계에서는 기능보다 **시각적 방향 검증**이 우선이다.

---

## 3. Canonical Design Source

Visual Pass 1은 다음 문서를 시각 기준으로 사용한다.

```text
reports/portfolio-world/art-direction/
retro-harbor-campus-art-direction-v1.0.md
```

핵심 방향:

```text
Theme
= Retro Harbor Campus

Base Visual
= Concept Image #1

Detail Reference
= Concept Image #3

Structural Readability Reference
= Concept Image #2

World
= Retro Game Inspired

UI
= Modern Portfolio
```

---

## 4. Product Goal

사용자가 첫 화면을 보았을 때 최소한 다음을 느껴야 한다.

1. 이곳은 항구도시다.
2. 중앙 광장에서 네 방향으로 이동할 수 있다.
3. 게임처럼 탐험할 수 있지만 포트폴리오 공간이다.
4. 현재 placeholder보다 훨씬 풍성하고 의도적으로 디자인된 공간처럼 보인다.
5. 실제 최종 아트로 확장할 가치가 있는 방향인지 판단할 수 있다.

---

## 5. Scope

### In Scope

```text
Harbor Square
+
South Waterfront Hint
+
Representative Harbor Assets
+
Destination Silhouette Refinement
```

세부 범위:

- Central Harbor Square 시각 개선
- 광장 바닥 재질/패턴 개선
- 중앙 landmark 시각 정체성 강화
- 남쪽 waterfront / dock 시각 요소 추가
- 물 영역의 시각적 존재감 강화
- 작은 배 또는 boat silhouette
- 대표 항구 소품 추가
- 네 목적지 건물의 실루엣 차별화
- Harbor-themed sign / banner / prop 일부
- 현재 path / forecourt 시각 개선
- 시각 밀도 증가
- 기존 collision과 movement 회귀 방지

### Out of Scope

```text
Portal navigation
Actual portfolio page transition
Building interiors
NPC
Dialogue
AI NPC
Quest
Combat
Audio
Final player sprite
Final pixel art asset pack
Night mode
Day/night cycle
Final animation polish
Full-world environmental detailing
```

---

## 6. Spatial Constraints

Sprint 2에서 검증된 공간 구조는 기본적으로 유지한다.

```text
WORLD
2048 × 1280

PLAYER SPEED
200 px/sec

Primary Destinations
North  = Academy / Teaching
West   = Guild Hall / Career
East   = Workshop / AI Lab / Making
South  = Exhibition Hall / Gallery
```

Visual Pass 1은 공간 구조를 다시 설계하는 단계가 아니다.

다음은 유지한다.

- current destination layout
- current path network
- current collision structure
- current forecourt concept
- manual world-edge clamp
- Arcade Physics environmental collision

시각적 이유만으로 목적지 좌표를 크게 변경하지 않는다.

---

## 7. Harbor Square Direction

Harbor Square는 월드의 핵심 첫인상이다.

### Required Elements

- 중앙 landmark
- stone plaza
- 네 방향 path
- sign / wayfinding hint
- benches or rest objects
- lamps
- planters / greenery
- harbor-related props
- south waterfront visual connection

### Central Landmark Direction

우선 후보:

```text
Armillary Sphere
Compass Sculpture
Navigation Globe
Harbor Map Monument
```

Visual Pass 1에서는 최종 asset보다 **실루엣과 역할**을 검증한다.

핵심 의미:

```text
navigation
exploration
learning
journey
```

---

## 8. Waterfront Direction

South 쪽은 항구 정체성을 만드는 핵심 구간으로 본다.

기본 흐름:

```text
Harbor Square
↓
Exhibition Hall
↓
Dock
↓
Sea
```

### Visual Pass 1 Required Waterfront Elements

- water
- wooden dock / pier
- mooring posts
- rope
- 1 small boat or boat silhouette
- crates / barrels
- lantern or nautical signage

Waterfront는 완전한 최종 구현이 아니라,
**“항구라는 인식이 즉시 생기는 정도”**를 목표로 한다.

---

## 9. Destination Silhouette Refinement

Visual Pass 1에서는 네 건물의 역할이 색상 외에도 읽히게 한다.

### Guild Hall

```text
Stone + Wood
Heavier / grounded silhouette
Career / journey / archive feeling
```

시각 후보:

- stronger entrance
- crest / guild sign
- notice board
- map-like prop

### Academy

```text
Bright stone
Clean entrance
Slight vertical emphasis
Teaching / learning feeling
```

시각 후보:

- banners
- book-like symbol
- small garden
- cleaner forecourt

### Workshop

```text
Wood
Open work structure
Shipyard / maker atmosphere
Making / AI Lab feeling
```

시각 후보:

- crate / tool props
- small crane silhouette
- open bay
- mechanical icon

### Exhibition Hall

```text
Clean
Elegant
Waterfront-facing
Gallery / museum feeling
```

시각 후보:

- broader entrance
- display board
- cleaner symmetry
- waterfront connection

---

## 10. Representative Asset Set

Visual Pass 1에서는 전체 asset catalog를 만들지 않는다.

### Target Types

```text
6–10 representative types
```

추천:

1. crate
2. barrel
3. rope / mooring post
4. harbor sign
5. bench
6. planter
7. lamp
8. small market stall
9. small boat
10. dock segment

### Density Goal

```text
Harbor Square
= medium-high visual density

Waterfront
= medium-high visual density

Primary Paths
= medium visual density

Outer Area
= low visual density
```

---

## 11. Rendering Strategy

우선순위:

```text
1. Programmatic Phaser graphics
2. Locally generated simple project-owned SVG/PNG
3. Properly licensed external assets only when necessary
```

가능하면 먼저 Phaser Graphics와 project-owned placeholder를 사용한다.

최종 상용-quality pixel asset 제작은 아직 하지 않는다.

SVG/PNG가 repo에 들어오면 `07_ASSET_POLICY.md` 기준으로
source/origin, generation method, license, status, final path를 기록한다.

---

## 12. Pixel Scale Decision

Exact pixel scale은 아직 잠그지 않는다.

후보 방향:

```text
A. Chunkier 16-bit-inspired
B. Refined retro-pixel
C. Slightly more detailed modern pixel
```

현재 우선 방향:

```text
Refined retro-pixel
```

실제 Phaser 화면에서 너무 미세하거나 너무 장난감처럼 보이면 조정한다.

---

## 13. UI Rule

이번 단계에서 UI는 크게 확장하지 않는다.

기존 HTML exit / accessibility shell을 유지한다.

원칙:

```text
World
= Retro Game Inspired

UI
= Modern Portfolio
```

retro HUD를 추가하지 않는다.

---

## 14. Collision Rule

시각 요소를 늘리더라도 collision은 제한적으로 유지한다.

### Collidable Candidate

- buildings
- large dock barriers
- large planters
- selected large props
- water boundary where needed

### Non-Collidable by Default

- small crates
- barrels
- signs
- lamps
- flowers
- banners
- small decorative props

핵심:

```text
Visual Density != Collision Density
```

---

## 15. Accessibility / Wayfinding

반드시 유지:

- keyboard movement
- focus behavior
- ARIA region
- exit link
- coarse-pointer fallback
- color-only distinction 금지

목적지마다 최소 2개 이상의 시각 단서를 갖는다.

---

## 16. Performance Guard

Visual Pass 1 때문에 과도한 optimization을 하지 않는다.

기록:

- main JS bytes
- gzip bytes
- number of new binary assets
- total new binary asset size
- approximate scene object count

---

## 17. QA Strategy

### Automated

기존 test/typecheck/build pipeline 유지.

추가 검증 후보:

- asset reference path validation
- layout object bounds
- duplicate IDs
- invalid asset metadata
- collision config regression

### Manual

- Harbor Square가 항구로 읽히는가
- 네 목적지 방향이 명확한가
- 물/부두 존재감이 충분한가
- 시각 밀도가 너무 낮지 않은가
- 너무 복잡하거나 막혀 보이지 않는가
- movement 200 px/sec가 여전히 적절한가
- collision이 자연스러운가
- camera view가 답답하지 않은가

---

## 18. Human Visual Feel Test

### Primary Questions

```text
1. 첫 화면이 매력적인가?
2. 항구도시라는 인식이 즉시 드는가?
3. 게임 느낌과 Portfolio 느낌의 균형이 좋은가?
4. 1번 Concept Image 방향이 실제 화면에서도 느껴지는가?
5. 오브젝트가 너무 적거나 너무 많은가?
6. 물/부두 비중이 적절한가?
7. 네 건물의 역할이 시각적으로 구분되는가?
8. 현재 상태에서 전체 World로 확장하고 싶은가?
```

### Verdict

```text
APPROVE_VISUAL_DIRECTION
NEEDS_MORE_DETAIL
TOO_GAME_LIKE
TOO_PORTFOLIO_LIKE
TOO_EMPTY
TOO_CLUTTERED
REWORK_HARBOR_IDENTITY
```

---

## 19. Pre-Review Questions for Claude

구현 전에 Claude Sonnet 5에게 다음을 검토시킨다.

1. 현재 Sprint 2 구조를 유지하면서 Visual Pass 1을 적용하는 가장 작은 변경 범위는?
2. programmatic graphics만으로 충분한가?
3. first binary asset은 이번 단계에서 필요한가?
4. exact pixel scale을 지금 잠가야 하는가?
5. Harbor Square / waterfront 구현에 필요한 최소 asset catalog는?
6. `landmarkCatalog.ts`를 그대로 확장하면 충분한가?
7. 별도의 theme catalog가 필요한가?
8. Harbor-specific naming을 layout data에 넣어도 되는가?
9. collision과 decorative rendering을 더 분리할 필요가 있는가?
10. scene object 수 증가에 따른 실제 성능 위험이 있는가?
11. current architecture에서 theme swapping 가능성을 얼마나 남겨둘 것인가?
12. Visual Pass 1 완료 후 어떤 evidence가 있어야 Codex 구현을 승인할 수 있는가?

---

## 20. Implementation Ownership

### Director

GPT-5.6 Sol

### Claude Code Sonnet 5

- pre-review
- architecture / asset strategy review
- implementation-risk review

### Codex

Preferred:

```text
GPT-5.6 Terra High
```

- implementation
- validation
- evidence
- report

### User

- Visual Feel Test
- final aesthetic judgment

---

## 21. Phase Sequence

```text
Visual Pass 1 Director Plan
        ↓
Claude Pre-review
        ↓
Director Gate
        ↓
Codex Implementation
        ↓
Claude Independent Review
        ↓
User Visual Feel Test
        ↓
Director Final Gate
```

---

## 22. Acceptance Candidate

```text
Harbor Square visually upgraded
Waterfront clearly readable
Dock / water / boat visible
Representative harbor props added
Destination silhouettes differentiated
Current movement preserved
Current collision preserved
Wayfinding preserved
Accessibility regression none
Existing Portfolio runtime unchanged
Typecheck PASS
Build PASS
Tests PASS
Preview PASS
Performance evidence recorded
Human Visual Feel Test ready
```

---

## 23. Director Status

```text
VISUAL_PASS_1_PLAN_READY
```

Next:

```text
Claude Sonnet 5 Pre-review
```
