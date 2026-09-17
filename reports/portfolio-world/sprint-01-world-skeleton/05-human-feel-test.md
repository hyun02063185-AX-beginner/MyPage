# Portfolio World — Sprint 1 Human Feel Test

This checklist is for the user after Codex implementation and independent review.

Do not judge code here.
Judge the **experience**.

## 1. Movement speed

Try normal exploration for at least 30 seconds.

Current baseline:

```text
160 px/sec
```

Choose one:

```text
TOO SLOW
GOOD
TOO FAST
```

If needed, compare:

```text
140
160
180
```

## 2. Immediate control

Does the player:

- start moving immediately when a key is pressed?
- stop immediately when released?
- feel predictable rather than game-skill-heavy?

Choose:

```text
PASS
NEEDS_TUNING
```

## 3. Diagonal movement

Move diagonally for several seconds.

Does it feel the same speed as horizontal/vertical movement?

```text
PASS
FEELS_FASTER
FEELS_SLOWER
```

## 4. Camera

Current baseline:

```text
lerp = 0.15
```

Walk to all sides of the World.

Choose:

```text
TOO STIFF
GOOD
TOO LAGGY
```

If needed compare:

```text
0.10
0.15
0.20
```

## 5. Camera comfort

After 1–2 minutes:

```text
COMFORTABLE
SLIGHTLY UNCOMFORTABLE
UNCOMFORTABLE
```

Note whether the issue is:

```text
camera lag
too much movement
player not stable enough
other
```

## 6. Player size

Relative to the World:

```text
TOO SMALL
GOOD
TOO LARGE
```

## 7. Central Plaza size

Does the first area feel:

```text
TOO TIGHT
GOOD
TOO EMPTY
```

## 8. Future-zone spacing

Walk toward:

```text
North  — Lecture
West   — Career
East   — AI Lab
South  — Gallery
```

Does the spacing feel like a small explorable campus rather than a huge empty game map?

```text
PASS
TOO CLOSE
TOO FAR
```

## 9. Portfolio feeling

Which is closer?

```text
A. 재미있는 포트폴리오 공간으로 발전할 느낌이 난다.
B. 그냥 게임 프로토타입처럼 느껴진다.
C. 아직 판단하기 어렵다.
```

If B, note what is missing from the *experience*, not final art.

## 10. Exit confidence

Without thinking much, can you find and use:

```text
포트폴리오로 돌아가기
```

```text
PASS
NOT OBVIOUS
```

## 11. Overall Sprint 1 verdict

Choose one:

```text
ACCEPT_MOVEMENT_AND_SCALE
TUNE_SPEED_ONLY
TUNE_CAMERA_ONLY
TUNE_SPACE_ONLY
REWORK_MULTIPLE_FEEL_VALUES
```

Optional short note:

```text
가장 먼저 고치고 싶은 느낌:
```
