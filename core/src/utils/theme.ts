import type { RouterDirection } from '../components/router/utils/interface';
import type { AnimationBuilder, Color, CssClassMap } from '../interface';

/**
 * Checks if an element has a parent matching the specified selector.
 * This handles an element in both light DOM and shadow DOM contexts.
 * @param selector The parent selector to check for (e.g., 'ion-datetime'
 * or 'ion-toolbar[color]').
 * @param el The element to check.
 * @returns `true` if the element has a parent matching the specified selector,
 * `false` otherwise.
 */
export const hostContext = (selector: string, el: HTMLElement): boolean => {
  // Check the light DOM first
  if (el.closest(selector) !== null) {
    return true;
  }

  // For attribute or class selectors (e.g., 'ion-toolbar[color]' or
  // 'ion-toolbar.ion-color') we can only check light DOM since tagName
  // doesn't include attributes or classes.
  if (selector.includes('[') || selector.includes('.')) {
    return false;
  }

  // Check the shadow DOM by looking at the shadow root host and
  // converting the selector to uppercase to compare with tagName
  const upperCaseTagName = selector.toUpperCase();
  const rootNode = el.getRootNode();
  const shadowHost = rootNode instanceof ShadowRoot ? (rootNode as ShadowRoot).host : null;

  return shadowHost?.tagName === upperCaseTagName;
};

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export const createColorClasses = (color: Color | undefined | null, cssClassMap: CssClassMap): CssClassMap => {
  return typeof color === 'string' && color.length > 0
    ? {
        'ion-color': true,
        [`ion-color-${color}`]: true,
        ...cssClassMap,
      }
    : cssClassMap;
};

export const getClassList = (classes: string | (string | null | undefined)[] | undefined): string[] => {
  if (classes !== undefined) {
    const array = Array.isArray(classes) ? classes : classes.split(' ');
    return array
      .filter((c) => c != null)
      .map((c) => (c as string).trim())
      .filter((c) => c !== '');
  }
  return [];
};

export const getClassMap = (classes: string | string[] | undefined): CssClassMap => {
  const map: CssClassMap = {};
  getClassList(classes).forEach((c) => (map[c] = true));
  return map;
};

const SCHEME = /^[a-z][a-z0-9+\-.]*:/;

export const openURL = async (
  url: string | undefined | null,
  ev: Event | undefined | null,
  direction: RouterDirection,
  animation?: AnimationBuilder
): Promise<boolean> => {
  if (url != null && url[0] !== '#' && !SCHEME.test(url)) {
    const router = document.querySelector('ion-router');
    if (router) {
      if (ev != null) {
        ev.preventDefault();
      }
      return router.push(url, direction, animation);
    }
  }
  return false;
};
