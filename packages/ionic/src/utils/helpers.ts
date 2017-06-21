
export function isDef(v: any): boolean { return v !== undefined && v !== null; }

export function isUndef(v: any): boolean { return v === undefined || v === null; }

export function isArray(v: any): v is Array<any> { return Array.isArray(v); }

export function isObject(v: any): v is Object { return v !== null && typeof v === 'object'; }

export function isBoolean(v: any): v is (boolean) { return typeof v === 'boolean'; }

export function isString(v: any): v is (string) { return typeof v === 'string'; }

export function isNumber(v: any): v is (number) { return typeof v === 'number'; }

export function isFunction(v: any): v is (Function) { return typeof v === 'function'; }

export function isStringOrNumber(v: any): v is (string | number) { return isString(v) || isNumber(v); }

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

  if (elm) {
    for (var i = 0; i < styleProps.length; i++) {
      (<any>elm.style)[styleProps[i]] = styles[styleProps[i]];
    }
  }
}
