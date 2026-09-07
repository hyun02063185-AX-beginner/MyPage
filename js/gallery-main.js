import { initThemeToggle } from './motion/theme.js';
import { initHamburgerMenu, initSmoothScroll } from './motion/navigation.js';
import { initHeaderScroll, initScrollTopButton } from './motion/scrollState.js';
import { initScrollReveal } from './motion/reveal.js';
import { initPageTransition } from './motion/pageTransition.js';
import { initGalleryModal } from './motion/galleryModal.js';

import { renderGallery, getGalleryModalItems } from './render/gallery.js';
import { renderFooterYear } from './render/footer.js';

initThemeToggle();
initPageTransition();
initHamburgerMenu();
initSmoothScroll();
initHeaderScroll();
initScrollTopButton();

renderGallery();
renderFooterYear();

initGalleryModal(getGalleryModalItems());
initScrollReveal();
