export const getElementRoot = (el: HTMLElement, fallback: HTMLElement = el) => el.shadowRoot || fallback;
