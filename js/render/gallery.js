import { gallery, getGalleryCaseBySlug } from '../data/gallery.js';
import { escapeHtml } from './escapeHtml.js';

const cardTemplate = ({ slug, title, summary, image, imageAlt }) => `
  <article class="gallery-card">
    <button type="button" class="gallery-card__trigger" data-gallery-action="open" data-gallery-slug="${escapeHtml(slug)}">
      <img class="gallery-card__image" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy">
      <div class="gallery-card__content">
        <h3 class="gallery-card__title">${escapeHtml(title)}</h3>
        <p class="gallery-card__summary">${escapeHtml(summary)}</p>
      </div>
    </button>
  </article>
`;

const renderGroup = (groupNumber, { title, description, items }) => {
  const titleEl = document.getElementById(`gallery-group-${groupNumber}-title`);
  const descriptionEl = document.getElementById(`gallery-group-${groupNumber}-description`);
  const itemsEl = document.getElementById(`gallery-group-${groupNumber}-items`);

  if (titleEl) titleEl.textContent = title;
  if (descriptionEl) descriptionEl.textContent = description;
  if (itemsEl) {
    itemsEl.innerHTML = items
      .map(({ slug, title: itemTitle, summary }) => {
        const detail = getGalleryCaseBySlug(slug);
        return cardTemplate({
          slug,
          title: itemTitle,
          summary,
          image: detail?.image ?? '',
          imageAlt: detail?.imageAlt ?? '',
        });
      })
      .join('');
  }
};

export const renderGallery = () => {
  const introEl = document.getElementById('gallery-intro');
  if (introEl) introEl.textContent = gallery.intro;

  gallery.groups.forEach((group, index) => {
    renderGroup(index + 1, group);
  });
};

export const getGalleryModalItems = () =>
  gallery.groups.flatMap((group) =>
    group.items.map(({ slug, title }) => {
      const detail = getGalleryCaseBySlug(slug);
      return {
        slug,
        title,
        image: detail?.image ?? '',
        imageAlt: detail?.imageAlt ?? '',
        paragraphs: detail?.paragraphs ?? [],
      };
    })
  );
