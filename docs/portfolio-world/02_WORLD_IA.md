# 02. Portfolio World — World & Content IA

## 1. 원칙

World IA와 기존 Portfolio IA를 가능한 한 동일한 의미 구조로 유지한다.

콘텐츠는 World용으로 복제하지 않는다.

## 2. v1 World 구조

```text
                    [ AI Lecture Studio ]
                            │
                            │
[ Career Archive ] -- [ Central Plaza ] -- [ AI Lab / Making ]
                            │
                            │
                        [ Gallery ]
                            │
                        [ Contact ]
```

실제 배치는 맵 프로토타입에서 변경 가능하다.

## 3. 콘텐츠 매핑

| World Zone | 목적 | 연결 후보 |
|---|---|---|
| Central Plaza | 시작/안내 | `index.html` |
| Career Archive | 경력/커리어 | `career.html` |
| AI Lecture Studio | 강의 방향/커리큘럼 | `teaching.html` |
| AI Lab / Making | 제작 과정/실험 | `making.html` |
| Gallery | 결과물/전시 | `gallery.html` |
| Contact | 강의 문의 | 기존 홈페이지 문의 영역 |

## 4. Deferred Zone

### Library

현재 `content/*.md`는 source content지만 별도 브라우징 페이지가 없다.

v1에서는 Deferred한다. 영구 제외가 아니다.

추후 조건:

- Library UI가 생성됨
- Markdown source와 UI 사이의 단일 소스 구조가 정의됨
- 중복 콘텐츠 관리가 발생하지 않음

조건이 충족되면 후속 Sprint에서 World에 추가할 수 있다.

## 5. Deep Link 정책

- 상대경로 기반
- GitHub Pages `/MyPage/` base 고려
- 로컬 절대경로 금지
- 기존 route 계약 유지

## 6. World 상태 복구 후보

```text
lastWorldPosition
lastWorldZone
lastInteraction
```

목표:

```text
World
→ Career
→ World
→ Career Archive 근처에서 재개
```
