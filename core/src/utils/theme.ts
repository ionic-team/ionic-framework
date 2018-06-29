import { CssClassMap, Mode, RouterDirection } from '../interface';

export function hostContext(selector: string, el: HTMLElement): boolean {
  return !!el.closest(selector);
}

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export function createColorClasses(color: string | undefined): CssClassMap | null {
  return (color) ? {
    'ion-color': true,
    [`ion-color-${color}`]: true
  } : null;
}

export function createThemedClasses(mode: Mode | undefined, name: string): CssClassMap {
  return {
    [name]: true,
    [`${name}-${mode}`]: !!mode
  };
}

/**
 * Get the classes from a class list and return them as an object
 */
export function getElementClassMap(classList: DOMTokenList | string[]): CssClassMap {
  const classObj: CssClassMap = {};

  for (let i = 0; i < classList.length; i++) {
    classObj[classList[i]] = true;
  }

  return classObj;
}

/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */
export function getButtonClassMap(buttonType: string | undefined, mode: Mode): CssClassMap {
  if (!buttonType) {
    return {};
  }
  return {
    [buttonType]: true,
    [`${buttonType}-${mode}`]: true
  };
}

export function getClassList(classes: string | string[] | undefined): string[] {
  if (classes) {
    const array = Array.isArray(classes) ? classes : classes.split(' ');
    return array
      .filter(c => c != null)
      .map(c => c.trim())
      .filter(c => c !== '');
  }
  return [];
}

export function getClassMap(classes: string | string[] | undefined): CssClassMap {
  const map: CssClassMap = {};
  getClassList(classes).forEach(c => map[c] = true);
  return map;
}

export async function openURL(win: Window, url: string|undefined, ev: Event, direction?: RouterDirection) {
  if (url && url[0] !== '#' && url.indexOf('://') === -1) {
    const router = win.document.querySelector('ion-router');
    if (router) {
      ev && ev.preventDefault();
      await router.componentOnReady();
      return router.push(url, direction);
    }
  }
  return Promise.resolve();
}
