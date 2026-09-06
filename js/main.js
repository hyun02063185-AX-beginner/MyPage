import { initThemeToggle } from './motion/theme.js';
import { initHamburgerMenu, initSmoothScroll } from './motion/navigation.js';
import { initHeaderScroll, initScrollTopButton } from './motion/scrollState.js';
import { initStoryProgress } from './motion/story.js';
import { initScrollReveal } from './motion/reveal.js';

import { renderHero } from './render/hero.js';
import { renderStory } from './render/story.js';
import { renderExplain } from './render/explain.js';
import { renderTeaching } from './render/teaching.js';
import { renderCredentials } from './render/credentials.js';
import { initWorkSection } from './render/work.js';
import { initGithubSection } from './render/github.js';
import { initContactForm } from './render/contactForm.js';
import { renderFooterYear } from './render/footer.js';

initThemeToggle();
initHamburgerMenu();
initSmoothScroll();
initHeaderScroll();
initScrollTopButton();

renderHero();
renderStory();
renderExplain();
renderTeaching();
renderCredentials();
initWorkSection();
initGithubSection();
initContactForm();
renderFooterYear();

initStoryProgress();
initScrollReveal();
