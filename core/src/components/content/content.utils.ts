import { componentOnReady } from "../../utils/helpers";

/**
 * Waits for the element host fully initialize before
 * returning the inner scroll element.
 *
 * For `ion-content` the scroll target will be the result
 * of the `getScrollElement` function.
 *
 * For custom implementations it will be the element host
 * or a selector within the host, if supplied through `scrollTarget`.
 */
export const getScrollElement = async (el: HTMLElement, scrollTarget: string | null = null) => {
  await new Promise(resolve => componentOnReady(el, resolve));

  if (el?.tagName === 'ION-CONTENT') {
    return await (el as HTMLIonContentElement).getScrollElement();
  }

  if (scrollTarget) {
    return el.querySelector<HTMLElement>(scrollTarget) ?? el;
  }

  return el;
}
