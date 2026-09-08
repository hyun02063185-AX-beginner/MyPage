import { prefersReducedMotion } from './reducedMotion.js';

// AX_Lecture의 입장 워프와 같은 리듬이다. 빛이 화면을 덮는 지점에서
// 다음 문서로 이동해, 페이지 교체가 장면 전환처럼 느껴지게 한다.
const NAVIGATION_DELAY_MS = 820;
const NAVIGATION_RECOVERY_MS = 2200;
const INTERNAL_DOCUMENTS = new Set(['index.html', 'career.html', 'teaching.html', 'gallery.html', 'making.html']);

let overlay = null;
let navigationTimer = null;
let recoveryTimer = null;
let destination = null;

const clearTimers = () => {
  window.clearTimeout(navigationTimer);
  window.clearTimeout(recoveryTimer);
  navigationTimer = null;
  recoveryTimer = null;
};

const clearTransition = () => {
  clearTimers();
  overlay?.remove();
  overlay = null;
  destination = null;
};

const getDocumentName = (pathname) => {
  if (pathname.endsWith('/')) return 'index.html';
  return pathname.split('/').pop();
};

const isInternalDocumentLink = (link) => {
  if (link.hasAttribute('download') || link.target && link.target !== '_self') return false;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || url.hash) return false;
  if (!INTERNAL_DOCUMENTS.has(getDocumentName(url.pathname))) return false;

  return url.href !== window.location.href;
};

const navigate = () => {
  if (!destination) return;

  const nextPage = destination;
  destination = null;
  window.clearTimeout(navigationTimer);

  try {
    window.location.assign(nextPage);
    recoveryTimer = window.setTimeout(clearTransition, NAVIGATION_RECOVERY_MS);
  } catch {
    clearTransition();
  }
};

const createOverlay = () => {
  const element = document.createElement('div');
  element.className = 'page-transition';
  element.setAttribute('aria-hidden', 'true');

  return element;
};

const startTransition = (url) => {
  if (overlay) return;

  destination = url;
  overlay = createOverlay();
  document.body.append(overlay);

  // 오버레이의 초기 프레임을 먼저 그려야 bloom 키프레임이 매번 재생된다.
  void overlay.offsetWidth;
  requestAnimationFrame(() => overlay?.classList.add('is-active'));
  // AX_Lecture도 워프가 화면을 덮은 뒤(820ms)에 route를 전환한다.
  navigationTimer = window.setTimeout(navigate, NAVIGATION_DELAY_MS);
};

export const initPageTransition = () => {
  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      prefersReducedMotion()
    ) return;

    const link = event.target.closest('a[href]');
    if (!link || !isInternalDocumentLink(link)) return;

    event.preventDefault();
    startTransition(link.href);
  });

  // bfcache가 이전 문서를 복원해도 고정 오버레이가 남지 않게 한다.
  window.addEventListener('pagehide', clearTransition);
  window.addEventListener('pageshow', clearTransition);
};
