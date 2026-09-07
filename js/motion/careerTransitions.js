import { prefersReducedMotion } from './reducedMotion.js';

const TRANSITION_SELECTOR = '.career-transition';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const TRANSITION_ROOT_MARGIN = '-38% 0px -38% 0px';

export const initCareerTransitions = () => {
  const transitions = Array.from(document.querySelectorAll(TRANSITION_SELECTOR));
  if (!transitions.length) return;

  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  let observer = null;

  const showAll = () => {
    transitions.forEach((transition) => transition.classList.add('is-visible'));
  };

  const updateTransitions = () => {
    observer?.disconnect();
    transitions.forEach((transition) => transition.classList.remove('is-visible'));

    if (prefersReducedMotion() || reducedMotionQuery.matches) {
      showAll();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { rootMargin: TRANSITION_ROOT_MARGIN, threshold: 0 }
    );

    transitions.forEach((transition) => observer.observe(transition));
  };

  reducedMotionQuery.addEventListener('change', updateTransitions);
  updateTransitions();
};
