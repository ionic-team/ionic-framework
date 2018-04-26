
export function waitUntilVisible(el: HTMLElement, callback?: Function) {
  return new Promise((resolve) => {
    if (IntersectionObserver) {
      const io = new IntersectionObserver(data => {
        if (data[0].isIntersecting) {
          resolve();
          io.disconnect();
        }
      });
      io.observe(el);
    } else {
      // fall back to setTimeout for Safari and IE
      setTimeout(() => resolve(), 300);
    }
  }).then(() => {
    callback && callback();
  });
}
