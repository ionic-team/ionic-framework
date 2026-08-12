import { camelToDashCase } from './case';

/**
 * A prop name that already exists on a plain element is a native property: it
 * mirrors an attribute the element owns, and assigning to it stringifies
 * (`node.id = undefined` leaves `id="undefined"`, `node.tabIndex = undefined`
 * leaves `tabindex="0"`). Anything else is a component prop, where `null` can be
 * a real value — `ion-input` declares `value?: string | number | null` — so it
 * must still be assigned.
 */
let nativePropertyProbe: HTMLElement | undefined;
const isNativeElementProperty = (name: string) => {
  if (typeof document === 'undefined') {
    return false;
  }
  if (nativePropertyProbe === undefined) {
    nativePropertyProbe = document.createElement('div');
  }
  return name in nativePropertyProbe;
};

export const attachProps = (node: HTMLElement, newProps: any, oldProps: any = {}) => {
  // some test frameworks don't render DOM elements, so we test here to make sure we are dealing with DOM first
  if (node instanceof Element) {
    // add any classes in className to the class list
    const className = getClassName(node.classList, newProps, oldProps);
    if (className !== '') {
      node.className = className;
    }

    Object.keys(newProps).forEach((name) => {
      if (
        name === 'children' ||
        name === 'style' ||
        name === 'ref' ||
        name === 'class' ||
        name === 'className' ||
        name === 'forwardedRef'
      ) {
        return;
      }
      if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
        const eventName = name.substring(2);
        const eventNameLc = eventName[0].toLowerCase() + eventName.substring(1);

        if (!isCoveredByReact(eventNameLc)) {
          syncEvent(node, eventNameLc, newProps[name]);
        }
      } else {
        const value = newProps[name];
        const isNativeProperty = isNativeElementProperty(name);
        if (value === undefined || (value === null && isNativeProperty)) {
          /**
           * Reflected properties such as `id`, `title` and `slot` stringify
           * whatever they are given, so `node.id = undefined` leaves the element
           * with the literal attribute `id="undefined"`. Never assign an
           * undefined value. `null` stringifies the same way, but only native
           * properties are treated as empty here: a component prop may accept
           * `null` as a value.
           *
           * A prop that had a value and no longer does is a removal. For a
           * native property that means dropping the attribute, never assigning,
           * since assigning coerces again (`node.tabIndex = undefined` leaves
           * `tabindex="0"`). Both spellings have to go: the one the property
           * reflects to (`accesskey`) and the dash-cased one `render()` emits
           * (`access-key`). Other props are reset on the property, which covers
           * props with no attribute to mirror, then have the attribute the
           * string branch set removed.
           */
          const oldValue = oldProps[name];
          if (oldValue !== undefined && oldValue !== null) {
            const dashCasedName = camelToDashCase(name);
            if (isNativeProperty) {
              const reflectedName = name.toLowerCase();
              node.removeAttribute(reflectedName);
              if (dashCasedName !== reflectedName) {
                node.removeAttribute(dashCasedName);
              }
            } else {
              (node as any)[name] = undefined;
              node.removeAttribute(dashCasedName);
            }
          }
          return;
        }
        (node as any)[name] = value;
        const propType = typeof value;
        if (propType === 'string') {
          node.setAttribute(camelToDashCase(name), value);
        }
      }
    });
  }
};

export const getClassName = (classList: DOMTokenList, newProps: any, oldProps: any) => {
  const newClassProp: string = newProps.className || newProps.class;
  const oldClassProp: string = oldProps.className || oldProps.class;
  // map the classes to Maps for performance
  const currentClasses = arrayToMap(classList);
  const incomingPropClasses = arrayToMap(newClassProp ? newClassProp.split(' ') : []);
  const oldPropClasses = arrayToMap(oldClassProp ? oldClassProp.split(' ') : []);
  const finalClassNames: string[] = [];
  // loop through each of the current classes on the component
  // to see if it should be a part of the classNames added
  currentClasses.forEach((currentClass) => {
    if (incomingPropClasses.has(currentClass)) {
      // add it as its already included in classnames coming in from newProps
      finalClassNames.push(currentClass);
      incomingPropClasses.delete(currentClass);
    } else if (!oldPropClasses.has(currentClass)) {
      // add it as it has NOT been removed by user
      finalClassNames.push(currentClass);
    }
  });
  incomingPropClasses.forEach((s) => finalClassNames.push(s));
  return finalClassNames.join(' ');
};

/**
 * Transforms a React event name to a browser event name.
 */
export const transformReactEventName = (eventNameSuffix: string) => {
  switch (eventNameSuffix) {
    case 'doubleclick':
      return 'dblclick';
  }
  return eventNameSuffix;
};

/**
 * Checks if an event is supported in the current execution environment.
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
export const isCoveredByReact = (eventNameSuffix: string) => {
  if (typeof document === 'undefined') {
    return true;
  } else {
    const eventName = 'on' + transformReactEventName(eventNameSuffix);
    let isSupported = eventName in document;

    if (!isSupported) {
      const element = document.createElement('div');
      element.setAttribute(eventName, 'return;');
      isSupported = typeof (element as any)[eventName] === 'function';
    }

    return isSupported;
  }
};

export const syncEvent = (
  node: Element & { __events?: { [key: string]: ((e: Event) => any) | undefined } },
  eventName: string,
  newEventHandler?: (e: Event) => any
) => {
  const eventStore = node.__events || (node.__events = {});
  const oldEventHandler = eventStore[eventName];

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventName, oldEventHandler);
  }

  // Bind new listener.
  node.addEventListener(
    eventName,
    (eventStore[eventName] = function handler(e: Event) {
      if (newEventHandler) {
        newEventHandler.call(this, e);
      }
    })
  );
};

const arrayToMap = (arr: string[] | DOMTokenList) => {
  const map = new Map<string, string>();
  (arr as string[]).forEach((s: string) => map.set(s, s));
  return map;
};
