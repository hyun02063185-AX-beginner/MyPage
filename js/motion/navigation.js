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

// 해시를 달고 진입한 경우(예: career.html에서 index.html#contact) 이미지·폰트·비동기
// 렌더로 레이아웃이 늦게 자라 목적지가 어긋난다. load 후 즉시 정렬하고, 그 뒤 한 번 더
// 사용자가 아직 스크롤을 시작하지 않았을 때만 재정렬한다.
export const initHashTarget = () => {
  const { hash } = window.location;
  if (!hash) return;

  const snap = () => {
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
  };

  let userScrolled = false;
  const markUserScroll = () => { userScrolled = true; };
  window.addEventListener('wheel', markUserScroll, { passive: true, once: true });
  window.addEventListener('touchstart', markUserScroll, { passive: true, once: true });
  window.addEventListener('keydown', markUserScroll, { once: true });

  window.addEventListener('load', () => {
    snap();
    window.setTimeout(() => {
      if (!userScrolled) snap();
    }, 800);
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
      // URL 해시를 갱신하되 history 항목은 추가하지 않아 Back/Forward를 방해하지 않는다.
      window.history.replaceState(null, '', `#${targetId}`);
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });
};
