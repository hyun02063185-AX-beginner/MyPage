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

  return `
    <${tag} class="card">
      ${imageBlock}
      <div class="card__body">
        ${eyebrow ? `<span class="card__eyebrow">${escapeHtml(eyebrow)}</span>` : ''}
        <h3 class="card__title">${escapeHtml(title)}</h3>
        ${meta ? `<p class="card__meta">${escapeHtml(meta)}</p>` : ''}
        ${text ? `<p class="card__text">${escapeHtml(text)}</p>` : ''}
      </div>
      ${linkBlock}
    </${tag}>
  `;
};
