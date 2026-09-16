# 00. Portfolio World — Project Brief

## 1. 프로젝트 정체성

`Portfolio World`는 기존 `MyPage` 포트폴리오에 추가되는 선택형 2D 레트로 인터랙티브 경험이다.

이 작업은 Codyssey M01의 연장 과제나 제출 범위가 아니다. M01은 이미 완료된 별도 과제이며 당시의 제약은 역사적 기록으로 보존한다.

## 2. 프로젝트 목적

1. 서비스/경험 설계 능력 표현
2. AI 전문강사로서의 콘텐츠 구조 표현
3. Career / Teaching / Gallery / Making 등의 기존 포트폴리오를 공간 경험으로 연결
4. Multi-AI 제작 프로세스 자체를 포트폴리오 사례로 축적

## 3. 제품 원칙

### 3.1 Portfolio First
- 기존 홈페이지가 기본 진입점이다.
- World는 선택형 Experience다.
- 게임 없이도 모든 핵심 콘텐츠에 접근 가능해야 한다.
- World 실패 시에도 기존 홈페이지는 정상 동작해야 한다.

### 3.2 One Content Source
World는 콘텐츠 저장소가 아니라 탐색 인터페이스다.

### 3.3 M01 Legacy Protection
- M01 당시의 순수 HTML/CSS/JS 요구사항은 완료된 과제 기록으로 보존한다.
- Portfolio World에는 별도 기술 스택을 사용할 수 있다.
- `portfolio-world/`의 npm/Vite/Phaser 사용은 M01 제약 위반으로 보지 않는다.
- repository-wide 보안·Git 안전·비밀정보 보호 규칙은 계속 적용한다.

### 3.4 Progressive Enhancement
v1 범위의 canonical source는 `03_REQUIREMENTS.md`다.

## 4. 공개 전략

```text
/MyPage/        -> 기존 포트폴리오
/MyPage/world/  -> Portfolio World
```

기존 홈페이지에 `AI World 들어가기` CTA를 추가한다.
