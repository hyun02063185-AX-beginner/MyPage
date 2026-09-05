import { teaching, teachingIntro } from '../data/teaching.js';
import { escapeHtml } from './escapeHtml.js';

const groupTemplate = ({ category, topics, note, highlight }) => `
  <div class="teaching-group">
    <h3 class="teaching-group__title">${escapeHtml(category)}</h3>
    ${note ? `<p class="teaching-group__note">${escapeHtml(note)}</p>` : ''}
    <div class="teaching-tags">
      ${topics
        .map(
          (topic) =>
            `<span class="teaching-tag${highlight ? ' teaching-tag--highlight' : ''}">${escapeHtml(topic)}</span>`
        )
        .join('')}
    </div>
  </div>
`;

export const renderTeaching = () => {
  const intro = document.getElementById('teaching-intro');
  const groups = document.getElementById('teaching-groups');

  if (intro) intro.textContent = teachingIntro;
  if (groups) groups.innerHTML = teaching.map(groupTemplate).join('');
};
