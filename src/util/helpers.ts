
export function isDef(s: any): boolean { return s !== undefined && s !== null; }

export function isUndef(s: any): boolean { return s === undefined; }

export function isArray(val: any): val is Array<any> { return (!!val) && (val.constructor === Array); }

export function isObject(val: any): val is Object { return typeof val === 'object'; }

export function isBoolean(val: any): val is (boolean) { return typeof val === 'boolean'; }

export function isString(val: any): val is (string) { return typeof val === 'string'; }

export function isNumber(val: any): val is (number) { return typeof val === 'number'; }

export function isFunction(val: any): val is (Function) { return typeof val === 'function'; }

export function isStringOrNumber(s: any): s is (string | number) {
  return isString(s) || isNumber(s);
}

export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export function toDashCase(str: string) {
  return str.replace(/([A-Z])/g, (g) => '-' + g[0].toLowerCase());
}

export function noop() {}

export function pointerCoordX(ev: any): number {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientX;
    }
    if (ev.pageX !== undefined) {
      return ev.pageX;
    }
  }
  return 0;
}

export function pointerCoordY(ev: any): number {
  // get Y coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientY;
    }
    if (ev.pageY !== undefined) {
      return ev.pageY;
    }
  }
  return 0;
}

export function getElementReference(elm: any, ref: string) {
  if (ref === 'child') {
    return elm.firstElementChild;
  }
  if (ref === 'parent') {
    return getParentElement(elm) || elm;
  }
  if (ref === 'body') {
    return elm.ownerDocument.body;
  }
  if (ref === 'document') {
    return elm.ownerDocument;
  }
  if (ref === 'window') {
    return elm.ownerDocument.defaultView;
  }
  return elm;
}

export function getParentElement(elm: any) {
  if (elm.parentElement ) {
    // normal element with a parent element
    return elm.parentElement;
  }
  if (elm.parentNode && elm.parentNode.host) {
    // shadow dom's document fragment
    return elm.parentNode.host;
  }
  return null;
}

export function applyStyles(elm: HTMLElement, styles: {[styleProp: string]: string|number}) {
  const styleProps = Object.keys(styles);

  for (var i = 0; i < styleProps.length; i++) {
    (<any>elm.style)[styleProps[i]] = styles[styleProps[i]];
  }
}
