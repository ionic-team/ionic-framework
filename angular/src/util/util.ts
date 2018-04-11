export function proxyMethod(ctrlName: string, methodName: string, ...args: any[]) {
  const controller = ensureElementInBody(ctrlName);
  return controller.componentOnReady()
    .then(() => (controller as any)[methodName].apply(controller, args));
}

export function ensureElementInBody(elementName: string) {
  let element = document.querySelector(elementName);
  if (!element) {
    element = document.createElement(elementName);
    document.body.appendChild(element);
  }
  return element as HTMLStencilElement;
}

export function objectValues(obj: any): any[] {
  return Object.keys(obj).map(key => obj[key]);
}

export function deepEqual(x: any, y: any) {
  if (x === y) {
    return true;
  } else if (typeof x === 'object' && x != null && (typeof y === 'object' && y != null)) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (const prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
}

