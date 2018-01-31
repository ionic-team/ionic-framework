
export function hydrateElement(element: any) {
  return element.componentOnReady();
}

export function getElement(elementName: string) {
  return document.querySelector(elementName);
}

export function ensureElementInBody(elementName: string) {
  let element = getElement(elementName);
  if (!element) {
    element = document.createElement(elementName);
    document.body.appendChild(element);
  }
  return element;
}

export function removeAllNodeChildren(element: HTMLElement) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function isString(something: any) {
  return typeof something === 'string' ? true : false;
}

/**
 * Flattens single-level nested arrays.
 */
export function flatten<T>(arr: T[][]): T[] {
  return Array.prototype.concat.apply([], arr);
}