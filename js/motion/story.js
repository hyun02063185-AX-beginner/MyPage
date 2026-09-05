import { onScrollFrame } from './scrollScheduler.js';

// story 섹션 왼쪽 진행선 채우기. 장면별 시차 등장은 reveal.js가 담당한다.
export const initStoryProgress = () => {
  const track = document.getElementById('story-track');
  const fill = document.getElementById('story-progress-fill');
  const header = document.getElementById('site-header');
  if (!track || !fill) return;

  const headerHeight = header ? header.offsetHeight : 0;

  onScrollFrame(() => {
    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight - window.innerHeight + headerHeight;
    const scrolled = headerHeight - rect.top;
    const ratio = trackHeight > 0 ? scrolled / trackHeight : 0;
    const percent = Math.min(100, Math.max(0, ratio * 100));

    fill.style.height = `${percent}%`;
  });
};
