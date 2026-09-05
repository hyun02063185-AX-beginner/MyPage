import { story } from '../data/story.js';
import { escapeHtml } from './escapeHtml.js';

const sceneTemplate = ({ id, title, badge, paragraphs }) => `
  <li class="story-scene" id="${escapeHtml(id)}">
    <span class="story-scene__badge">${escapeHtml(badge)}</span>
    <h3 class="story-scene__title">${escapeHtml(title)}</h3>
    ${paragraphs.map((paragraph) => `<p class="story-scene__text">${escapeHtml(paragraph)}</p>`).join('')}
  </li>
`;

export const renderStory = () => {
  const track = document.getElementById('story-track');
  if (!track) return;

  track.innerHTML = story.map(sceneTemplate).join('');
};
