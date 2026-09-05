import { buildCardHTML } from './cardTemplate.js';
import { setPanelState, PANEL_STATE } from './statePanel.js';

const GITHUB_API_URL = 'https://api.github.com/users/hyun02063185-AX-beginner/repos?sort=updated';
const FETCH_TIMEOUT_MS = 10000;

const toRepoCard = ({ name, description, html_url: htmlUrl, language, updated_at: updatedAt }) => ({
  tag: 'li',
  eyebrow: language ?? '',
  title: name,
  meta: updatedAt ? `업데이트 ${updatedAt.slice(0, 10)}` : '',
  text: description ?? '',
  linkHref: htmlUrl,
  linkLabel: 'GitHub에서 보기',
});

const getElements = () => ({
  panel: document.getElementById('github-panel'),
  loading: document.getElementById('github-loading'),
  loadingText: document.getElementById('github-loading-text'),
  error: document.getElementById('github-error'),
  errorText: document.getElementById('github-error-text'),
  empty: document.getElementById('github-empty'),
  list: document.getElementById('github-repo-list'),
  retryBtn: document.getElementById('github-retry-btn'),
});

const loadRepos = async (elements) => {
  const { loadingText, list } = elements;

  setPanelState(elements, PANEL_STATE.LOADING);
  if (loadingText) loadingText.textContent = '저장소를 불러오는 중입니다...';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(GITHUB_API_URL, { signal: controller.signal });

    if (!response.ok) {
      const message =
        response.status === 403
          ? 'GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.'
          : '저장소 목록을 불러오지 못했습니다.';
      setPanelState(elements, PANEL_STATE.ERROR, { message });
      return;
    }

    const repos = await response.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      setPanelState(elements, PANEL_STATE.EMPTY, { message: '표시할 저장소가 없습니다.' });
      return;
    }

    list.innerHTML = repos.map((repo) => buildCardHTML(toRepoCard(repo))).join('');
    setPanelState(elements, PANEL_STATE.SUCCESS);
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === 'AbortError'
        ? '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
        : '네트워크 오류로 저장소 목록을 불러오지 못했습니다.';
    setPanelState(elements, PANEL_STATE.ERROR, { message });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const initGithubSection = () => {
  const elements = getElements();
  if (!elements.panel) return;

  loadRepos(elements);

  elements.retryBtn?.addEventListener('click', () => loadRepos(elements));
};
