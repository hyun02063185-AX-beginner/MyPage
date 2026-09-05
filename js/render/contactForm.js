const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS = [
  {
    id: 'contact-name',
    errorId: 'contact-name-error',
    validate: (value) => (value.trim() ? '' : '이름을 입력해 주세요.'),
  },
  {
    id: 'contact-email',
    errorId: 'contact-email-error',
    validate: (value) => {
      if (!value.trim()) return '이메일을 입력해 주세요.';
      return EMAIL_PATTERN.test(value) ? '' : '올바른 이메일 형식이 아닙니다.';
    },
  },
  {
    id: 'contact-message',
    errorId: 'contact-message-error',
    validate: (value) => (value.trim() ? '' : '문의 내용을 입력해 주세요.'),
  },
];

const validateField = (field) => {
  const input = document.getElementById(field.id);
  const errorEl = document.getElementById(field.errorId);
  if (!input || !errorEl) return true;

  const message = field.validate(input.value);
  errorEl.textContent = message;
  input.closest('.form-field')?.classList.toggle('has-error', Boolean(message));

  return !message;
};

export const initContactForm = () => {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('contact-success-message');
  if (!form) return;

  FIELDS.forEach((field) => {
    const input = document.getElementById(field.id);
    input?.addEventListener('input', () => validateField(field));
    input?.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = FIELDS.map(validateField).every(Boolean);

    if (!isValid) {
      if (successMessage) successMessage.hidden = true;
      return;
    }

    // 실제 전송은 아직 연결하지 않는다. 성공 메시지만 표시한다.
    if (successMessage) {
      successMessage.hidden = false;
      successMessage.textContent = '문의가 접수되었습니다. 빠르게 확인하겠습니다.';
    }
    form.reset();
  });
};
