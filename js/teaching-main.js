import { initThemeToggle } from './motion/theme.js';
import { initHamburgerMenu, initSmoothScroll } from './motion/navigation.js';
import { initHeaderScroll, initScrollTopButton } from './motion/scrollState.js';
import { initScrollReveal } from './motion/reveal.js';
import { initPageTransition } from './motion/pageTransition.js';

import { renderTeachingPage } from './render/teaching-page.js';
import { renderFooterYear } from './render/footer.js';

initThemeToggle();
initPageTransition();
initHamburgerMenu();
initSmoothScroll();
initHeaderScroll();
initScrollTopButton();

renderTeachingPage();
renderFooterYear();

initScrollReveal();
