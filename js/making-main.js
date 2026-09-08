import { initThemeToggle } from './motion/theme.js';
import { initHamburgerMenu, initSmoothScroll } from './motion/navigation.js';
import { initHeaderScroll, initScrollTopButton } from './motion/scrollState.js';
import { initPageTransition } from './motion/pageTransition.js';
import { renderFooterYear } from './render/footer.js';

initThemeToggle();
initPageTransition();
initHamburgerMenu();
initSmoothScroll();
initHeaderScroll();
initScrollTopButton();
renderFooterYear();
