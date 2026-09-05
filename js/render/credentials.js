import { credentials } from '../data/credentials.js';
import { escapeHtml } from './escapeHtml.js';

const itemTemplate = ({ name, issuer, date, verifyUrl, note }) => `
  <li class="credential-item">
    <span class="credential-item__name">
      ${escapeHtml(name)}${note ? ` <small>(${escapeHtml(note)})</small>` : ''}
    </span>
    <span class="credential-item__meta">${escapeHtml(issuer)}${date ? ` · ${escapeHtml(date)}` : ''}</span>
    ${
      verifyUrl
        ? `<a class="credential-item__link" href="${escapeHtml(verifyUrl)}" target="_blank" rel="noopener noreferrer">확인</a>`
        : ''
    }
  </li>
`;

export const renderCredentials = () => {
  const list = document.getElementById('credentials-list');
  if (!list) return;

  list.innerHTML = credentials.map(itemTemplate).join('');
};
