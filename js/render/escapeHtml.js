const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// 사용자 입력·API 응답을 템플릿 리터럴로 마크업에 꽂기 전에 반드시 거친다.
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
