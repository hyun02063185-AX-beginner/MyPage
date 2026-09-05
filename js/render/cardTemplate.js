import { escapeHtml } from './escapeHtml.js';

// work 섹션과 github 섹션이 공유하는 카드 렌더 함수 (SPEC.md 5항 공용 렌더 원칙).
// 컨테이너 태그가 <div>면 tag: 'article', <ul>이면 tag: 'li'로 호출한다.
export const buildCardHTML = ({
  tag = 'article',
  eyebrow = '',
  title = '',
  meta = '',
  text = '',
  image = '',
  imageAlt = '',
  linkHref = '',
  linkLabel = '',
} = {}) => {
  const imageBlock = image
    ? `<img class="card__image" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt || title)}" loading="lazy">`
    : '';

  const linkBlock = linkHref
    ? `<div class="card__footer">
        <a class="card__link" href="${escapeHtml(linkHref)}" target="_blank" rel="noopener noreferrer">
          <span>${escapeHtml(linkLabel)}</span>
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        </a>
      </div>`
    : '';

  // text는 문자열 하나(github) 또는 문자열 배열(work: problem/work/result)을 모두 받는다.
  const textParagraphs = Array.isArray(text) ? text : [text];
  const textBlock = textParagraphs
    .filter((paragraph) => Boolean(paragraph))
    .map((paragraph) => `<p class="card__text">${escapeHtml(paragraph)}</p>`)
    .join('');

  return `
    <${tag} class="card">
      ${imageBlock}
      <div class="card__body">
        ${eyebrow ? `<span class="card__eyebrow">${escapeHtml(eyebrow)}</span>` : ''}
        <h3 class="card__title">${escapeHtml(title)}</h3>
        ${meta ? `<p class="card__meta">${escapeHtml(meta)}</p>` : ''}
        ${textBlock}
      </div>
      ${linkBlock}
    </${tag}>
  `;
};
