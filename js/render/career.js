import { career } from '../data/career.js';
import { escapeHtml } from './escapeHtml.js';

const timelineItemTemplate = ({ year, title, body, caption }) => `
  <article class="career-timeline__item">
    <div class="career-timeline__year">${escapeHtml(year)}</div>
    <div class="career-timeline__content">
      <h3 class="career-timeline__title">${escapeHtml(title)}</h3>
      ${body ? `<p class="career-timeline__body">${escapeHtml(body)}</p>` : ''}
      ${caption ? `<blockquote class="career-timeline__caption">${escapeHtml(caption)}</blockquote>` : ''}
    </div>
  </article>
`;

const cardItemTemplate = ({ title, period, role, body, caption }) => `
  <article class="career-card">
    <h3 class="career-card__title">${escapeHtml(title)}</h3>
    <p class="career-card__meta">${escapeHtml(period)} · ${escapeHtml(role)}</p>
    ${body ? `<p class="career-card__body">${escapeHtml(body)}</p>` : ''}
    ${caption ? `<blockquote class="career-card__caption">${escapeHtml(caption)}</blockquote>` : ''}
  </article>
`;

const renderHallIntro = (hallNumber, { period, title, org }) => {
  const periodEl = document.getElementById(`hall-${hallNumber}-period`);
  const headingEl = document.getElementById(`hall-${hallNumber}-heading`);
  const orgEl = document.getElementById(`hall-${hallNumber}-org`);

  if (periodEl) periodEl.textContent = period;
  if (headingEl) headingEl.textContent = title;
  if (orgEl) orgEl.textContent = org;
};

export const renderCareer = () => {
  const hall1 = career.find((hall) => hall.hall === 1);
  const hall2 = career.find((hall) => hall.hall === 2);
  const hall3 = career.find((hall) => hall.hall === 3);

  if (hall1) {
    renderHallIntro(1, hall1);
    const items = document.getElementById('career-hall-1-items');
    if (items) items.innerHTML = hall1.items.map(timelineItemTemplate).join('');
  }

  if (hall2) {
    renderHallIntro(2, hall2);
    const items = document.getElementById('career-hall-2-items');
    if (items) items.innerHTML = hall2.items.map(cardItemTemplate).join('');
  }

  if (hall3) {
    renderHallIntro(3, hall3);
    const block = document.getElementById('career-hall-3-body');
    if (block) block.innerHTML = hall3.body ? `<p class="career-block__body">${escapeHtml(hall3.body)}</p>` : '';
  }
};
