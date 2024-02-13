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
