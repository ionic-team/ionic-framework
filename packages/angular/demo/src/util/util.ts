
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
