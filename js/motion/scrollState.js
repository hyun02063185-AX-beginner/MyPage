import { SCROLL_TOP_BUTTON_THRESHOLD, HEADER_SCROLLED_THRESHOLD } from './constants.js';
import { prefersReducedMotion } from './reducedMotion.js';
import { onScrollFrame } from './scrollScheduler.js';

export const initHeaderScroll = () => {
  const header = document.getElementById('site-header');
  if (!header) return;

  onScrollFrame(() => {
    header.classList.toggle('is-scrolled', window.scrollY >= HEADER_SCROLLED_THRESHOLD);
  });
};

export const initScrollTopButton = () => {
  const button = document.getElementById('scroll-top-btn');
  if (!button) return;

  // 이후 표시/숨김은 CSS의 opacity·transform(.is-visible)로만 제어한다.
  button.hidden = false;

  onScrollFrame(() => {
    button.classList.toggle('is-visible', window.scrollY >= SCROLL_TOP_BUTTON_THRESHOLD);
  });

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  });
};
