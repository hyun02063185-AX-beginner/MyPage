# Portfolio World — Sprint 1 Director Design
## World Skeleton & First Playable Space

Status: **DIRECTOR DRAFT FOR PRE-REVIEW**

Prerequisite:
- Sprint 0A COMPLETE
- Sprint 0B COMPLETE
- main merge `f6d83e1`
- Runtime Foundation / Work Context v0 COMPLETE

## 1. Sprint Goal

Sprint 1의 목표는 게임 콘텐츠를 늘리는 것이 아니라, **이동 감각과 공간 기준을 확정하는 첫 플레이어블 공간**을 만드는 것이다.

한 문장 목표:

> 빈 Central Plaza에서 플레이어가 자연스럽게 걸어다니고, 카메라와 공간 크기가 포트폴리오 탐색 경험에 적절한지 검증한다.

이 Sprint가 끝나면 다음에 답할 수 있어야 한다.

1. 캐릭터 크기가 적절한가?
2. 이동 속도가 너무 빠르거나 느리지 않은가?
3. 카메라가 편안한가?
4. 공간이 게임처럼 느껴지면서도 포트폴리오 탐색을 방해하지 않는가?
5. 이후 Career / Teaching / Lab / Gallery를 배치할 공간 체계가 자연스러운가?

## 2. Experience Principle

Portfolio World는 게임 클리어를 요구하지 않는다.

```text
Enter
→ Move
→ Discover
→ Inspect
→ Choose Portfolio Content
→ Return
```

Sprint 1에서는 `Move`와 `Discover`의 기초만 만든다.

없어야 하는 요소:

```text
점수
체력
전투
실패
퀘스트
게임 오버
```

## 3. Perspective

**Top-down orthographic**를 기본 방향으로 한다.

이유:
- ZEP 계열 탐색 경험과 가까움
- 비게이머도 즉시 이해
- Career / Lecture / Lab 같은 건물 배치가 쉬움
- isometric보다 asset/collision 복잡도가 낮음

## 4. Visual Direction

Sprint 1은 최종 pixel art를 제작하지 않는다.

목표:

```text
Modern Retro
+
16-bit inspired
+
AI campus / work town
+
professional rather than fantasy RPG
```

최종 palette/sprite/building art는 별도 Art Direction 단계에서 확정한다.
Sprint 1은 Phaser primitive/programmatic placeholder를 사용한다.

## 5. Logical Game Resolution

```text
1024 × 576
```

- 16:9
- 32px logical unit 기준으로 viewport가 정확히 32 × 18 units
- Phaser Scale: FIT + AUTO_CENTER_BOTH

## 6. Spatial Unit

```text
32 × 32 px
```

아직 Tilemap을 사용한다는 뜻이 아니라 공간 설계 기준 단위다.

## 7. World Skeleton

```text
64 × 40 logical units
= 2048 × 1280 px
```

Viewport보다 충분히 커서 실제 camera follow를 검증할 수 있다.

## 8. Central Plaza

```text
                 NORTH
          Future Lecture Zone
                  ↑

WEST   ←      CENTRAL PLAZA      →   EAST
Career                              AI Lab

                  ↓
          Future Gallery Zone
                 SOUTH
```

Sprint 1에서는 실제 건물/portal/interaction을 만들지 않는다.

Placeholder 범위:
- ground 영역
- 방향성 path
- zone label/sign
- central landmark placeholder

Contact는 후속 공간 설계에서 결정한다.

## 9. Player Placeholder

최종 캐릭터 asset 없이 programmatic placeholder texture 사용.

```text
visual: 약 24 × 32 px
future feet body: 약 18 × 14 px
```

Spawn:
- Central Plaza 남쪽 진입 지점
- 중앙축 기준

## 10. Movement

```text
8-direction
Arrow keys
WASD
```

Diagonal speed normalize.

Initial speed:

```text
160 px/sec
= 5 logical units/sec
```

Human Feel Test 후보:

```text
140 / 160 / 180 px/sec
```

조작은 즉시 시작/즉시 정지. inertia 없음.

## 11. Physics

Phaser Arcade Physics 허용.

Sprint 1:
- player velocity
- world bounds
- collideWorldBounds

아직 안 함:
- 건물/object collision
- triggers
- portals
- NPC bodies

## 12. Camera

초기 제안:

```text
follow player
roundPixels = true
lerpX = 0.15
lerpY = 0.15
world bounds enforced
no dead zone
```

Human Feel Test tuning range:

```text
0.10 / 0.15 / 0.20
```

## 13. Pixel Rendering

기본:

```text
pixelArt = true
roundPixels = true
```

후속 pixel art 적용 시 렌더 구조 변경을 최소화한다.

## 14. Persistent UI

Canvas 밖 HTML layer 권장:

```text
Portfolio World
[포트폴리오로 돌아가기]

WASD / 방향키로 이동
```

No minimap.
No inventory.
No quest UI.

## 15. Mobile

Sprint 1에서 touch movement를 구현하지 않는다.

다만:
- canvas가 작은 화면에서 layout을 깨지 않음
- exit link 사용 가능
- control hint가 오해를 만들지 않는지 확인

## 16. Accessibility

- exit link keyboard 접근 가능
- focus 표시 제거 금지
- control hint 제공
- sound 없음
- 방향키 때문에 browser page가 의도치 않게 scroll되지 않도록 확인

## 17. Performance Guard

Sprint 0B의 Phaser bundle warning은 accepted follow-up.

Sprint 1:
- 새 runtime dependency 추가 금지
- final art asset 추가 금지
- premature code splitting 금지
- built JS size와 asset size 기록

## 18. Architecture Direction

권장:

```text
src/
├─ main.ts
├─ config/
│  └─ gameConfig.ts
├─ scenes/
│  ├─ BootScene.ts
│  └─ WorldScene.ts
├─ player/
│  ├─ Player.ts
│  └─ movement.ts
└─ world/
   └─ worldLayout.ts
```

원칙:
- tuning 값은 한 곳에 모은다.
- ECS/state-machine framework 도입 금지.
- portal/interaction architecture 선구현 금지.

## 19. Tiled

Sprint 1에서는 **도입하지 않는다.**

먼저 다음을 코드 기반 placeholder에서 검증한다.

```text
tile scale
world scale
movement
camera
player footprint
```

Tiled 후보:

```text
Sprint 2 — Spatial IA / Collision / Zone Layout
```

## 20. Homepage CTA

기존 `index.html`에는 아직 `AI World 들어가기` CTA를 추가하지 않는다.

Sprint 1은 prototype 단계이므로 `/MyPage/world/` direct URL로 검증한다.

## 21. Human Feel Test

### Movement
- 즉시 반응하는가?
- diagonal이 과속하지 않는가?
- 160 px/sec가 적절한가?

### Camera
- 불편하거나 멀미가 없는가?
- 너무 늦게 따라오지 않는가?

### Space
- Plaza가 답답하지 않은가?
- 너무 넓고 비어 보이지 않는가?
- 향후 건물 4~5개가 들어갈 공간감인가?

### Portfolio Context
- 일반 게임보다 “포트폴리오를 탐색하는 공간”으로 발전할 가능성이 느껴지는가?
- World 나가기 경로가 명확한가?

## 22. Acceptance Criteria

```text
World route loads                 PASS
Player visible                    PASS
Arrow/WASD movement               PASS
Diagonal normalized               PASS
World boundary enforced           PASS
Camera follow                     PASS
Camera world bounds               PASS
Resize/FIT                        PASS
Pixel rendering baseline          PASS
Portfolio exit                    PASS
No existing Portfolio regression  PASS
No new runtime dependency         PASS
Typecheck                         PASS
Build                             PASS
Foundation tests                  PASS
Human Feel Test                   PASS
```

Critical/Major bugs = 0.

## 23. Explicit Non-Scope

```text
final pixel-art character
final tileset
real buildings
Tiled
object collision
portal/navigation interaction
NPC
dialog system
content cards
mobile touch movement
audio
analytics
AI NPC
multiplayer
```

## 24. Draft Roadmap

```text
Sprint 1
World Skeleton + Movement + Camera

Sprint 2
Spatial IA + Tiled + Collision + Zone Skeleton

Sprint 3
Interaction / Portal System + Existing Portfolio Navigation

Sprint 4
Art Direction + Game-ready Pixel Assets

Sprint 5
World Content + Guide NPC

Sprint 6
Mobile / Accessibility / Performance / Release Polish
```

## 25. Director Decisions Proposed

```text
S1-D01 Perspective
Top-down orthographic

S1-D02 Logical resolution
1024 × 576

S1-D03 Spatial unit
32 × 32

S1-D04 World skeleton
64 × 40 units

S1-D05 Movement
8-direction / initial 160 px/sec / normalized diagonal

S1-D06 Physics
Arcade Physics, world-boundary only

S1-D07 Camera
follow + roundPixels + initial lerp 0.15

S1-D08 Tiled
Deferred to Sprint 2

S1-D09 Art
Programmatic placeholders only

S1-D10 Homepage CTA
Do not add in Sprint 1
```

Claude pre-review 후 Director가 확정한다.
