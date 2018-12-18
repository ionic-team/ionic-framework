
export function syncEvent(node: Element, eventName: string, newEventHandler: (e: Event) => any) {
  const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);
  const eventStore = (node as any).__events || ((node as any).__events = {});
  const oldEventHandler = eventStore[eventNameLc];

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventNameLc, oldEventHandler);
  }

  // Bind new listener.
  if (newEventHandler) {
    node.addEventListener(eventNameLc, eventStore[eventNameLc] = function handler(e: Event) {
      newEventHandler.call(this, e);
    });
  }
}

export const dashToPascalCase = (str: string) => str.toLowerCase().split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');

export function ensureElementInBody<E extends HTMLElement>(elementName: string): E {
  let element = document.querySelector<E>(elementName);
  if (!element) {
    element = document.createElement(elementName) as E;
    document.body.appendChild(element);
  }
  return element;
}
