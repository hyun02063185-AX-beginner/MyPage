# 01. Portfolio World — Game Concept

## 1. 핵심 콘셉트

**2D 레트로 RPG 감성의 탐색형 포트폴리오 전시관**

ZEP과 같은 공간 탐색 감성을 참고하되 멀티플레이 서비스를 복제하지 않는다.

> 페이지 목록을 보는 대신 작은 세계를 걸어다니며 경력, 강의, 작업 결과물을 발견한다.

## 2. 톤앤매너

- 레트로 2D
- 탑다운 탐색
- 픽셀 또는 픽셀풍
- 메타버스 느낌
- 기존 홈페이지의 고급·절제형 인상을 해치지 않는 UI
- 게임은 재미를 주되 콘텐츠 표현은 전문적으로 유지

## 3. v1 주요 공간

- Central Plaza
- Career Archive
- AI Lecture Studio
- AI Lab / Making
- Gallery
- Contact

### Library

`content/*.md` 원천은 존재하지만 현재 브라우징 가능한 Library UI가 없으므로 **v1에서는 Deferred**한다. 영구 제외가 아니다.

향후 `content/*.md`를 Single Source로 사용하는 브라우징 UI가 마련되면 후속 Sprint에서 World에 추가할 수 있다.

## 4. 기본 상호작용

- 상/하/좌/우 이동
- 카메라 추적
- 충돌
- 상호작용 영역
- Enter/E/Click 상호작용
- 간단한 Dialog
- Portfolio 페이지 이동
- 일반 포트폴리오 바로가기
- World 복귀 위치 저장 후보

## 5. AI Guide NPC

v1 후보:
- 정적 선택형 안내
- 원하는 콘텐츠 방향 안내

향후:
- LLM 연결
- 자연어 질문
- 관련 콘텐츠 안내

LLM NPC는 v1 필수가 아니다.

## 6. Escape Route

항상 제공:

- 일반 포트폴리오 바로가기
- World 나가기
- 조작 도움말
- 필요 시 Skip 기능
