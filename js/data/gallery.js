import { explain } from './explain.js';
import { importedWebtoonCases } from './webtoon-imports.js';

const galleryCaseSources = [...explain.cases, ...importedWebtoonCases];

export const getGalleryCaseBySlug = (slug) => (
  galleryCaseSources.find((item) => item.slug === slug)
);

export const gallery = {
  intro: "개발 용어에서 막히는 분들이 많았습니다. 그림으로 설명해보니 반응이 달랐습니다.",
  groups: [
    {
      title: "AI가 무엇인지 알아야 할 때",
      description: "AI를 이해하기 전에, 그 안에서 쓰이는 기본 단어부터 살펴봅니다.",
      items: [
        { slug: "machine", title: "머신", summary: "계산을 수행하는 장치입니다" },
        { slug: "model", title: "모델", summary: "데이터에서 규칙을 찾아 담아둔 결과물입니다" },
        { slug: "llm", title: "LLM", summary: "말을 다루도록 아주 크게 학습시킨 모델입니다" },
        { slug: "engine", title: "엔진", summary: "실제로 일을 돌리는 부분입니다" }
      ]
    },
    {
      title: "AI를 직접 쓸 때 만나는 말",
      description: "AI에게 일을 맡기고 결과를 다룰 때 만나는 단어입니다.",
      items: [
        { slug: "prompt", title: "프롬프트", summary: "AI에게 건네는 지시입니다" },
        { slug: "embedding", title: "임베딩", summary: "뜻이 비슷한 것끼리 가까이 놓는 방식입니다" }
      ]
    },
    {
      title: "IT 담당자와 이야기할 때 나오는 말",
      description: "업무를 함께 논의할 때 자주 듣게 되는 IT 용어입니다.",
      items: [
        { slug: "api", title: "API", summary: "필요한 것을 그때그때 가져다 쓰는 통로입니다" },
        { slug: "algorithm", title: "알고리즘", summary: "일을 처리하는 순서입니다" },
        { slug: "cloud", title: "클라우드", summary: "남의 컴퓨터를 빌려 쓰는 것입니다" },
        { slug: "terminal-1", title: "터미널", summary: "마우스 대신 글자로 컴퓨터에 시키는 창입니다" },
        { slug: "legacy-ai-webtoon-02", title: "도커", summary: "실행 환경을 통째로 담아 옮기는 방법입니다" },
        { slug: "legacy-ai-webtoon-01", title: "추상화", summary: "전부 알 필요 없이 지금 필요한 만큼만 보는 것입니다" }
      ]
    }
  ]
};
