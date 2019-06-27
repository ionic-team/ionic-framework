export function attachEventProps(node: HTMLElement, newProps: any, oldProps: any = {}) {
  const className = getClassName(node.classList, newProps, oldProps);
  if(className) {
    node.className = className;
  }

  Object.keys(newProps).forEach(name => {
    if (name === 'children' || name === 'style' || name === 'ref' || name === 'className') {
      return;
    }
    if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
      const eventName = name.substring(2);
      const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);

      if (!isCoveredByReact(eventNameLc)) {
        syncEvent(node, eventNameLc, newProps[name]);
      }
    } else {
      (node as any)[name] = newProps[name];
    }
  });
}

export function getClassName(classList: DOMTokenList, newProps: any, oldProps: any) {
  // map the classes to Maps for performance
  const currentClasses = arrayToMap(classList);
  const incomingPropClasses = arrayToMap(newProps.className ? newProps.className.split(' ') : []);
  const oldPropClasses = arrayToMap(oldProps.className ? oldProps.className.split(' ') : []);
  const finalClassNames: string[] = [];
  // loop through each of the current classes on the component
  // to see if it should be a part of the classNames added
  currentClasses.forEach((currentClass) => {
    if (incomingPropClasses.has(currentClass)) {
      // add it as its already included in classnames coming in from newProps
      finalClassNames.push(currentClass);
      incomingPropClasses.delete(currentClass);
    }
    else if (!oldPropClasses.has(currentClass)) {
      // add it as it has NOT been removed by user
      finalClassNames.push(currentClass);
    }
  });
  incomingPropClasses.forEach(s => finalClassNames.push(s));
  return finalClassNames.join(' ');
}

/**
 * Checks if an event is supported in the current execution environment.
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
export function isCoveredByReact(eventNameSuffix: string, doc: Document = document) {
  const eventName = 'on' + eventNameSuffix;
  let isSupported = eventName in doc;

  if (!isSupported) {
    const element = doc.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof (<any>element)[eventName] === 'function';
  }

  return isSupported;
}

export function syncEvent(node: Element, eventName: string, newEventHandler: (e: Event) => any) {
  const eventStore = (node as any).__events || ((node as any).__events = {});
  const oldEventHandler = eventStore[eventName];

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventName, oldEventHandler);
  }

  // Bind new listener.
  node.addEventListener(eventName, eventStore[eventName] = function handler(e: Event) {
    newEventHandler.call(this, e);
  });
}

function arrayToMap(arr: string[] | DOMTokenList) {
  const map = new Map<string, string>();
  (arr as string[]).forEach((s: string) => map.set(s, s));
  return map;
}
