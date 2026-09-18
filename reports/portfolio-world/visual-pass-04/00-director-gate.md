# Portfolio World — Visual Pass 4 Director Gate
## Harbor Basin Recomposition

> 권장 저장 위치  
> `reports/portfolio-world/visual-pass-04/00-director-gate.md`

---

## 1. 배경

Visual Pass 3까지의 결과는 다음을 충족했다.

- 항구 정체성이 이전보다 강화되었다.
- 바다 영역이 확대되었다.
- 큰 배 1척 + 작은 배 여러 척이 추가되었다.
- 창고/보조 구조물이 도입되었다.
- 전체 구도는 mockup 단계로서 충분한 검토 기반을 제공한다.

그러나 사용자 피드백 기준으로는 다음 한계가 남아 있다.

1. 아직도 장면의 기본 인상이 **“마을 아래쪽에 바다가 조금 있는 구조”**에 가깝다.
2. **“항구도시”** 라는 정체성을 한 번에 전달하는 힘은 부족하다.
3. 큰 범선이 더 강한 시각적 주인공이 되어야 한다.
4. 바다가 도시 안쪽으로 더 들어오고, 하단 좌우도 바다로 읽히면 항구 느낌이 더 강해질 수 있다.
5. 목업 단계인 만큼, production-final처럼 보이게 만들기보다 **구도와 정체성을 명확히 하는 것**이 우선이다.

따라서 다음 단계는 단순한 배 위치 보정보다 더 큰 수준의 **구도 재편(composition rework)** 으로 정의한다.

---

## 2. Director Gate

```text
VISUAL_PASS_4_DIRECTOR_GATE = APPROVED
NEXT = CLAUDE_PRE_REVIEW_OPTIONAL_OR_DIRECT_TO_CODEX
```

이 단계는 기존 “겹친 배 1척 수정”을 대체하는 더 상위의 패치다.

즉:

```text
기존 focused vessel overlap patch
→ 폐기하지는 않지만 흡수한다
→ 새 방향의 Harbor Basin Recomposition 안에서 함께 해결한다
```

---

## 3. 핵심 목표

이번 패스의 목표는 다음 한 줄로 정리한다.

```text
“마을 아래의 물”이 아니라 “항구를 중심으로 형성된 도시”로 보이게 만든다.
```

---

## 4. 핵심 방향

### 4.1 항구를 더 강조한다
큰 범선은 단순 배경 오브젝트가 아니라 **장면의 시선 앵커**가 되어야 한다.

### 4.2 바다가 도시 안쪽으로 더 들어오게 한다
단순 하단 수평 띠 형태의 수면보다, **육지 사이로 들어온 항만 수역(harbor basin / inner harbor)** 이 더 적합하다.

### 4.3 부두/육지/바다의 관계를 재구성한다
도시는 바다와 맞닿아 있는 것이 아니라, **부두 구조물과 항만 경계에 의해 조직된 항구 도시**처럼 보여야 한다.

### 4.4 mockup fidelity를 유지한다
이 단계는 여전히 mockup이며, production-final처럼 꾸미는 것이 목적이 아니다.

---

## 5. 공간 구상 원칙

### 5.1 허용되는 큰 변화

다음은 허용된다.

- 하단 양쪽 모서리를 수면으로 사용하는 구성
- 바다가 육지 안쪽으로 파고드는 내항형 구조
- Exhibition Hall 하단부에서 바로 waterfront/dock/sea로 이어지는 흐름 강화
- 기존 직선적 수면 경계를 더 항만답게 재구성
- dock/pier 형태 재정리
- 큰 배와 작은 배들의 시선 구조 재배치
- 창고/항만 보조 건물 재배치 또는 일부 증설

### 5.2 유지해야 하는 큰 틀

다음은 유지한다.

- Portfolio World 전체 월드 크기
- 네 개 핵심 목적지 + Harbor Square 중심 구조
- reserved lot 3개 개념
- mockup 단계라는 위치
- programmatic rendering 원칙
- 기존 포트폴리오 루트와 비게임 페이지 보호 원칙

---

## 6. 월드 구조 원칙

### 6.1 월드 크기
유지:

```text
2048 × 1280
```

### 6.2 IA 구조
유지:

- Harbor Square
- Guild Hall
- Academy
- Workshop
- Exhibition Hall

즉, 사용자가 길을 잃지 않게 하는 **상하좌우 방향성 구조는 유지**한다.

### 6.3 허용되는 재구성
허용:

- Exhibition Hall 하단부 waterfront 재구성
- southern sea geometry 재구성
- dock/pier shape 재구성
- harbor support zone 재배치
- ship composition 재배치

---

## 7. 새 항구 구도 지시

### 7.1 기본 구도
권장 구도는 다음이다.

```text
도시/광장
→ Exhibition Hall
→ waterfront promenade
→ 돌출된 부두 또는 반도형 육지
→ 내항형 수역
→ 큰 범선 + 작은 배들
→ 외해 느낌의 여백
```

### 7.2 바다 영역
기존처럼 하단 직사각형 띠로만 읽히지 않도록 한다.

이번 패스에서는 다음 중 하나 또는 혼합형을 허용한다.

- **inner basin**: 바다가 육지 안쪽으로 파고든다
- **split-water edge**: 하단 좌/우 모서리까지 수면이 보인다
- **pier-centered geometry**: 육지가 가운데로 돌출되고 양옆이 수역으로 읽힌다

핵심은:

```text
“바다가 도시 아래에 있다”가 아니라
“도시가 항만을 끼고 형성되었다”가 보여야 한다.
```

---

## 8. 배 구성 원칙

### 8.1 큰 범선
필수:

- 큰 범선 1척
- 장면의 시선 앵커 역할
- 충분히 크고 읽기 쉬워야 함
- 일부 돛대/돛 실루엣이 육지/건축물 쪽과 시각적으로 겹쳐도 허용
- 단, 항법상 완전히 이상한 위치처럼 보이면 안 됨

### 8.2 작은 배들
권장:

- 작은 배 3~5척
- 모두 완전히 같은 간격으로 배치하지 않음
- 항구 활동감을 주는 수준으로만 배치
- 큰 배를 보조하는 역할
- 일부는 부두 근처, 일부는 수역 안쪽

### 8.3 시각 우선 원칙
배치 판단 기준은 다음 순서다.

1. 시각적 항구 정체성
2. 큰 배 중심성
3. 수역 구성의 자연스러움
4. mockup readability
5. 세부 논리

즉, 이 단계에서는 **엄격한 해상 시뮬레이션 정확도보다 시각적 설득력**이 우선이다.

---

## 9. 창고/보조 건물 원칙

항구 정체성을 강화하기 위해 다음은 유지 또는 확대 가능하다.

- warehouse
- cargo shed
- cargo edge structures
- harbor-side storage 느낌의 배경 구조물

원칙:

- 목적지 건물처럼 보이지 않게
- 포트폴리오 네비게이션 목적지를 방해하지 않게
- reserved lot을 침범하지 않게
- 지나치게 많지 않게
- “항구 운영 공간” 느낌만 주면 충분

---

## 10. 충돌 / 상호작용 원칙

이번 패스의 목적은 미적 재구성과 구도 강화다.

따라서:

```text
Visual Density != Collision Density
```

원칙은 유지한다.

필수 충돌:
- 주요 건물
- 수역 경계
- 정말 막혀야 하는 지원 건물 일부

불필요:
- 모든 소품 충돌
- 배 충돌
- 장식물 충돌 과밀화

---

## 11. 목업 원칙

사용자 판단:

```text
“목업이 맞으면 목업이 아닌 것처럼 보이게 일부러 할 필요는 없다.”
```

Director 판단도 이에 동의한다.

따라서 이번 패스는:

- production-final처럼 위장하지 않는다
- art style의 방향성은 유지하되
- 구도와 항구 정체성을 검증 가능한 수준으로 끌어올린다

금지:
- 외부 상용 아트 에셋 도입
- 최종 퀄리티를 가장한 과도한 디테일링
- mockup 범위를 넘는 기능 확대

---

## 12. 기술/아키텍처 원칙

### 유지
- programmatic rendering
- current world layout architecture
- existing portfolio-world runtime foundation

### 허용
- dock / water / ship composition 재정의
- harborVisualCatalog 보강
- streetscapeVisuals 보강
- water geometry 재구성
- layout data 확장

### 불필요
- theme engine
- Tiled
- 최종 asset pipeline
- shader system
- particle system
- day/night
- audio

---

## 13. 디자이너 참고 비주얼 원칙

참고 이미지에서 가져올 핵심은 다음이다.

- **항만 수역이 육지 사이로 들어온다**
- **큰 범선이 강한 시선 중심이 된다**
- **부두 구조물이 물 안으로 뻗어 있다**
- **건물, 부두, 물, 배가 하나의 장면으로 얽혀 보인다**

반면 그대로 복제하려는 것은 아니다.

금지:
- 특정 레퍼런스 장면의 직접 모사
- 특정 게임/작품 고유 이미지의 사실상 복제

---

## 14. 이 패스의 성공 기준

성공 기준은 다음이다.

### 14.1 사용자 첫 인상
사용자가 장면을 보았을 때:

```text
“항구도시다”
```

라고 먼저 느껴야 한다.

### 14.2 큰 배의 존재감
큰 배가 **분명한 주인공**처럼 보여야 한다.

### 14.3 바다 비중
바다 비중이 커졌다는 사실이 즉시 느껴져야 한다.

### 14.4 공간 활용
하단 좌우 공간이 항만/수역으로 읽혀야 하며, 하단이 덜 허전해야 한다.

### 14.5 길 찾기
그럼에도 불구하고 사용자는 여전히 네 핵심 목적지로 가는 방향을 직관적으로 읽을 수 있어야 한다.

---

## 15. In Scope

- 항구 수역 재구성
- 바다를 육지 안쪽으로 일부 끌어들이는 구도
- 하단 좌우 수역 강화
- 큰 배 1척 강조
- 작은 배 3~5척 구성 정리
- 부두 구조 재정리
- warehouse / cargo-shed 재배치 또는 보강
- 항구 정체성 강화
- mockup 품질 유지
- 배 겹침 문제 자연 해결
- QA / evidence / user feel test 준비

---

## 16. Out of Scope

- 새 포트폴리오 목적지 추가
- NPC / 대사 / 상호작용
- interior
- combat / quest
- final art production
- downloaded binary ship assets
- audio
- day/night
- analytics
- multiplayer / auth / DB
- generic theme switcher

---

## 17. 다음 단계

다음 구현자는 다음 중 하나를 수행할 수 있다.

### 옵션 A
Claude pre-review를 한 번 더 거친 후 Codex 구현

### 옵션 B
이 Director Gate를 기준으로 바로 Codex 구현

현재 사용자 흐름상 빠르게 전진하려면 **옵션 B**도 허용한다.

---

## 18. 최종 Gate

```text
DIRECTOR_DECISION = PROCEED_WITH_HARBOR_BASIN_RECOMPOSITION
```
