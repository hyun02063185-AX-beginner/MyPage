// 강사 페이지(teaching.html) 데이터. 홈의 js/data/teaching.js(강의 주제)와는 다른 파일이다.
// SPEC_teaching.md 3~8항 원고를 11항 스키마대로 옮긴 것이며, 새로 쓴 문장은 없다.
// credentials·teachingTopics는 홈의 원본 파일을 import해 그대로 재사용한다 —
// 두 파일을 복사하지 않고 참조만 해서, 홈 데이터가 바뀌어도 자동으로 맞는다.
import { credentials } from './credentials.js';
import { teaching } from './teaching.js';

export const teachingPage = {
  statements: [
    "최신 기술이라서가 아니라, 방향이 맞아서 씁니다.",
    "결심은 사람이, 실행은 AI가. 단, 시킬 일을 잘 골라야 합니다.",
  ],
  statementNote: "홈에 걸린 좌우 대비 그림은 이 문장을 그린 것입니다.",
  journeyIntro: "도구를 나열한 목차가 아니라, 사람이 이해하는 순서로 짰습니다.",
  journey: [
    {
      stage: "왜",
      modules: [
        {
          no: "①",
          title: "AX란 무엇인가",
          question: "AX는 왜 지금 필요한가",
          goal: "AX의 정의를 명확히 하고, 왜 지금 논의되는지 이해합니다",
        },
      ],
    },
    {
      stage: "무엇으로",
      modules: [
        {
          no: "②",
          title: "AI 기본 이해",
          question: "AI는 무엇을 할 수 있고 없나",
          goal: "AI가 잘하는 것과 못하는 것을 현실적으로 구분합니다",
        },
        {
          no: "③",
          title: "RAG · 에이전트",
          question: "조직 지식을 어떻게 AI에 연결하나",
          goal: "조직의 지식을 AI가 활용하게 만드는 방법을 이해합니다",
        },
        {
          no: "④",
          title: "AX와 DX의 관계",
          question: "DX 없이 AX가 가능한가",
          goal: "AX가 DX 위에 선다는 것을 이해하고, DX가 미비할 때의 대응을 압니다",
        },
      ],
    },
    {
      stage: "어디에",
      modules: [
        {
          no: "⑤",
          title: "조직과 암묵지",
          question: "우리 조직의 무엇을 AI로 옮기나",
          goal: "조직 지식을 형식지와 암묵지로 구분하고, 무엇을 옮길지 판단합니다",
        },
        {
          no: "⑥",
          title: "적용 대상 설계",
          question: "워크플로우·보고라인 어디에 넣나",
          goal: "업무 흐름의 어느 지점에 AI를 넣을지 판단하는 기준을 갖습니다",
        },
      ],
    },
    {
      stage: "어떻게",
      modules: [
        {
          no: "⑦",
          title: "성공·실패 요건과 실행",
          question: "어떻게 시작하고 정착시키나",
          goal: "성공하는 조건과 실패하는 패턴을 알고, 현실적 실행 순서를 갖습니다",
        },
      ],
    },
    {
      stage: "조심·그다음",
      modules: [
        {
          no: "⑧",
          title: "리스크·거버넌스·문화",
          question: "무엇을 지키고 어떻게 문화로 만드나",
          goal: "리스크를 관리하고 일회성이 아닌 문화로 정착시키는 법을 압니다",
        },
      ],
    },
  ],
  orgTypes: [
    { type: "중소기업", motive: "적은 인력으로 더 많은 일 — 생존형 효율화" },
    { type: "대기업", motive: "부서 간 사일로, 축적된 지식의 활용 — 규모의 관리" },
    { type: "공공기관", motive: "대민 서비스 품질, 반복 행정 경감 — 공공성과 효율의 균형" },
  ],
  formats: [
    { name: "특강", duration: "2~3시간", outcome: "AX가 무엇인지 이해하고, 우리 일에 맞는지 판단할 수 있다" },
    { name: "반일 워크숍", duration: "4시간", outcome: "특강 + 우리 조직 워크플로우 진단 실습" },
    { name: "단기 과정", duration: "7시간", outcome: "핵심 문서 하나를 완성한다" },
    { name: "단기 과정", duration: "14시간", outcome: "여러 자료 유형을 반복하고 검토까지 한다" },
    { name: "단기 과정", duration: "21시간", outcome: "업무 적용 발표까지 간다" },
    { name: "시리즈", duration: "8주", outcome: "도입·정착·거버넌스까지 실행 로드맵을 갖는다" },
  ],
  guide: [
    { situation: "AX를 처음 소개, 인식 제고", recommend: "특강" },
    { situation: "경영진 대상 짧은 브리핑", recommend: "특강 (왜 · 조심할 것 중심)" },
    { situation: "실무자가 실제 업무에 적용", recommend: "반일 워크숍" },
    { situation: "업무 산출물까지 만들어야 함", recommend: "7 · 14 · 21시간" },
    { situation: "조직 차원의 도입·정착 준비", recommend: "8주 시리즈" },
  ],
  exercises: [
    "우리 조직의 AX 오해 브레인스토밍",
    "우리 팀의 암묵지 3가지 적어보기",
    "내 업무 워크플로우를 단계로 쪼개고 AI 적합 지점 표시하기",
    "우리 조직 AX 실패 시나리오 상상하기",
  ],
  credentials,
  teachingHistoryIntro: "중·고등학생을 대상으로 AI 활용 코딩과 진로 특강을 해왔고, 지금은 성인 대상 AX 교육으로 옮겨가고 있습니다.",
  teachingTopics: teaching,
  contact: {
    intro: "강의 문의를 받고 있습니다.",
    audience: "대학생 이상 성인",
    format: "대면",
    region: "전국",
  },
};
