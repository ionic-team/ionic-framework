import { EventEmitter } from '@stencil/core';
import { Animation, AnimationBuilder, Config } from '..';

let lastId = 1;

/**
 * Convert an interface where all the properties are optional to mandatory.
 */
export type Requires<K extends string> = {
  [P in K]: any;
};

export function createOverlay<T extends HTMLIonOverlayElement & Requires<keyof B>, B>
(element: T, opts: B): Promise<T> {
  // convert the passed in overlay options into props
  // that get passed down into the new alert
  Object.assign(element, opts);

  element.overlayId = lastId++;

  // append the alert element to the document body
  const appRoot = document.querySelector('ion-app') || document.body;
  appRoot.appendChild(element);

  return element.componentOnReady();
}

export function dismissOverlay(data: any, role: string|undefined, overlays: OverlayMap, id: number): Promise<void> {
  id = id >= 0 ? id : getHighestId(overlays);
  const overlay = overlays.get(id);
  if (!overlay) {
    return Promise.reject('overlay does not exist');
  }
  return overlay.dismiss(data, role);
}

export function getTopOverlay<T extends HTMLIonOverlayElement>(overlays: OverlayMap): T {
  return overlays.get(getHighestId(overlays)) as T;
}

export function getHighestId(overlays: OverlayMap) {
  let minimum = -1;
  overlays.forEach((_, id) => {
    if (id > minimum) {
      minimum = id;
    }
  });
  return minimum;
}

export function removeLastOverlay(overlays: OverlayMap) {
  const toRemove = getTopOverlay(overlays);
  return toRemove ? toRemove.dismiss() : Promise.resolve();
}

export function present(
  overlay: OverlayInterface,
  name: string,
  iosEnterAnimation: AnimationBuilder,
  mdEnterAnimation: AnimationBuilder,
  opts?: any
) {
  if (overlay.presented) {
    return Promise.resolve();
  }
  overlay.presented = true;
  overlay.willPresent.emit();

  // get the user's animation fn if one was provided
  const animationBuilder = (overlay.enterAnimation)
    ? overlay.enterAnimation
    : overlay.config.get(name, overlay.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

  return overlayAnimation(overlay, animationBuilder, overlay.el, opts).then(() => {
    overlay.didPresent.emit();
  });
}

export function dismiss(
  overlay: OverlayInterface,
  data: any|undefined,
  role: string|undefined,
  name: string,
  iosLeaveAnimation: AnimationBuilder,
  mdLeaveAnimation: AnimationBuilder,
  opts?: any
): Promise<void> {
  if (!overlay.presented) {
    return Promise.resolve();
  }
  overlay.presented = false;

  overlay.willDismiss.emit({data, role});

  const animationBuilder = (overlay.leaveAnimation)
    ? overlay.leaveAnimation
    : overlay.config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

  return overlayAnimation(overlay, animationBuilder, overlay.el, opts).then(() => {
    overlay.didDismiss.emit({data, role});
    overlay.el.remove();
  });
}


function overlayAnimation(
  overlay: OverlayInterface,
  animationBuilder: AnimationBuilder,
  baseEl: HTMLElement,
  opts: any
): Promise<void> {
  if (overlay.animation) {
    overlay.animation.destroy();
    overlay.animation = undefined;
  }
  if (overlay.keyboardClose) {
    closeKeyboard();
  }
  return overlay.animationCtrl.create(animationBuilder, baseEl, opts).then(animation => {
    overlay.animation = animation;
    if (!overlay.willAnimate) {
      animation.duration(0);
    }
    return animation.playAsync();
  }).then(animation => {
    animation.destroy();
    overlay.animation = undefined;
  });
}

export function autoFocus(containerEl: HTMLElement): HTMLElement|null {
  const focusableEls = containerEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
  if (focusableEls.length > 0) {
    const el = focusableEls[0] as HTMLInputElement;
    el.focus();
    return el;
  }
  return null;
}

export function eventMethod<T>(element: HTMLElement, eventName: string, callback?: (detail: T) => void): Promise<T> {
  let resolve: Function;
  const promise = new Promise<T>(r => resolve = r);
  onceEvent(element, eventName, (event: any) => {
    const detail = event.detail;
    callback && callback(detail);
    resolve(detail);
  });
  return promise;
}

export function onceEvent(element: HTMLElement, eventName: string, callback: (ev: Event) => void) {
  const handler = (ev: Event) => {
    element.removeEventListener(eventName, handler);
    callback(ev);
  };
  element.addEventListener(eventName, handler);
}

function closeKeyboard() {
  const activeElement = document.activeElement as HTMLElement;
  activeElement && activeElement.blur && activeElement.blur();
}

export function isCancel(role: string|undefined): boolean {
  return role === 'cancel' || role === BACKDROP;
}

export interface OverlayEventDetail {
  data?: any;
  role?: string;
}

export interface OverlayInterface {
  mode: string;
  el: HTMLElement;
  willAnimate: boolean;
  keyboardClose: boolean;
  config: Config;
  overlayId: number;
  presented: boolean;
  animation: Animation|undefined;
  animationCtrl: HTMLIonAnimationControllerElement;

  enterAnimation: AnimationBuilder;
  leaveAnimation: AnimationBuilder;

  didPresent: EventEmitter;
  willPresent: EventEmitter;
  willDismiss: EventEmitter;
  didDismiss: EventEmitter;

  present(): Promise<void>;
  dismiss(data?: any, role?: string): Promise<void>;
}

export interface OverlayController {
  create(opts?: any): Promise<HTMLElement>;
  dismiss(data?: any, role?: string, alertId?: number): Promise<void>;
  getTop(): HTMLElement;
}

export interface HTMLIonOverlayElement extends HTMLStencilElement {
  overlayId: number;
  dismiss(data?: any, role?: string): Promise<void>;
}

export type OverlayMap = Map<number, HTMLIonOverlayElement>;

export const BACKDROP = 'backdrop';
