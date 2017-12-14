
export function getOrAppendElement(tagName: string): Element {
  const element = document.querySelector(tagName);
  if (element) {
    return element;
  }
  const tmp = document.createElement(tagName);
  document.body.appendChild(tmp);
  return tmp;
}