import { ViewController } from './nav-interfaces';

export const STATE_NEW = 1;
export const STATE_INITIALIZED = 2;
export const STATE_ATTACHED = 3;
export const STATE_DESTROYED = 4;

export const INIT_ZINDEX = 100;

export const DIRECTION_BACK = 'back';
export const DIRECTION_FORWARD = 'forward';
export const DIRECTION_SWITCH = 'switch';

export const NAV = 'nav';
export const TABS = 'tabs';



export function isViewController(object: any): boolean {
  return !!(object && object.didLoad && object.willUnload);
}

export function setZIndex(_isPortal: boolean, _enteringView: ViewController, _leavingView: ViewController, _direction: string) {
  // TODO
}

export function toggleHidden(element: HTMLElement, isVisible: Boolean, shouldBeVisible: boolean) {
  if (isVisible !== shouldBeVisible) {
    element.hidden = shouldBeVisible;
  }
}