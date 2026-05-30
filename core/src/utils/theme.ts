import type { RouterDirection } from '../components/router/utils/interface';
import type { AnimationBuilder, Color, CssClassMap } from '../interface';

export const hostContext = (selector: string, el: HTMLElement): boolean => {
  return el.closest(selector) !== null;
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
