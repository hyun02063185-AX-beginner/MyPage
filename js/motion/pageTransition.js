import { prefersReducedMotion } from './reducedMotion.js';

const TRANSITION_DURATION_MS = 1160;
const TRANSITION_FALLBACK_MS = TRANSITION_DURATION_MS + 160;
const NAVIGATION_RECOVERY_MS = 2200;
const INTERNAL_DOCUMENTS = new Set(['index.html', 'career.html', 'teaching.html']);

let overlay = null;
let fallbackTimer = null;
let recoveryTimer = null;
let destination = null;

const clearTimers = () => {
  window.clearTimeout(fallbackTimer);
  window.clearTimeout(recoveryTimer);
  fallbackTimer = null;
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
  window.clearTimeout(fallbackTimer);

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
  element.innerHTML = '<span class="page-transition__core"></span>';

  element.addEventListener('animationend', (event) => {
    if (event.animationName === 'page-transition-bloom' && event.pseudoElement === '::before') {
      navigate();
    }
  });

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
  fallbackTimer = window.setTimeout(navigate, TRANSITION_FALLBACK_MS);
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
