import { getContext } from '../global/context';
import { AnimationBuilder, BackButtonEvent, HTMLIonOverlayElement, IonicConfig, OverlayInterface } from '../interface';

let lastId = 0;

export const createOverlay = <T extends HTMLIonOverlayElement>(elm: T, opts: object | undefined): Promise<T> => {
  const doc = elm.ownerDocument!;
  const overlayIndex = lastId++;

  connectListeners(doc);

  // convert the passed in overlay options into props
  // that get passed down into the new overlay
  Object.assign(elm, opts);
  elm.classList.add('overlay-hidden');
  elm.overlayIndex = overlayIndex;
  if (!elm.hasAttribute('id')) {
    elm.id = `ion-overlay-${overlayIndex}`;
  }

  // append the overlay element to the document body
  getAppRoot(doc).appendChild(elm);

  return (elm as any).componentOnReady();
};

export const connectListeners = (doc: Document) => {
  if (lastId === 0) {
    lastId = 1;
    // trap focus inside overlays
    doc.addEventListener('focusin', ev => {
      const lastOverlay = getOverlay(doc);
      if (lastOverlay && lastOverlay.backdropDismiss && !isDescendant(lastOverlay, ev.target as HTMLElement)) {
        const firstInput = lastOverlay.querySelector('input,button') as HTMLElement | null;
        if (firstInput) {
          firstInput.focus();
        }
      }
    });

    // handle back-button click
    doc.addEventListener('ionBackButton', ev => {
      const lastOverlay = getOverlay(doc);
      if (lastOverlay && lastOverlay.backdropDismiss) {
        (ev as BackButtonEvent).detail.register(100, () => {
          return lastOverlay.dismiss(undefined, BACKDROP);
        });
      }
    });

    // handle ESC to close overlay
    doc.addEventListener('keyup', ev => {
      if (ev.key === 'Escape') {
        const lastOverlay = getOverlay(doc);
        if (lastOverlay && lastOverlay.backdropDismiss) {
          lastOverlay.dismiss(undefined, BACKDROP);
        }
      }
    });
  }
};

export const dismissOverlay = (doc: Document, data: any, role: string | undefined, overlayTag: string, id?: string): Promise<boolean> => {
  const overlay = getOverlay(doc, overlayTag, id);
  if (!overlay) {
    return Promise.reject('overlay does not exist');
  }
  return overlay.dismiss(data, role);
};

export const getOverlays = (doc: Document, overlayTag?: string): HTMLIonOverlayElement[] => {
  const overlays = (Array.from(getAppRoot(doc).children) as HTMLIonOverlayElement[]).filter(c => c.overlayIndex > 0);
  if (overlayTag === undefined) {
    return overlays;
  }
  overlayTag = overlayTag.toUpperCase();
  return overlays.filter(c => c.tagName === overlayTag);
};

export const getOverlay = (doc: Document, overlayTag?: string, id?: string): HTMLIonOverlayElement | undefined => {
  const overlays = getOverlays(doc, overlayTag);
  return (id === undefined)
    ? overlays[overlays.length - 1]
    : overlays.find(o => o.id === id);
};

export const present = async (
  overlay: OverlayInterface,
  name: keyof IonicConfig,
  iosEnterAnimation: AnimationBuilder,
  mdEnterAnimation: AnimationBuilder,
  opts?: any
) => {
  if (overlay.presented) {
    return;
  }
  overlay.presented = true;
  overlay.willPresent.emit();

  // get the user's animation fn if one was provided
  const config = getContext(overlay, 'config');
  const animationBuilder = (overlay.enterAnimation)
    ? overlay.enterAnimation
    : config.get(name, overlay.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

  const completed = await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
  if (completed) {
    overlay.didPresent.emit();
  }
};

export const dismiss = async (
  overlay: OverlayInterface,
  data: any | undefined,
  role: string | undefined,
  name: keyof IonicConfig,
  iosLeaveAnimation: AnimationBuilder,
  mdLeaveAnimation: AnimationBuilder,
  opts?: any
): Promise<boolean> => {
  if (!overlay.presented) {
    return false;
  }
  overlay.presented = false;

  try {
    overlay.willDismiss.emit({ data, role });

    const config = getContext(overlay, 'config');
    const animationBuilder = (overlay.leaveAnimation)
      ? overlay.leaveAnimation
      : config.get(name, overlay.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
    overlay.didDismiss.emit({ data, role });

  } catch (err) {
    console.error(err);
  }

  overlay.el.remove();
  return true;
};

const getAppRoot = (doc: Document) =>
  doc.querySelector('ion-app') || doc.body;

const overlayAnimation = async (
  overlay: OverlayInterface,
  animationBuilder: AnimationBuilder,
  baseEl: any,
  opts: any
): Promise<boolean> => {
  if (overlay.animation) {
    overlay.animation.destroy();
    overlay.animation = undefined;
    return false;
  }
  // Make overlay visible in case it's hidden
  baseEl.classList.remove('overlay-hidden');

  const aniRoot = baseEl.shadowRoot || overlay.el;
  const animation = overlay.animation = await import('./animation').then(mod => mod.create(animationBuilder, aniRoot, opts));
  overlay.animation = animation;

  const config = getContext(overlay, 'config');
  if (!overlay.animated || !config.getBoolean('animated', true)) {
    animation.duration(0);
  }
  if (overlay.keyboardClose) {
    animation.beforeAddWrite(() => {
      const activeElement = baseEl.ownerDocument!.activeElement as HTMLElement;
      if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
        activeElement.blur();
      }
    });
  }
  await animation.playAsync();
  const hasCompleted = animation.hasCompleted;
  animation.destroy();
  overlay.animation = undefined;
  return hasCompleted;
};

export const autoFocus = (containerEl: HTMLElement): HTMLElement | undefined => {
  const focusableEls = containerEl.querySelectorAll('a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex="0"]');
  if (focusableEls.length > 0) {
    const el = focusableEls[0] as HTMLInputElement;
    el.focus();
    return el;
  }
  return undefined;
};

export const eventMethod = <T>(elm: HTMLElement, eventName: string): Promise<T> => {
  let resolve: (detail: T) => void;
  const promise = new Promise<T>(r => resolve = r);
  onceEvent(elm, eventName, (event: any) => {
    resolve(event.detail);
  });
  return promise;
};

export const onceEvent = (elm: HTMLElement, eventName: string, callback: (ev: Event) => void) => {
  const handler = (ev: Event) => {
    elm.removeEventListener(eventName, handler);
    callback(ev);
  };
  elm.addEventListener(eventName, handler);
};

export const isCancel = (role: string | undefined): boolean =>
  role === 'cancel' || role === BACKDROP;

const isDescendant = (parent: HTMLElement, child: HTMLElement | null) => {
  while (child) {
    if (child === parent) {
      return true;
    }
    child = child.parentElement;
  }
  return false;
};

export const BACKDROP = 'backdrop';
