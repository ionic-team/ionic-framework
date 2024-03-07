// import type { AnimationKeyFrames } from './animation-interface';

let animationPrefix: string | undefined;

export const getAnimationPrefix = (el: HTMLElement): string => {
  if (animationPrefix === undefined) {
    const supportsUnprefixed = el.style.animationName !== undefined;
    const supportsWebkitPrefix = el.style.webkitAnimationName !== undefined;
    animationPrefix = !supportsUnprefixed && supportsWebkitPrefix ? '-webkit-' : '';
  }
  return animationPrefix;
};

export const setStyleProperty = (element: HTMLElement, propertyName: string, value: string | null) => {
  const prefix = propertyName.startsWith('animation') ? getAnimationPrefix(element) : '';
  element.style.setProperty(prefix + propertyName, value);
};

export const removeStyleProperty = (element: HTMLElement, propertyName: string) => {
  const prefix = propertyName.startsWith('animation') ? getAnimationPrefix(element) : '';
  element.style.removeProperty(prefix + propertyName);
};

export const animationEnd = (el: HTMLElement | null, callback: (ev?: TransitionEvent) => void) => {
  let unRegTrans: (() => void) | undefined;
  const opts: AddEventListenerOptions = { passive: true };

  const unregister = () => {
    if (unRegTrans) {
      unRegTrans();
    }
  };

  const onTransitionEnd = (ev: Event) => {
    if (el === ev.target) {
      unregister();
      callback(ev as TransitionEvent);
    }
  };

  if (el) {
    el.addEventListener('webkitAnimationEnd', onTransitionEnd, opts);
    el.addEventListener('animationend', onTransitionEnd, opts);

    unRegTrans = () => {
      el.removeEventListener('webkitAnimationEnd', onTransitionEnd, opts);
      el.removeEventListener('animationend', onTransitionEnd, opts);
    };
  }

  return unregister;
};

export const getStyleContainer = (element: HTMLElement) => {
  // getRootNode is not always available in SSR environments.
  // TODO(FW-2832): types
  const rootNode = element.getRootNode !== undefined ? (element.getRootNode() as any) : element;
  return rootNode.head || rootNode;
};

export const addClassToArray = (classes: string[] = [], className: string | string[] | undefined): string[] => {
  if (className !== undefined) {
    const classNameToAppend = Array.isArray(className) ? className : [className];

    return [...classes, ...classNameToAppend];
  }

  return classes;
};
