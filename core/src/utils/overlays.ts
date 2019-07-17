import { config } from '../global/config';
import { ActionSheetOptions, AlertOptions, AnimationBuilder, BackButtonEvent, HTMLIonOverlayElement, IonicConfig, LoadingOptions, ModalOptions, OverlayInterface, PickerOptions, PopoverOptions, ToastOptions } from '../interface';

let lastId = 0;

const createController = <Opts extends object, HTMLElm extends any>(tagName: string) => {
  return {
    create(options: Opts): Promise<HTMLElm> {
      return createOverlay(tagName, options) as any;
    },
    dismiss(data?: any, role?: string, id?: string) {
      return dismissOverlay(document, data, role, tagName, id);
    },
    async getTop(): Promise<HTMLElm | undefined> {
      return getOverlay(document, tagName) as any;
    }
  };
};

export const alertController = /*@__PURE__*/createController<AlertOptions, HTMLIonAlertElement>('ion-alert');
export const actionSheetController = /*@__PURE__*/createController<ActionSheetOptions, HTMLIonActionSheetElement>('ion-action-sheet');
export const loadingController = /*@__PURE__*/createController<LoadingOptions, HTMLIonLoadingElement>('ion-loading');
export const modalController = /*@__PURE__*/createController<ModalOptions, HTMLIonModalElement>('ion-modal');
export const pickerController = /*@__PURE__*/createController<PickerOptions, HTMLIonPickerElement>('ion-picker');
export const popoverController = /*@__PURE__*/createController<PopoverOptions, HTMLIonPopoverElement>('ion-popover');
export const toastController = /*@__PURE__*/createController<ToastOptions, HTMLIonToastElement>('ion-toast');

export const createOverlay = <T extends HTMLIonOverlayElement>(tagName: string, opts: object | undefined): Promise<T> => {
  return customElements.whenDefined(tagName).then(() => {
    const doc = document;
    const element = doc.createElement(tagName) as HTMLIonOverlayElement;
    connectListeners(doc);

    // convert the passed in overlay options into props
    // that get passed down into the new overlay
    Object.assign(element, opts);
    element.classList.add('overlay-hidden');
    const overlayIndex = lastId++;
    element.overlayIndex = overlayIndex;
    if (!element.hasAttribute('id')) {
      element.id = `ion-overlay-${overlayIndex}`;
    }

    // append the overlay element to the document body
    getAppRoot(doc).appendChild(element);

    return element.componentOnReady() as any;
  });
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

const getAppRoot = (doc: Document) => {
  return doc.querySelector('ion-app') || doc.body;
};

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
  const animation = await import('./animation').then(mod => mod.create(animationBuilder, aniRoot, opts));
  overlay.animation = animation;
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

export const eventMethod = <T>(element: HTMLElement, eventName: string): Promise<T> => {
  let resolve: (detail: T) => void;
  const promise = new Promise<T>(r => resolve = r);
  onceEvent(element, eventName, (event: any) => {
    resolve(event.detail);
  });
  return promise;
};

export const onceEvent = (element: HTMLElement, eventName: string, callback: (ev: Event) => void) => {
  const handler = (ev: Event) => {
    element.removeEventListener(eventName, handler);
    callback(ev);
  };
  element.addEventListener(eventName, handler);
};

export const isCancel = (role: string | undefined): boolean => {
  return role === 'cancel' || role === BACKDROP;
};

const isDescendant = (parent: HTMLElement, child: HTMLElement | null) => {
  while (child) {
    if (child === parent) {
      return true;
    }
    child = child.parentElement;
  }
  return false;
};

const defaultGate = (h: any) => h();

export const safeCall = (handler: any, arg?: any) => {
  if (typeof handler === 'function') {
    const jmp = config.get('_zoneGate', defaultGate);
    return jmp(() => {
      try {
        return handler(arg);
      } catch (e) {
        console.error(e);
      }
    });
  }
  return undefined;
};

export const BACKDROP = 'backdrop';
