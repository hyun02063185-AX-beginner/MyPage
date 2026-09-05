import { escapeHtml } from './escapeHtml.js';

// work·github 섹션이 공유하는 로딩/성공/에러/빈 상태 처리 (SPEC.md 5항).
// github은 loading/error/empty 전용 엘리먼트가 마크업에 있고,
// work는 없으므로 그 경우 list 컨테이너 안에 메시지를 직접 그린다.
export const PANEL_STATE = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  EMPTY: 'empty',
};

export const setPanelState = (elements, state, { message = '' } = {}) => {
  const { list, loading, error, errorText, empty } = elements;

  if (loading) {
    loading.hidden = state !== PANEL_STATE.LOADING;
  }

  if (error) {
    error.hidden = state !== PANEL_STATE.ERROR;
    if (state === PANEL_STATE.ERROR && errorText) {
      errorText.textContent = message;
    }
  }

  if (empty) {
    empty.hidden = state !== PANEL_STATE.EMPTY;
    if (state === PANEL_STATE.EMPTY) {
      empty.textContent = message;
    }
  }

  if (!list) return;

  if (state === PANEL_STATE.EMPTY && !empty) {
    list.hidden = false;
    list.innerHTML = `<p class="github-message">${escapeHtml(message)}</p>`;
    return;
  }

  list.hidden = state !== PANEL_STATE.SUCCESS;
};
