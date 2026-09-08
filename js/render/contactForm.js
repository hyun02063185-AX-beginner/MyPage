const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrpgydar';

const FIELDS = [
  {
    id: 'contact-name',
    errorId: 'contact-name-error',
    label: '이름',
    validate: (value) => (value.trim() ? '' : '이름을 입력해 주세요.'),
  },
  {
    id: 'contact-email',
    errorId: 'contact-email-error',
    label: '이메일',
    validate: (value) => {
      if (!value.trim()) return '이메일을 입력해 주세요.';
      return EMAIL_PATTERN.test(value) ? '' : '올바른 이메일 형식이 아닙니다.';
    },
  },
  {
    id: 'contact-message',
    errorId: 'contact-message-error',
    label: '문의 내용',
    validate: (value) => (value.trim() ? '' : '문의 내용을 입력해 주세요.'),
  },
];

const validateField = (field) => {
  const input = document.getElementById(field.id);
  const errorEl = document.getElementById(field.errorId);
  if (!input || !errorEl) return true;

  const message = field.validate(input.value);
  errorEl.textContent = message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
  input.closest('.form-field')?.classList.toggle('has-error', Boolean(message));

  return !message;
};

const setMessage = (element, message) => {
  if (!element) return;
  element.textContent = message;
  element.hidden = !message;
};

const clearValidation = () => {
  FIELDS.forEach((field) => {
    const input = document.getElementById(field.id);
    const errorEl = document.getElementById(field.errorId);
    if (!input || !errorEl) return;

    errorEl.textContent = '';
    input.setAttribute('aria-invalid', 'false');
    input.closest('.form-field')?.classList.remove('has-error');
  });
};

const createSubmissionData = (form) => {
  const data = new FormData();

  FIELDS.forEach((field) => {
    const input = document.getElementById(field.id);
    data.append(field.label, input?.value.trim() ?? '');
  });

  const honeypot = form.elements.namedItem('_gotcha');
  if (honeypot instanceof HTMLInputElement) data.append('_gotcha', honeypot.value);

  return data;
};

export const initContactForm = () => {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('contact-success-message');
  const statusMessage = document.getElementById('contact-submit-status');
  const submitError = document.getElementById('contact-submit-error');
  const submitButton = document.getElementById('contact-submit-btn');
  if (!form) return;

  let isSubmitting = false;
  const idleButtonLabel = submitButton?.textContent ?? '문의 보내기';

  const setSubmitting = (submitting) => {
    isSubmitting = submitting;
    form.setAttribute('aria-busy', String(submitting));
    if (!submitButton) return;

    submitButton.disabled = submitting;
    submitButton.textContent = submitting ? '문의 보내는 중…' : idleButtonLabel;
  };

  FIELDS.forEach((field) => {
    const input = document.getElementById(field.id);
    input?.addEventListener('input', () => validateField(field));
    input?.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const isValid = FIELDS.map(validateField).every(Boolean);

    if (!isValid) {
      setMessage(successMessage, '');
      setMessage(statusMessage, '');
      setMessage(submitError, '');
      return;
    }

    setMessage(successMessage, '');
    setMessage(submitError, '');
    setMessage(statusMessage, '문의 내용을 보내는 중입니다.');
    setSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: createSubmissionData(form),
      });

      if (!response.ok) throw new Error(`Formspree request failed: ${response.status}`);

      form.reset();
      clearValidation();
      setMessage(statusMessage, '');
      setMessage(successMessage, '문의가 접수되었습니다. 빠르게 확인하겠습니다.');
    } catch {
      setMessage(statusMessage, '');
      setMessage(submitError, '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  });
};
