export const HTMLElementSSR = (
  typeof HTMLElement !== 'undefined'
  ? HTMLElement
  : class {}) as typeof HTMLElement;
