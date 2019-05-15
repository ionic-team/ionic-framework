import { Color, CssClassMap, RouterDirection } from '../interface';

export function hostContext(selector: string, el: HTMLElement): boolean {
  return el.closest(selector) !== null;
}

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export function createColorClasses(color: Color | undefined | null): CssClassMap | undefined {
  return (typeof color === 'string' && color.length > 0) ? {
    'ion-color': true,
    [`ion-color-${color}`]: true
  } : undefined;
}

export function getClassList(classes: string | (string | null | undefined)[] | undefined): string[] {
  if (classes !== undefined) {
    const array = Array.isArray(classes) ? classes : classes.split(' ');
    return array
      .filter(c => c != null)
      .map(c => (c as string).trim())
      .filter(c => c !== '');
  }
  return [];
}

export function getClassMap(classes: string | string[] | undefined): CssClassMap {
  const map: CssClassMap = {};
  getClassList(classes).forEach(c => map[c] = true);
  return map;
}

const SCHEME = /^[a-z][a-z0-9+\-.]*:/;

export async function openURL(win: Window, url: string | undefined | null, ev: Event | undefined | null, direction: RouterDirection): Promise<boolean> {
  if (url != null && url[0] !== '#' && !SCHEME.test(url)) {
    const router = win.document.querySelector('ion-router');
    if (router) {
      if (ev != null) {
        ev.preventDefault();
      }
      await router.componentOnReady();
      return router.push(url, direction);
    }
  }
  return false;
}
