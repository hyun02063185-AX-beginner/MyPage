// 스크롤·리사이즈 이벤트를 requestAnimationFrame으로 묶어서
// 프레임당 한 번만 콜백이 실행되도록 한다 (과도한 호출 방지).
const schedule = (eventName, callback) => {
  let ticking = false;

  const handler = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      callback();
      ticking = false;
    });
  };

  window.addEventListener(eventName, handler, { passive: true });
  handler();

  return () => window.removeEventListener(eventName, handler);
};

export const onScrollFrame = (callback) => schedule('scroll', callback);
export const onResizeFrame = (callback) => schedule('resize', callback);
