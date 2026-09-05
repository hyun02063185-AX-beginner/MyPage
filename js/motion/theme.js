import { THEME_STORAGE_KEY, DARK_THEME, LIGHT_THEME } from './constants.js';

const root = document.documentElement;

const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStoredTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage 접근 불가 환경에서는 저장을 건너뛴다.
  }
};

const applyThemeToUI = (theme, toggleBtn) => {
  const isDark = theme === DARK_THEME;

  if (isDark) {
    root.setAttribute('data-theme', DARK_THEME);
  } else {
    root.removeAttribute('data-theme');
  }

  if (!toggleBtn) return;

  toggleBtn.setAttribute('aria-pressed', String(isDark));
  toggleBtn.setAttribute('aria-label', isDark ? '라이트모드 전환' : '다크모드 전환');

  const icon = toggleBtn.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-moon', !isDark);
    icon.classList.toggle('fa-sun', isDark);
  }
};

// 모듈이 로드되는 즉시(초기화 함수 호출 전) 저장된 테마를 먼저 적용해
// 화면 깜빡임을 최소화한다. main.js에서 이 모듈을 가장 먼저 import할 것.
const storedTheme = readStoredTheme() === DARK_THEME ? DARK_THEME : LIGHT_THEME;
if (storedTheme === DARK_THEME) {
  root.setAttribute('data-theme', DARK_THEME);
}

export const initThemeToggle = () => {
  const toggleBtn = document.getElementById('theme-toggle');
  applyThemeToUI(storedTheme, toggleBtn);

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyThemeToUI(nextTheme, toggleBtn);
    writeStoredTheme(nextTheme);
  });
};
