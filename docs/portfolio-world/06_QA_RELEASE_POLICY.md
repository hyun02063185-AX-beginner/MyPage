# 06. Portfolio World — QA & Release Policy

## QA Layers

1. Automated tests
2. Portfolio World Harness
3. Independent AI review
4. Human play test

## Harness 후보

- World load
- player spawn
- route target 존재
- missing asset 0
- broken route 0
- direct Portfolio path 존재
- existing page smoke PASS
- mobile fallback 존재

## Release Gate

```text
Critical bug        0
Major bug           0
Broken route        0
Missing asset       0
Desktop core flow   PASS
Direct Mode         PASS
Existing site smoke PASS
GitHub Pages        PASS
Keyboard baseline   PASS
Reduced-motion path PASS
Harness             PASS
```

## Existing Site Regression

반드시 확인:

- index
- career
- teaching
- gallery
- making

## M01 Legacy Regression

기존 M01 결과물의 핵심 페이지와 historical documentation이 Portfolio World 작업으로 불필요하게 훼손되지 않았는지 확인한다.

이 검사는 M01 제약을 새 기능에 적용하기 위한 것이 아니라, 이미 완료된 포트폴리오 결과물을 보존하기 위한 것이다.

## Release

```text
feature branch
→ tests
→ QA
→ review
→ Director gate
→ user play test
→ merge
→ Pages verify
```
