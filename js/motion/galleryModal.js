import { prefersReducedMotion } from './reducedMotion.js';

const SWIPE_THRESHOLD_PX = 45;
const FOCUSABLE_SELECTOR = 'button, a[href], [tabindex]:not([tabindex="-1"])';

let items = [];
let currentIndex = -1;
let triggerElement = null;
let touchStartX = 0;
let touchStartY = 0;

let modal = null;
let dialog = null;
let imageEl = null;
let titleEl = null;
let paragraphsEl = null;

const getFocusableElements = () =>
  Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled')
  );

const fillModalContent = (item) => {
  imageEl.src = item.image;
  imageEl.alt = item.imageAlt;
  titleEl.textContent = item.title;

  paragraphsEl.textContent = '';
  item.paragraphs.forEach((paragraph) => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    paragraphsEl.append(p);
  });
};

const showItem = (index) => {
  currentIndex = index;
  fillModalContent(items[currentIndex]);
};

const trapFocus = (event) => {
  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements();
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showPrevious();
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    showNext();
    return;
  }

  trapFocus(event);
};

const showPrevious = () => {
  if (items.length === 0) return;
  showItem((currentIndex + items.length - 1) % items.length);
};

const showNext = () => {
  if (items.length === 0) return;
  showItem((currentIndex + 1) % items.length);
};

const openModal = (index, trigger) => {
  if (index < 0 || index >= items.length) return;

  triggerElement = trigger ?? null;
  showItem(index);

  modal.hidden = false;
  document.body.classList.add('gallery-modal-open');
  document.addEventListener('keydown', handleKeydown);

  if (prefersReducedMotion()) {
    modal.classList.add('is-open');
    dialog.focus();
    return;
  }

  requestAnimationFrame(() => {
    modal.classList.add('is-open');
    dialog.focus();
  });
};

const closeModal = () => {
  if (modal.hidden) return;

  modal.classList.remove('is-open');
  modal.hidden = true;
  document.body.classList.remove('gallery-modal-open');
  document.removeEventListener('keydown', handleKeydown);

  if (triggerElement && document.contains(triggerElement)) {
    triggerElement.focus();
  }
  triggerElement = null;
  currentIndex = -1;
};

const handleTouchStart = (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
};

const handleTouchEnd = (event) => {
  const touch = event.changedTouches[0];
  if (!touch) return;

  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) return;

  if (deltaX > 0) {
    showPrevious();
  } else {
    showNext();
  }
};

const findIndexBySlug = (slug) => items.findIndex((item) => item.slug === slug);

const handleClick = (event) => {
  const openTrigger = event.target.closest('[data-gallery-action="open"]');
  if (openTrigger) {
    const index = findIndexBySlug(openTrigger.dataset.gallerySlug);
    if (index !== -1) openModal(index, openTrigger);
    return;
  }

  const closeTrigger = event.target.closest('[data-gallery-action="close"]');
  if (closeTrigger && !modal.hidden) {
    closeModal();
    return;
  }

  const previousTrigger = event.target.closest('[data-gallery-action="previous"]');
  if (previousTrigger && !modal.hidden) {
    showPrevious();
    return;
  }

  const nextTrigger = event.target.closest('[data-gallery-action="next"]');
  if (nextTrigger && !modal.hidden) {
    showNext();
  }
};

export const initGalleryModal = (galleryItems) => {
  items = Array.isArray(galleryItems) ? galleryItems : [];

  modal = document.getElementById('gallery-modal');
  if (!modal) return;

  dialog = document.getElementById('gallery-modal-dialog');
  imageEl = document.getElementById('gallery-modal-image');
  titleEl = document.getElementById('gallery-modal-title');
  paragraphsEl = document.getElementById('gallery-modal-paragraphs');

  document.addEventListener('click', handleClick);
  dialog.addEventListener('touchstart', handleTouchStart, { passive: true });
  dialog.addEventListener('touchend', handleTouchEnd, { passive: true });
};
