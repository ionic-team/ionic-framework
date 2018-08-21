import { AnimationBuilder, HTMLIonOverlayElement, IonicConfig, OverlayInterface } from '../interface';

let lastId = 0;

export function createOverlay<T extends HTMLIonOverlayElement & Required<B>, B>(element: T, opts: B): Promise<T> {
  const doc = element.ownerDocument;
  connectListeners(doc);

  // convert the passed in overlay options into props
  // that get passed down into the new overlay
  Object.assign(element, opts);

  element.overlayId = lastId++;

  // append the overlay element to the document body
  getAppRoot(doc).appendChild(element);

  doc.body.addEventListener('keyup', ev => {
    if (ev.key === 'Escape') {
      const lastOverlay = getOverlay(doc);
      if (lastOverlay && lastOverlay.backdropDismiss) {
        lastOverlay.dismiss(null, BACKDROP);
      }
    }
  });

  return element.componentOnReady();
}

export function connectListeners(doc: Document) {
  if (lastId === 0) {
    lastId = 1;
    doc.body.addEventListener('keyup', ev => {
      if (ev.key === 'Escape') {
        const lastOverlay = getOverlay(doc);
        if (lastOverlay && lastOverlay.backdropDismiss === true) {
          lastOverlay.dismiss('backdrop');
        }
      }
    });
  }
}

export function dismissOverlay(doc: Document, data: any, role: string | undefined, overlayTag: string, id: number): Promise<void> {
  const overlay = getOverlay(doc, overlayTag, id);
  if (!overlay) {
    return Promise.reject('overlay does not exist');
  }
  return overlay.dismiss(data, role);
}

export function getOverlays(doc: Document, overlayTag?: string): HTMLIonOverlayElement[] {
  const overlays = Array.from(getAppRoot(doc).children) as HTMLIonOverlayElement[];
  if (overlayTag == null) {
    return overlays;
  }
  overlayTag = overlayTag.toUpperCase();
  return overlays.filter(c => c.tagName === overlayTag);
}

export function getOverlay(doc: Document, overlayTag?: string, id?: number): HTMLIonOverlayElement | undefined {
  const overlays = getOverlays(doc, overlayTag);
  if (id != null) {
    return overlays.find(o => o.overlayId === id);
  }
  return (id == null)
    ? overlays[overlays.length - 1]
    : overlays.find(o => o.overlayId === id);
}

export async function present(
  overlay: OverlayInterface,
  name: keyof IonicConfig,
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
  data: any | undefined,
  role: string | undefined,
  name: keyof IonicConfig,
  iosLeaveAnimation: AnimationBuilder,
  mdLeaveAnimation: AnimationBuilder,
  opts?: any
): Promise<void> {
  if (!overlay.presented) {
    return;
  }
  overlay.presented = false;

  overlay.willDismiss.emit({ data, role });

  const animationBuilder = (overlay.leaveAnimation)
    ? overlay.leaveAnimation
    : overlay.config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

  await overlayAnimation(overlay, animationBuilder, overlay.el, opts);

  overlay.didDismiss.emit({ data, role });
  overlay.el.remove();
}

function getAppRoot(doc: Document) {
  return doc.querySelector('ion-app') || doc.body;
}

async function overlayAnimation(
  overlay: OverlayInterface,
  animationBuilder: AnimationBuilder,
  baseEl: HTMLElement,
  opts: any
): Promise<void> {
  if (overlay.animation) {
    overlay.animation.destroy();
    overlay.animation = undefined;
  }

  const aniRoot = baseEl.shadowRoot || overlay.el;
  const animation = overlay.animation = await overlay.animationCtrl.create(animationBuilder, aniRoot, opts);
  overlay.animation = animation;
  if (!overlay.willAnimate) {
    animation.duration(0);
  }
  if (overlay.keyboardClose) {
    animation.beforeAddWrite(() => {
      const activeElement = baseEl.ownerDocument.activeElement as HTMLElement;
      if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
        activeElement.blur();
      }
    });
  }
  await animation.playAsync();

  animation.destroy();
  overlay.animation = undefined;
}

export function autoFocus(containerEl: HTMLElement): HTMLElement | null {
  const focusableEls = containerEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
  if (focusableEls.length > 0) {
    const el = focusableEls[0] as HTMLInputElement;
    el.focus();
    return el;
  }
  return null;
}

export function eventMethod<T>(element: HTMLElement, eventName: string, callback?: (detail: T) => void): Promise<T> {
  let resolve: (detail: T) => void;
  const promise = new Promise<T>(r => resolve = r);
  onceEvent(element, eventName, (event: any) => {
    const detail = event.detail;
    if (callback) {
      callback(detail);
    }
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

export function isCancel(role: string | undefined): boolean {
  return role === 'cancel' || role === BACKDROP;
}

export const BACKDROP = 'backdrop';
