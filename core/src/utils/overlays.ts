import { EventEmitter } from '@stencil/core';
import { Animation, AnimationBuilder, Config, Mode } from '../interface';

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
  // that get passed down into the new overlay
  Object.assign(element, opts);

  element.overlayId = lastId++;

  // append the overlay element to the document body
  const doc = element.ownerDocument;
  const appRoot = doc.querySelector('ion-app') || doc.body;
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

export async function present(
  overlay: OverlayInterface,
  name: string,
  iosEnterAnimation: AnimationBuilder,
  mdEnterAnimation: AnimationBuilder,
  opts?: any
) {
  if (overlay.presented) {
    return;
  }
  overlay.presented = true;
  overlay.willPresent.emit();

  // get the user's animation fn if one was provided
  const animationBuilder = (overlay.enterAnimation)
    ? overlay.enterAnimation
    : overlay.config.get(name, overlay.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

  await overlayAnimation(overlay, animationBuilder, overlay.el, opts);

  overlay.didPresent.emit();
}

export async function dismiss(
  overlay: OverlayInterface,
  data: any|undefined,
  role: string|undefined,
  name: string,
  iosLeaveAnimation: AnimationBuilder,
  mdLeaveAnimation: AnimationBuilder,
  opts?: any
): Promise<void> {
  if (!overlay.presented) {
    return;
  }
  overlay.presented = false;

  overlay.willDismiss.emit({data, role});

  const animationBuilder = (overlay.leaveAnimation)
    ? overlay.leaveAnimation
    : overlay.config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

  await overlayAnimation(overlay, animationBuilder, overlay.el, opts);

  overlay.didDismiss.emit({data, role});
  overlay.el.remove();
}


async function overlayAnimation(
  overlay: OverlayInterface,
  animationBuilder: AnimationBuilder,
  baseEl: HTMLElement,
  opts: any
): Promise<void> {
  if (overlay.keyboardClose) {
    const activeElement = baseEl.ownerDocument.activeElement as HTMLElement;
    activeElement && activeElement.blur && activeElement.blur();
  }
  if (overlay.animation) {
    overlay.animation.destroy();
    overlay.animation = undefined;
  }
  const animation = overlay.animation = await overlay.animationCtrl.create(animationBuilder, baseEl, opts);
  overlay.animation = animation;
  if (!overlay.willAnimate) {
    animation.duration(0);
  }
  await animation.playAsync();

  animation.destroy();
  overlay.animation = undefined;
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

export function isCancel(role: string|undefined): boolean {
  return role === 'cancel' || role === BACKDROP;
}

export interface OverlayEventDetail {
  data?: any;
  role?: string;
}

export interface OverlayInterface {
  mode: Mode;
  el: HTMLElement;
  willAnimate: boolean;
  keyboardClose: boolean;
  config: Config;
  overlayId: number;
  presented: boolean;
  animation?: Animation;
  animationCtrl: HTMLIonAnimationControllerElement;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;

  didPresent: EventEmitter<void>;
  willPresent: EventEmitter<void>;
  willDismiss: EventEmitter<OverlayEventDetail>;
  didDismiss: EventEmitter<OverlayEventDetail>;

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
