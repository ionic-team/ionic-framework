
export function getOrAppendElement(tagName: string): Element {
  const element = document.querySelector(tagName);
  if (element) {
    return element;
  }
  const tmp = document.createElement(tagName);
  document.body.appendChild(tmp);
  return tmp;
}

export function isElementNav(element: HTMLElement) {
  return element.tagName.toUpperCase() === 'ION-NAV';
}

export function isElementModal(element: HTMLElement) {
  return element.classList.contains('modal-wrapper');
}
