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

const getSystemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: light)').matches ? LIGHT_THEME : DARK_THEME;

const getInitialTheme = () => {
  const storedTheme = readStoredTheme();
  if (storedTheme === DARK_THEME || storedTheme === LIGHT_THEME) return storedTheme;

  return getSystemTheme();
};

const applyThemeToUI = (theme, toggleBtn) => {
  const isDark = theme === DARK_THEME;

  if (isDark) root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', LIGHT_THEME);

  if (!toggleBtn) return;

  toggleBtn.setAttribute('aria-pressed', String(isDark));
  toggleBtn.setAttribute('aria-label', isDark ? '라이트모드 전환' : '다크모드 전환');

  const icon = toggleBtn.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-moon', !isDark);
    icon.classList.toggle('fa-sun', isDark);
  }
};

export const initThemeToggle = () => {
  const toggleBtn = document.getElementById('theme-toggle');
  applyThemeToUI(getInitialTheme(), toggleBtn);

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    applyThemeToUI(nextTheme, toggleBtn);
    writeStoredTheme(nextTheme);
  });
};
