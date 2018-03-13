


export function proxyMethod(ctrlName: string, methodName: string, ...args: any[]) {
  const controller = ensureElementInBody(ctrlName);
  return controller.componentOnReady()
    .then(() => (controller as any)[methodName].apply(args));
}

export function ensureElementInBody(elementName: string) {
  let element = document.querySelector(elementName);
  if (!element) {
    element = document.createElement(elementName);
    document.body.appendChild(element);
  }
  return element as HTMLStencilElement;
}

export function removeAllNodeChildren(element: HTMLElement) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function isString(something: any) {
  return typeof something === 'string' ? true : false;
}

export function getIonApp(): Promise<HTMLIonAppElement> {
  const element = ensureElementInBody('ion-app') as HTMLIonAppElement;
  return element.componentOnReady();
}
