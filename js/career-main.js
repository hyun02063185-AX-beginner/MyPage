import { initThemeToggle } from './motion/theme.js';
import { initHamburgerMenu, initSmoothScroll } from './motion/navigation.js';
import { initHeaderScroll, initScrollTopButton } from './motion/scrollState.js';
import { initScrollReveal } from './motion/reveal.js';
import { initCareerSpotlight } from './motion/careerSpotlight.js';
import { initCareerTransitions } from './motion/careerTransitions.js';
import { initPageTransition } from './motion/pageTransition.js';

import { renderCareer } from './render/career.js';
import { renderFooterYear } from './render/footer.js';

initThemeToggle();
initPageTransition();
initHamburgerMenu();
initSmoothScroll();
initHeaderScroll();
initScrollTopButton();

renderCareer();
renderFooterYear();

initScrollReveal();
initCareerSpotlight();
initCareerTransitions();
