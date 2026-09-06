import { REVEAL_INTERSECTION_THRESHOLD, REVEAL_STAGGER_STEP_MS } from './constants.js';
import { prefersReducedMotion } from './reducedMotion.js';

// css/base.css의 .reveal / .reveal.is-visible 초기 상태 클래스를 토글하는 방식으로 구현.
// work·github 카드, story 장면, teaching 태그는 js/render가 비동기·재렌더링으로
// 만들어내므로, 존재하는 요소뿐 아니라 이후 추가되는 요소도 MutationObserver로 잡는다.
const REVEAL_SELECTORS = [
  '.hero-heading',
  '.hero-sub',
  '.section-heading',
  '.story-scene',
  '.teaching-tag',
  '.credential-item',
  '.card',
  '.explain-perspective__image',
  '.explain-statement',
  '.career-timeline__item',
  '.career-card',
  '.career-block',
  '.career-hall__title',
  '.teaching-heading',
  '.perspective-statement',
  '.journey-stage',
  '.journey-module',
  '.org-type-item',
  '.formats-panel',
  '.exercise-item',
  '.teaching-credential-item',
  '.teaching-topic-group',
];

// story-scene / teaching-tag / journey-module은 형제 순서대로 시차를 두고 등장시킨다.
const STAGGERED_CLASSES = ['story-scene', 'teaching-tag', 'journey-module'];

let observer = null;

const getStaggerDelay = (el) => {
  const staggerClass = STAGGERED_CLASSES.find((name) => el.classList.contains(name));
  if (!staggerClass || !el.parentElement) return 0;

  const index = Array.from(el.parentElement.children).indexOf(el);
  return Math.max(index, 0) * REVEAL_STAGGER_STEP_MS;
};

const revealElement = (el) => {
  if (el.dataset.revealBound === 'true') return;
  el.dataset.revealBound = 'true';
  el.classList.add('reveal');

  const delay = getStaggerDelay(el);
  if (delay > 0) {
    el.style.setProperty('--reveal-delay', `${delay}ms`);
  }

  if (prefersReducedMotion()) {
    el.classList.add('is-visible');
    return;
  }

  observer.observe(el);
};

const handleIntersect = (entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
};

const bindWithin = (node) => {
  REVEAL_SELECTORS.forEach((selector) => {
    if (node.matches?.(selector)) revealElement(node);
    node.querySelectorAll?.(selector).forEach(revealElement);
  });
};

export const initScrollReveal = () => {
  const main = document.getElementById('main-content');
  if (!main) return;

  observer = new IntersectionObserver(handleIntersect, {
    threshold: REVEAL_INTERSECTION_THRESHOLD,
  });

  bindWithin(main);

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        bindWithin(node);
      });
    });
  });

  mutationObserver.observe(main, { childList: true, subtree: true });
};
