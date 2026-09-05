// 프로젝트 카드 데이터. 콘텐츠 수정은 이 파일에서만 한다.
export const projects = [
  {
    slug: "ax-lecture",
    title: "AX_Lecture(사유의 방)",
    period: "2026-07",
    role: "1인 개발(Claude Code·claude.ai와 협업하는 바이브코딩 방식)",
    problem:
      "AX 전문강사 데모데이 시연용으로, 사내 비개발 직군 실무자를 대상으로 한 AI 입문 교육 콘텐츠를 게이미피케이션 요소를 갖춘 인터랙티브 강의 페이지로 전달할 필요가 있었습니다.",
    work:
      "20강(상자 4개 × 5강, 왜→도구→적용→지속 흐름) 커리큘럼을 설계하고, 다크 네온·글래스모피즘 UI와 게이미피케이션(발견한 강의 수·탐험도)을 구현했습니다. 7종 타입을 지원하는 슬라이드 엔진과 씬 전환을 개발하고, Supabase 기반 LMS를 3단계(학습 이벤트 수집 → 강사 대시보드 → AI 주간 브리핑)로 구축했습니다.",
    result:
      "20강 전체를 완료했으며, 기본판 총 268장 슬라이드와 도식 22종을 구성했습니다. npm test 96/96을 통과했고, jsdom으로 전체 동선을 시뮬레이션한 결과 런타임 오류가 0건이었습니다.",
    category: "강의 콘텐츠",
    demoUrl: null,
    image: "images/ax-lecture.webp",
  },
  {
    slug: "ax-lecture-studio",
    title: "AX강의안생성기(AX Lecture Studio)",
    period: "2026-06",
    role: "1인 개발(바이브 코딩)",
    problem:
      "강의를 준비할 때 주제를 구체화하고 상세 설명·사례를 채운 뒤 슬라이드로 재구성하는 과정이 반복적으로 오래 걸려, 강의 요청과 참고자료를 입력하면 AI가 수요 가설과 주제 후보를 제안하고 상세 강의안·슬라이드 스토리보드로 발전시켜주는 개인용 로컬 웹서비스를 기획했습니다.",
    work:
      "Next.js 기반 로컬 웹서비스로 강의 요청 입력부터 참고자료 입력, AI 수요 가설, 주제 후보 3개, 상세 강의안, 슬라이드 스토리보드, PPTX/Markdown 출력까지 이어지는 워크플로우를 단계별(Phase 1~8)로 구현했습니다. PptxGenJS로 발표자 노트·출처 각주가 보존되는 수정 가능한 PPTX를 생성하도록 만들고, 참고자료를 사용자가 검토·승인해야 다음 단계로 넘어가도록 설계해 AI 생성물과 확인된 사실을 구분되게 했습니다.",
    result:
      "PROGRESS.md 기준 Phase 1~8을 완료했습니다(로컬 저장, PPTX/ZIP 내보내기, 스타일 3종 프리셋, 참고자료 검수 단계 구현). 샘플 프로젝트에 강의안 8종 Markdown, lecture_slides.pptx, project_bundle.zip 파일이 실제로 존재함을 확인했습니다.",
    category: "실무 도구",
    demoUrl: null,
    image: "images/ax-lecture-studio.webp",
  },
  {
    slug: "webtoon-generator-v2",
    title: "AI·AX 용어 4컷 만화 사전",
    period: "2026-06",
    role: "1인 개발(바이브 코딩)",
    problem:
      "개발 경험이 없는 일반 직장인이 AI·AX 용어를 부담 없이 익힐 방법이 필요해, 검색으로 시작하고 기존 라이브러리는 탐색하되 없는 용어는 AI가 그 자리에서 4컷 만화로 생성해주는 서비스를 설계했습니다.",
    work:
      "Next.js App Router·TypeScript·Tailwind·SQLite·Prisma 스택으로 검색 전용 첫 화면, 카테고리 트리 탐색 화면, 신규 용어를 AI로 생성해 사용자 확인 후 등록하는 화면 등 4개 화면 구조를 설계하고, 개발 규칙 문서와 설계 문서 16종을 작성했습니다. 이전 버전의 구조를 검색 전용 첫 화면과 결과 분리 구조로 다시 설계했습니다.",
    result:
      "설계 문서·개발 규칙 문서 16종 작성을 완료했음을 확인했습니다. package.json 등 Next.js 프로젝트 골격이 존재함을 확인했습니다.",
    category: "개인 프로젝트",
    demoUrl: null,
    image: "images/webtoon-generator-v2-algorithm.webp",
  },
  {
    slug: "science-qbank-v2",
    title: "science-qbank-v2",
    period: "2026-06 ~ 2026-07",
    role: "1인 개발",
    problem:
      "기존 science-qbank(v1)의 텍스트 본문+크롭 이미지 모델이 그림·표·그래프와 텍스트가 얽힌 문제에서 분리가 잘 되지 않는 한계가 드러나, 문제 전체를 이미지로 고정하고 검색만 텍스트로 하는 새 데이터 모델이 필요했습니다.",
    work:
      "이미지 기반 문제 추출·크롭(GPT 비전·OpenCV 하이브리드) 파이프라인을 구축하고, 교재별로 정답 추출·매칭 스크립트를 확장했습니다. 1회성 DB 보정을 재현 가능한 마이그레이션으로 관리하는 체계를 도입하고, 워크시트 PDF 발행 CLI와 배포 번들·운영 가이드를 작성했습니다.",
    result:
      "EBS 개념완성 통합과학1 391문항을 적재해 정답 매칭 97%(DB 누적 3703문항)를 기록했습니다. 완자기출Pick 정답 매칭 716/720(99%), 하이탑 496/528(94%)를 매칭했습니다. 번호 마스킹 정확도는 91%에서 96.2%로 개선되었습니다. PoC 단계에서 2단 동일배율 출력으로 분량을 58쪽에서 9쪽(84.5% 감소)으로 줄였습니다.",
    category: "개인 프로젝트",
    demoUrl: null,
    image: null, // TODO: 캡처 준비되면 "images/science-qbank-v2.webp"로 채우기
  },
];
