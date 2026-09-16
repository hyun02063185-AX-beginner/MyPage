# 03. Portfolio World — Requirements

이 문서는 v1 Scope의 canonical source다.

# 1. v1 In Scope

- 기존 홈페이지에서 World 진입 CTA
- Desktop Arrow / WASD 이동
- 카메라 추적
- 충돌
- 상호작용 영역
- Enter/E/Click 상호작용
- Home / Career / Teaching / Making / Gallery 연결
- 일반 Portfolio로 즉시 나갈 수 있는 Direct Exit
- World load 실패 fallback
- reduced motion 고려
- 모바일 대체 탐색
- 기존 사이트 regression 보호

# 2. Non-functional

- Codyssey shared iMac / no sudo
- Home Windows
- Windows Notebook
- 절대 로컬 경로 hard-code 금지
- GitHub Pages `main / root` 유지
- Repository Continuity
- 콘텐츠 중복 금지
- Portfolio World는 M01 제약과 독립

# 3. v1 Deferred

- Library zone
- realtime LLM NPC
- World 위치 복구 고도화
- analytics
- minimap
- richer audio
- advanced visual effects

# 4. v1 Out of Scope

- Multiplayer
- realtime Presence
- realtime Avatar synchronization
- User account / authentication
- Server-side database
- WebSocket 기반 실시간 기능
- Realtime chat
- Voice interaction
- 다른 사용자가 World를 생성/편집하는 기능

범위 변경은 `90_DECISIONS.md`에 Decision을 추가한 뒤 반영한다.
