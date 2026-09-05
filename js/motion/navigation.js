import { MOBILE_NAV_BREAKPOINT } from './constants.js';
import { prefersReducedMotion } from './reducedMotion.js';
import { onResizeFrame } from './scrollScheduler.js';

const setMenuState = (menu, hamburgerBtn, isOpen) => {
  menu.classList.toggle('is-open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  hamburgerBtn.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');

  const icon = hamburgerBtn.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-bars', !isOpen);
    icon.classList.toggle('fa-xmark', isOpen);
  }
};

export const initHamburgerMenu = () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('nav-menu');
  if (!hamburgerBtn || !menu) return;

  hamburgerBtn.addEventListener('click', () => {
    setMenuState(menu, hamburgerBtn, !menu.classList.contains('is-open'));
  });

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setMenuState(menu, hamburgerBtn, false));
  });

  // 모바일에서 열어둔 채로 데스크톱 폭까지 리사이즈하면 상태를 초기화한다.
  onResizeFrame(() => {
    if (window.innerWidth >= MOBILE_NAV_BREAKPOINT && menu.classList.contains('is-open')) {
      setMenuState(menu, hamburgerBtn, false);
    }
  });
};

export const initSmoothScroll = () => {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });
};
