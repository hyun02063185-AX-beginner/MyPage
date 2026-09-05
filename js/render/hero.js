import { hero } from '../data/hero.js';

export const renderHero = () => {
  const heading = document.getElementById('hero-heading');
  const sub = document.getElementById('hero-sub');

  if (heading) heading.textContent = hero.heading;
  if (sub) sub.textContent = hero.sub;
};
