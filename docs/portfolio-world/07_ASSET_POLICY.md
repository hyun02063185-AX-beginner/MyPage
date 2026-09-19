# 07. Portfolio World — Asset Policy

## 목적

- 출처 추적
- 라이선스 확인
- 스타일 일관성
- 성능 관리

## Categories

```text
character/
tilesets/
buildings/
props/
effects/
ui/
audio/
```

## Status

```text
CONCEPT
APPROVED
GAME_READY
DEPRECATED
```

## Metadata

- Asset ID
- 출처
- 제작 방식
- 라이선스
- 수정 여부
- 원본
- game-ready 위치

## Production Asset Audit (Scale Bible v1)

Runtime manifests stay lightweight, but each production-approved visual must have a maintained
asset-audit record. Required fields are: `id`, `runtimePath`, `textureKey`, role/category,
provenance, status, source width/height, strict and practical visible bounds, display
width/height, logical width/height, anchor, depth class, file bytes, export scale, optimization
status, alpha threshold, and audit date.

The runtime path must resolve through `import.meta.env.BASE_URL`. Visual content bounds never
replace collision bounds. New PNG exports must use the locked practical-alpha trim, retain the
category anchor, clean RGB only at fully transparent pixels, meet the category weight ceiling,
and be judged at actual runtime display size before `GAME_READY`.

## License

출처/라이선스를 확인할 수 없는 외부 asset은 공개 build 금지.

## Art Direction

향후 확정:

- tile scale
- character scale
- palette
- outline/shadow
- UI style
- animation fps
