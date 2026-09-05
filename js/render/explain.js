import { explain } from '../data/explain.js';
import { escapeHtml } from './escapeHtml.js';

const statementTemplate = (statement) => `<li class="explain-statement">${escapeHtml(statement)}</li>`;

const caseTemplate = ({ title, concept, image, imageAlt, paragraphs }) => `
  <article class="card explain-case-card">
    <img class="explain-case-card__image" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}">
    <div class="card__body">
      <span class="card__eyebrow">${escapeHtml(concept)}</span>
      <h3 class="card__title">${escapeHtml(title)}</h3>
      ${paragraphs.map((paragraph) => `<p class="card__text">${escapeHtml(paragraph)}</p>`).join('')}
    </div>
  </article>
`;

export const renderExplain = () => {
  const { perspective, cases } = explain;

  const image = document.getElementById('explain-image');
  const caption = document.getElementById('explain-caption');
  const statements = document.getElementById('explain-statements');
  const caseGrid = document.getElementById('explain-case-grid');

  if (image) {
    image.src = perspective.image;
    image.alt = perspective.imageAlt;
  }

  if (caption) caption.textContent = perspective.caption;

  if (statements) statements.innerHTML = perspective.statements.map(statementTemplate).join('');

  if (caseGrid) caseGrid.innerHTML = cases.map(caseTemplate).join('');
};
