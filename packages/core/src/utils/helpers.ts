import { StencilElement } from '..';

export function clamp(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

export function isDef(v: any): boolean { return v !== undefined && v !== null; }

export function isUndef(v: any): boolean { return v === undefined || v === null; }

export function isArray(v: any): v is Array<any> { return Array.isArray(v); }

export function isObject(v: any): v is Object { return v !== null && typeof v === 'object'; }

export function isBoolean(v: any): v is (boolean) { return typeof v === 'boolean'; }

export function isString(v: any): v is (string) { return typeof v === 'string'; }

export function isNumber(v: any): v is (number) { return typeof v === 'number'; }

export function isFunction(v: any): v is (Function) { return typeof v === 'function'; }

export function isStringOrNumber(v: any): v is (string | number) { return isString(v) || isNumber(v); }

/** @hidden */
export function isCheckedProperty(a: any, b: any): boolean {
  if (a === undefined || a === null || a === '') {
    return (b === undefined || b === null || b === '');

  } else if (a === true || a === 'true') {
    return (b === true || b === 'true');

  } else if (a === false || a === 'false') {
    return (b === false || b === 'false');

  } else if (a === 0 || a === '0') {
    return (b === 0 || b === '0');
  }

  // not using strict comparison on purpose
  return (a == b); // tslint:disable-line
}

export function assert(bool: boolean, msg: string) {
  if (!bool) {
    console.error(msg);
  }
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

export function updateDetail(ev: any, detail: any) {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  let x = 0;
  let y = 0;
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      var touch = changedTouches[0];
      x = touch.clientX;
      y = touch.clientY;
    }else if (ev.pageX !== undefined) {
      x = ev.pageX;
      y = ev.pageY;
    }
  }
  detail.currentX = x;
  detail.currentY = y;
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

export type ElementRef = 'child' | 'parent' | 'body' | 'document' | 'window';

export function getElementReference(elm: any, ref: ElementRef) {
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

export function getToolbarHeight(toolbarTagName: string, pageChildren: HTMLElement[], mode: string, iosHeight: string, defaultHeight: string) {
  for (var i = 0; i < pageChildren.length; i++) {
    if (pageChildren[i].tagName === toolbarTagName) {
      var headerHeight = pageChildren[i].getAttribute(`${mode}-height`);
      if (headerHeight) {
        return headerHeight;
      }

      if (mode === 'ios') {
        return iosHeight;
      }

      return defaultHeight;
    }
  }

  return '';
}

/** @hidden */
export type Side = 'left' | 'right' | 'start' | 'end';

export function checkEdgeSide(posX: number, isRightSide: boolean, maxEdgeStart: number): boolean {
  if (isRightSide) {
    return posX >= window.innerWidth - maxEdgeStart;
  } else {
    return posX <= maxEdgeStart;
  }
}

/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 * @param defaultRight whether the default side is right
 */
export function isRightSide(side: Side, isRTL: boolean, defaultRight: boolean = false): boolean {
  switch (side) {
    case 'right': return true;
    case 'left': return false;
    case 'end': return !isRTL;
    case 'start': return isRTL;
    default: return defaultRight ? !isRTL : isRTL;
  }
}

/** @hidden */
export function swipeShouldReset(isResetDirection: boolean, isMovingFast: boolean, isOnResetZone: boolean): boolean {
  // The logic required to know when the sliding item should close (openAmount=0)
  // depends on three booleans (isCloseDirection, isMovingFast, isOnCloseZone)
  // and it ended up being too complicated to be written manually without errors
  // so the truth table is attached below: (0=false, 1=true)
  // isCloseDirection | isMovingFast | isOnCloseZone || shouldClose
  //         0        |       0      |       0       ||    0
  //         0        |       0      |       1       ||    1
  //         0        |       1      |       0       ||    0
  //         0        |       1      |       1       ||    0
  //         1        |       0      |       0       ||    0
  //         1        |       0      |       1       ||    1
  //         1        |       1      |       0       ||    1
  //         1        |       1      |       1       ||    1
  // The resulting expression was generated by resolving the K-map (Karnaugh map):
  return (!isMovingFast && isOnResetZone) || (isResetDirection && isMovingFast);
}

export function isReady(element: Element): Promise<any> {
  return new Promise((resolve) => {
    (element as StencilElement).componentOnReady((elm: HTMLElement) => {
      resolve(elm);
    });
  });
}

export function getOrAppendElement(tagName: string): Element {
  const element = document.querySelector(tagName);
  if (element) {
    return element;
  }
  const tmp = document.createElement(tagName);
  document.body.appendChild(tmp);
  return tmp;
}

/** @hidden */
export function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function getWindow() {
  return window;
}

export function getDocument() {
  return document;
}

export function getActiveElement(): HTMLElement {
  return getDocument()['activeElement'] as HTMLElement;
}

export function focusOutActiveElement() {
  const activeElement = getActiveElement();
  activeElement && activeElement.blur && activeElement.blur();
}

export function isTextInput(ele: any) {
  return !!ele &&
      (ele.tagName === 'TEXTAREA'
      || ele.contentEditable === 'true'
      || (ele.tagName === 'INPUT' && !(NON_TEXT_INPUT_REGEX.test(ele.type))));
}
export const NON_TEXT_INPUT_REGEX = /^(radio|checkbox|range|file|submit|reset|color|image|button)$/i;

export function hasFocusedTextInput() {
  const activeElement = getActiveElement();
  if (isTextInput(activeElement)) {
    return activeElement.parentElement.querySelector(':focus') === activeElement;
  }
  return false;
}

/**
 * @private
 */
export function reorderArray(array: any[], indexes: {from: number, to: number}): any[] {
  const element = array[indexes.from];
  array.splice(indexes.from, 1);
  array.splice(indexes.to, 0, element);
  return array;
}
