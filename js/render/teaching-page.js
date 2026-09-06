import { teachingPage } from '../data/teaching-page.js';
import { escapeHtml } from './escapeHtml.js';

// 마크업 계약은 css/teaching.css 상단 주석 참고.

const moduleTemplate = ({ no, title, question, goal }) => `
  <article class="journey-module">
    <span class="journey-module__no">${escapeHtml(no)}</span>
    <h4 class="journey-module__title">${escapeHtml(title)}</h4>
    <p class="journey-module__question">${escapeHtml(question)}</p>
    <p class="journey-module__goal">${escapeHtml(goal)}</p>
  </article>
`;

const stageTemplate = ({ stage, modules }) => `
  <li class="journey-stage">
    <h3 class="journey-stage__label">${escapeHtml(stage)}</h3>
    <div class="journey-stage__modules">
      ${modules.map(moduleTemplate).join('')}
    </div>
  </li>
`;

const orgTypeTemplate = ({ type, motive }) => `
  <li class="org-type-item">
    <span class="org-type-item__type">${escapeHtml(type)}</span>
    <span class="org-type-item__motive">${escapeHtml(motive)}</span>
  </li>
`;

const formatRowTemplate = ({ name, duration, outcome }) => `
  <tr>
    <td>${escapeHtml(name)}</td>
    <td>${escapeHtml(duration)}</td>
    <td>${escapeHtml(outcome)}</td>
  </tr>
`;

const guideRowTemplate = ({ situation, recommend }) => `
  <tr>
    <td>${escapeHtml(situation)}</td>
    <td>${escapeHtml(recommend)}</td>
  </tr>
`;

const credentialItemTemplate = ({ name, issuer, date, verifyUrl, note }) => `
  <li class="teaching-credential-item">
    <span class="teaching-credential-item__name">
      ${escapeHtml(name)}${note ? ` <small>(${escapeHtml(note)})</small>` : ''}
    </span>
    <span class="teaching-credential-item__meta">${escapeHtml(issuer)}${date ? ` · ${escapeHtml(date)}` : ''}</span>
    ${
      verifyUrl
        ? `<a class="teaching-credential-item__link" href="${escapeHtml(verifyUrl)}" target="_blank" rel="noopener noreferrer">확인</a>`
        : ''
    }
  </li>
`;

const topicGroupTemplate = ({ category, topics, note, highlight }) => `
  <div class="teaching-topic-group">
    <h4 class="teaching-topic-group__title">${escapeHtml(category)}</h4>
    ${note ? `<p class="teaching-topic-group__note">${escapeHtml(note)}</p>` : ''}
    <div class="teaching-topic-tags">
      ${topics
        .map(
          (topic) =>
            `<span class="teaching-topic-tag${highlight ? ' teaching-topic-tag--highlight' : ''}">${escapeHtml(topic)}</span>`
        )
        .join('')}
    </div>
  </div>
`;

const renderPerspective = () => {
  const list = document.getElementById('perspective-list');
  const noteLink = document.getElementById('perspective-note-link');

  if (list) {
    list.innerHTML = teachingPage.statements
      .map((statement) => `<li class="perspective-statement">${escapeHtml(statement)}</li>`)
      .join('');
  }
  if (noteLink) noteLink.textContent = teachingPage.statementNote;
};

const renderCurriculum = () => {
  const intro = document.getElementById('curriculum-intro');
  const track = document.getElementById('journey-track');

  if (intro) intro.textContent = teachingPage.journeyIntro ?? '';
  if (track) track.innerHTML = teachingPage.journey.map(stageTemplate).join('');
};

const renderOrgTypes = () => {
  const list = document.getElementById('org-type-list');
  if (list) list.innerHTML = teachingPage.orgTypes.map(orgTypeTemplate).join('');
};

const renderFormats = () => {
  const formatsBody = document.getElementById('formats-table-body');
  const guideBody = document.getElementById('guide-table-body');

  if (formatsBody) formatsBody.innerHTML = teachingPage.formats.map(formatRowTemplate).join('');
  if (guideBody) guideBody.innerHTML = teachingPage.guide.map(guideRowTemplate).join('');
};

const renderExercises = () => {
  const list = document.getElementById('exercise-list');
  if (list) {
    list.innerHTML = teachingPage.exercises
      .map((exercise) => `<li class="exercise-item">${escapeHtml(exercise)}</li>`)
      .join('');
  }
};

// credentials·teachingTopics는 홈에서 이관하는 별도 작업 전까지 teachingPage에
// 없는 필드다. 데이터가 생기기 전까지는 섹션을 통째로 hidden 처리해
// 빈 섹션이 보이지 않게 한다. 나중에 필드가 채워지면 자동으로 렌더링된다.
const renderTeachingCredentials = () => {
  const section = document.getElementById('teaching-credentials');
  const list = document.getElementById('teaching-credentials-list');
  const items = teachingPage.credentials;
  const hasData = Array.isArray(items) && items.length > 0;

  if (section) section.hidden = !hasData;
  if (hasData && list) list.innerHTML = items.map(credentialItemTemplate).join('');
};

const renderTeachingTopics = () => {
  const section = document.getElementById('teaching-topics');
  const intro = document.getElementById('teaching-topics-intro');
  const groups = document.getElementById('teaching-topics-groups');
  const items = teachingPage.teachingTopics;
  const hasData = Array.isArray(items) && items.length > 0;

  if (section) section.hidden = !hasData;
  if (!hasData) return;

  if (intro) intro.textContent = teachingPage.teachingHistoryIntro ?? '';
  if (groups) groups.innerHTML = items.map(topicGroupTemplate).join('');
};

// contact는 스키마가 확정되기 전까지 null이다 (SPEC_teaching.md 11항).
// null인 동안은 섹션 자체를 hidden 처리한다. 확정되면 본문 템플릿을 추가한다.
const renderTeachingContact = () => {
  const section = document.getElementById('teaching-contact');
  const hasData = teachingPage.contact !== null && teachingPage.contact !== undefined;

  if (section) section.hidden = !hasData;
};

export const renderTeachingPage = () => {
  renderPerspective();
  renderCurriculum();
  renderOrgTypes();
  renderFormats();
  renderExercises();
  renderTeachingCredentials();
  renderTeachingTopics();
  renderTeachingContact();
};
