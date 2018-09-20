import { hasShadowDom } from './helpers';

export const KEY_CODES = {
  ENTER: 13
};

export function submitFormOnEnterPress(el: HTMLElement, ev: KeyboardEvent) {
  const form = el.closest('form');
  if (form) {
    ev.stopPropagation();
    const submitButton: HTMLElement | null = form.querySelector('[type="submit"]');
    if (submitButton) {
      if (hasShadowDom(submitButton)) {
        const fakeButton = document.createElement('button');
        fakeButton.type = 'submit';
        fakeButton.style.display = 'none';
        form.appendChild(fakeButton);
        console.log(form);
        fakeButton.click();
        fakeButton.remove();
      } else {
        submitButton.click();
      }
    }
  }
}
