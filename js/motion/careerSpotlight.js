import { prefersReducedMotion } from './reducedMotion.js';

const SPOTLIGHT_SELECTOR = '.career-timeline__item, .career-card';
const DESKTOP_QUERY = '(min-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SPOTLIGHT_ROOT_MARGIN = '-30% 0px -30% 0px';

export const initCareerSpotlight = () => {
  const items = Array.from(document.querySelectorAll(SPOTLIGHT_SELECTOR));
  if (!items.length) return;

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  let observer = null;

  const clearSpotlight = () => {
    document.documentElement.classList.remove('career-spotlight-active');
    items.forEach((item) => item.classList.remove('is-spotlit'));
  };

  const enableSpotlight = () => {
    document.documentElement.classList.add('career-spotlight-active');
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-spotlit', entry.isIntersecting);
        });
      },
      { rootMargin: SPOTLIGHT_ROOT_MARGIN, threshold: 0 }
    );

    items.forEach((item) => observer.observe(item));
  };

  const updateSpotlight = () => {
    observer?.disconnect();
    clearSpotlight();

    if (!desktopQuery.matches || prefersReducedMotion() || reducedMotionQuery.matches) return;
    enableSpotlight();
  };

  desktopQuery.addEventListener('change', updateSpotlight);
  reducedMotionQuery.addEventListener('change', updateSpotlight);
  updateSpotlight();
};
