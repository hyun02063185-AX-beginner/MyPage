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
    image: "images/ax-lecture.png",
    featured: true,
  },
  {
    slug: "ai-first-step",
    title: "AI_First_Step",
    period: "2026-07",
    role: "1인 개발",
    problem:
      "AX_Lecture의 인터랙티브 강의 엔진을 재사용해, 주니어·사무직 신입 대상 첫 출근 컨셉의 AI 온보딩 교육 콘텐츠가 필요했습니다. 직급·상황이 다른 학습자별로 다른 콘텐츠 경험을 제공할 필요도 있었습니다.",
    work:
      "첫 출근 컨셉의 4구역(로비·미팅룸·내 책상·보안 게이트) 20강 커리큘럼을 구성하고, AX_Lecture와 Supabase를 공유하는 LMS 연동을 구현했습니다. 3개 페르소나(기본판·자영업·대학생) 전체 20강 콘텐츠 오버라이드를 완성하고, 서브에이전트 기반 검증 및 마감 승인 절차를 운영했습니다.",
    result:
      "3개 페르소나가 01~20강 전체에 걸쳐 완결되었으며, npm test 149/149를 통과했습니다. 검증 단계에서 중대 결함은 없었습니다.",
    category: "강의 콘텐츠",
    demoUrl: null,
    image: "images/ai-first-step.png",
    featured: false,
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
    image: "images/ax-lecture-studio.png",
    featured: true,
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
    image: "images/science-qbank-v2.png",
    featured: true,
  },
  {
    slug: "science-qbank",
    title: "science-qbank",
    period: "2026-06",
    role: "1인 개발",
    problem:
      "중·고등학교 과학 문제집 PDF를 교사가 자연어로 검색·활용할 수 있게, PDF에서 문제를 파싱해 DB화하고 RAG로 연결하는 파이프라인이 필요했습니다.",
    work:
      "PDF 페이지 렌더링, 2단 컬럼 레이아웃 대응 문제 파싱, 정답 매칭, 이미지 크롭, 텍스트 정제, Dify Knowledge 등록까지 이어지는 8단계 파이프라인을 구축했습니다. 오투 중2-2·중3-1·중3-2 3권을 처리하고, 책별로 흩어져 있던 파서를 공통 모듈로 리팩토링했습니다.",
    result:
      "585문제(중3-2+중2-2) Dify 재인덱싱을 완료했습니다. 중3-1 265문제를 파싱·적재해 누적 전체 850문제를 Dify에 등록했습니다. 이후 테스트 결과 지속가능한 개발이 어렵다고 판단해 V2로 프로젝트를 이전했습니다.",
    category: "개인 프로젝트",
    demoUrl: null,
    image: "images/science-qbank.png",
    featured: false,
  },
  {
    slug: "cody-stat",
    title: "Cody-Stat(출항일지)",
    period: "2026-08 ~ 2026-09",
    role: "코디세이 교육생(마리너) 자율 운영 프로젝트 — 인계·운영 문서 골격을 단독으로 작성",
    problem:
      "퍼실리테이터가 운영하던 세션 플랫폼이 일시 중단된 상태에서, 교육생이 자율로 인계받아 운영하게 되면서 인계·의사결정·운영 체계를 정리할 단일 출처 문서가 필요했습니다.",
    work:
      "README 전체 안내 문서를 작성하고 docs 폴더 체계를 구성했으며, 의사결정 기록을 시작했습니다. GitHub Pages 기반 공개 페이지 5종(index·roles·docs·vibe-coding·ai-attitude)을 제작·배포했습니다.",
    result:
      "GitHub Pages 배포 및 정상 동작을 확인했습니다(index·roles·docs·style.css 200 응답 확인).",
    category: "개인 프로젝트",
    demoUrl: null,
    image: "images/cody-stat.png",
    featured: true,
  },
  {
    slug: "dark-tarot-card-game",
    title: "다크 타로 히든 카드 게임",
    period: "2026-07",
    role: "1인 개발(React + Vite, 바이브 코딩)",
    problem:
      "단순 운세 앱이 아니라 어두운 3장 리딩에서 히든 카드로 반전되는 스토리텔링 구조로 몰입감을 만들고 싶어, 기획 단계에서부터 현실 예언·건강·법률·자해 등 단정적 문구를 금지하는 안전선을 문서로 먼저 정리했습니다.",
    work:
      "React 19 + TypeScript + Vite로 세로형 카드가 Y축 180도로 뒤집히는 3D 인터랙션을 구현하고, 메이저 아르카나 22장을 대상으로 징조·붕괴·결말 3장 리딩 후 히든 카드를 열면 5종(구원·재해석·각성·해방·새 길) 중 하나로 재해석되는 로직을 설계했습니다. 게임 기획서·UI/UX 흐름·구현계획 문서를 단계별로 작성하고 vitest 기반 테스트 하네스를 구성했습니다.",
    result:
      "package.json 기준 dev/build/lint/test 스크립트와 vitest 테스트 구성이 존재함을 확인했습니다.",
    category: "개인 프로젝트",
    demoUrl: null,
    image: "images/dark-tarot-card-game.png",
    featured: false,
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
    image: "images/webtoon-generator-v2.png",
    featured: false,
  },
  {
    slug: "portfolio-archive-old",
    title: "김현래 포트폴리오(구)",
    period: "2024-12",
    role: "1인 제작",
    problem:
      "과거 경력을 발표형으로 정리해 보여줄 개인 소개 페이지가 필요해, 프레젠테이션 라이브러리(impress.js)를 활용해 3D 전환 슬라이드 형태의 웹 포트폴리오를 제작했습니다.",
    work:
      "impress.js를 기반으로 주차별 프로젝트 캡처 이미지와 소개 텍스트를 슬라이드별로 배치하고, 슬라이드 간 3D 전환 애니메이션으로 넘어가는 단일 페이지 웹 포트폴리오를 구성했습니다.",
    result:
      "index.html/css/js/images/movies로 구성된 완성된 정적 웹페이지가 존재함을 확인했습니다. 이전 취업 활동에 사용했던 자료입니다.",
    category: "개인 프로젝트",
    demoUrl: null,
    image: "images/portfolio-archive-old.png",
    featured: false,
  },
  {
    slug: "ax-instructor-standard-curriculum",
    title: "AX 강사 육성 표준개요서",
    period: "2026-06",
    role: "1인 작성",
    problem:
      "AX 강사 양성 과정을 체계적으로 설계하고 정리할 필요가 있어, 16일 64시간 전체 커리큘럼의 개요와 Day별 개인 실습 워크북을 표준 문서 형태로 정리했습니다.",
    work:
      "AI 활용과 DX/AX의 경계부터 마이크로티칭 피드백·인증까지 16개 Day로 이어지는 커리큘럼 개요서 1종과, Day별 개인 워크북 16종(Pilot-first 실행, AX 사례 분석과 전이, AI Use Case 설계·포트폴리오, AI-augmented Engineering 4단계, 책임 있는 AX 거버넌스, AX KPI·ROI 설계, 조직·인재 변화관리 등)을 최종배포본 형태로 완성했습니다.",
    result:
      "최종배포본 PDF 17종(전체 개요서 1 + Day 1~16 워크북)이 실제로 존재함을 확인했습니다.",
    category: "강의 콘텐츠",
    demoUrl: null,
    image: "images/ax-instructor-standard-curriculum.png",
    featured: false,
  },
  {
    slug: "management-marketing-curriculum",
    title: "경영반·마케팅반 강의안·워크북",
    period: "2026-05",
    role: "1인 작성",
    problem:
      "AX 강사 양성 과정 실습으로, 경영반·마케팅반 두 트랙 각각에 대해 재직자 교육 특성 이해부터 Demo Day 발표까지 35차시 분량의 강의안과 워크북을 트랙별로 설계했습니다.",
    work:
      "경영반은 공문서·보고서 자동화, 데이터 분석·KPI, 출강 제안서·PPT 제작, 모의강의·Demo Day 순으로, 마케팅반은 콘텐츠 기획·카피라이팅, 광고 캠페인, 성과 지표 분석, 출강 제안서 제작 순으로 각각 35차시 커리큘럼을 구성해 강의안 35편 + 워크북 35편씩 총 4세트를 작성했습니다. 경영반 워크북은 정적 문서 외에 인터랙티브 웹 워크북 버전도 별도 제작했습니다.",
    result:
      "경영반·마케팅반 각각 강의안 35편 + 워크북 35편(총 140편) 파일이 존재함을 확인했습니다. 경영반 워크북의 인터랙티브 웹 버전 파일도 존재함을 확인했습니다.",
    category: "강의 콘텐츠",
    demoUrl: null,
    image: "images/management-marketing-curriculum.png",
    featured: false,
  },
  {
    slug: "school-lecture-topics",
    title: "출강 강의자료",
    period: "2025-07 ~ 2026-05",
    role: "1인 강의 진행(강의자료 제작 포함)",
    problem:
      "중·고등학교 진로체험 및 방과후 수업에서 학생 눈높이에 맞는 실습형 강의 콘텐츠가 필요해, 주제별로 강의안·실습 PPT·보조 영상 자료를 준비했습니다.",
    work:
      "드론 코딩, 자율주행, 건축공학, 생명공학, 핀테크, 리빙랩, 메타버스, 학습코칭 등 다양한 주제로 학생 대상 강의를 설계하고, 주제별로 실습형 PPT와 보조 영상·이미지 자료를 함께 제작해 진행했습니다.",
    result: "주제별 강의 PPT·영상 자료가 존재함을 확인했습니다.",
    category: "강의 콘텐츠",
    demoUrl: null,
    image: "images/school-lecture-topics.png",
    featured: false,
  },
  {
    slug: "ax-lecture-presentation",
    title: "AX수업 발표자료",
    period: "2026-06",
    role: "1인 제작",
    problem:
      "AX수업 발표에서 토큰·임베딩·벡터·프롬프트·워크플로우 등 AI 핵심 개념을 청중이 직관적으로 이해할 수 있도록 개념별 시각자료가 필요했습니다.",
    work:
      "AI 에이전트 동작 구성도와 에이전트 구성 설계 문서를 제작하고, 머신·모델·벡터·임베딩·엔진·워크플로우·추상화·토큰·프롬프트·형태소 등 핵심 용어별 개념 이미지를 개별 제작했습니다.",
    result:
      "개념 다이어그램 이미지와 PDF 자료 세트를 제작했으며, AX강사 수업 당시 같은 수강생을 대상으로 발표했습니다.",
    category: "강의 콘텐츠",
    demoUrl: null,
    image: "images/ax-lecture-presentation.png",
    featured: false,
  },
  {
    slug: "demo-day-materials",
    title: "데모데이 발표자료",
    period: "2026-07",
    role: "1인 작성",
    problem:
      "데모데이 발표를 위해 AI 에이전트 개념 특강, 8모듈 AX 커리큘럼 설계, 마케팅·브랜딩 실무자 대상 RAG 특강까지 서로 다른 청중을 겨냥한 발표자료를 각각 준비했습니다.",
    work:
      "토큰·임베딩·벡터·프롬프트 등 개념 다이어그램을 포함한 AI 에이전트 특강 자료를 제작하고, 왜→무엇으로→어디에→어떻게→조심할 것→그다음의 6단계 학습 여정으로 짜인 8모듈 AX 커리큘럼 설계 문서를 작성했습니다. RAG 특강은 슬라이드별 발표 스크립트까지 포함한 15장 발표 설계도를 작성하고, 슬라이드 노트를 포함한 실제 발표용 PPTX로 완성했습니다.",
    result:
      "데모데이 발표 자료, AI 에이전트 특강 자료, AX 커리큘럼 설계 문서, RAG 발표용 PPTX 등 실제 발표 산출물이 존재함을 확인했습니다. 발표 초안으로 작성했으며, 실제 발표는 AX_Lecture로 진행했습니다.",
    category: "강의 콘텐츠",
    demoUrl: null,
    image: "images/demo-day-materials.png",
    featured: false,
  },
  {
    slug: "forsungun",
    title: "ForSunGun",
    period: "2026-09",
    role: "개인 리서치·검토 — 실현가능성 검토 및 이후 시제품 제작 담당",
    problem:
      "택배 주문 취합 자동화 아이디어의 사업적·기술적 실현 가능성을 검토할 필요가 있었습니다. 거래처 다수가 홈페이지 없는 소기업이고 주문이 카톡·메일로 들어온다는 점에서 기성 오픈마켓 통합 솔루션이 맞지 않는 상황이었습니다.",
    work:
      "사업 아이디어를 정리하고 경쟁 서비스(사방넷·이지어드민·플레이오토) 현황과 실현가능성을 검토했습니다. 소상공인 관점의 심층검토, AI 자체개발 타당성 검토, 1차 회신 시각자료 제작, 카톡 주문 처리 방안 2차 검토를 거쳐 문서 6종을 작성했습니다.",
    result:
      "통합 솔루션을 만들어 파는 방향은 권장하지 않고, 자체 업무 도구로 만드는 방향은 해볼 만하다는 검토 결론을 도출했습니다. 대안으로 오더플로우·스택큐브 등 기존 B2B 수발주 서비스가 이미 존재함을 확인했습니다.",
    category: "실무 도구",
    demoUrl: null,
    image: "images/forsungun.png",
    featured: false,
  },
];
