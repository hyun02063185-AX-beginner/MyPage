import { skills, skillsHeading } from '../data/skills.js';
import { escapeHtml } from './escapeHtml.js';

const groupTemplate = ({ group, items }) => `
  <article class="skills-group">
    <h3 class="skills-group__title">${escapeHtml(group)}</h3>
    <ul class="skills-tags">
      ${items.map((item) => `<li class="skills-tag">${escapeHtml(item)}</li>`).join('')}
    </ul>
  </article>
`;

export const renderSkills = () => {
  const heading = document.getElementById('skills-heading');
  const groups = document.getElementById('skills-groups');

  if (heading) heading.textContent = skillsHeading;
  if (groups) groups.innerHTML = skills.map(groupTemplate).join('');
};
