import { projects } from '../data/projects.js';
import { buildCardHTML } from './cardTemplate.js';
import { setPanelState, PANEL_STATE } from './statePanel.js';

const state = {
  filter: 'all',
};

const toWorkCard = ({ title, category, period, role, result, image, demoUrl }) => ({
  tag: 'article',
  eyebrow: category,
  title,
  meta: `${period} · ${role}`,
  text: result,
  image,
  imageAlt: `${title} 스크린샷`,
  linkHref: demoUrl ?? '',
  linkLabel: '데모 보기',
});

const getFilteredProjects = () =>
  state.filter === 'all' ? projects : projects.filter((project) => project.category === state.filter);

const renderWork = ({ grid }) => {
  const visible = getFilteredProjects();

  if (visible.length === 0) {
    setPanelState({ list: grid }, PANEL_STATE.EMPTY, { message: '해당 카테고리의 프로젝트가 없습니다.' });
  } else {
    grid.innerHTML = visible.map((project) => buildCardHTML(toWorkCard(project))).join('');
    setPanelState({ list: grid }, PANEL_STATE.SUCCESS);
  }
};

export const initWorkSection = () => {
  const grid = document.getElementById('work-grid');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  if (!grid) return;

  const elements = { grid };
  renderWork(elements);

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;

      filterButtons.forEach((otherBtn) => {
        otherBtn.classList.toggle('is-active', otherBtn === btn);
      });

      renderWork(elements);
    });
  });
};
