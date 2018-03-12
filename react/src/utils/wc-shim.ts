export function wc(events = {}, obj = {}) {
  let storedEl: HTMLElement;

  return function (el: HTMLElement) {

    (Object as any).entries(events).forEach((keyValues: string[]) => {
      const name = keyValues[0];
      const value = keyValues[1];
      const action = (el) ? el.addEventListener : storedEl.removeEventListener;
      if (typeof value === 'function') {
        action(name, value);
        return;
      }
    });
    if (el) {
      (Object as any).entries(obj).forEach((keyValues: string[]) => {
        const name = keyValues[0];
        const value = keyValues[1];
        (el as any)[name] = value;
      });
    }
    storedEl = el;
  };
}