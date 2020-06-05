export const getElementRoot = (el: HTMLElement, fallback: HTMLElement = el) => return el.shadowRoot || fallback;
