import { ActionSheet } from '../components/action-sheet/action-sheet';
import { Alert } from '../components/alert/alert';
import { Backdrop } from '../components/backdrop/backdrop';
import { Loading } from '../components/loading/loading';
import { Modal } from '../components/modal/modal';
import { PickerColumnCmp } from '../components/picker-column/picker-column';
import { Picker } from '../components/picker/picker';
import { Popover } from '../components/popover/popover';
import { RippleEffect } from '../components/ripple-effect/ripple-effect';
import { Spinner } from '../components/spinner/spinner';
import { Toast } from '../components/toast/toast';
import { config } from '../global/config';
import { getIonMode } from '../global/ionic-global';
import { ActionSheetOptions, AlertOptions, Animation, AnimationBuilder, BackButtonEvent, HTMLIonOverlayElement, IonicConfig, LoadingOptions, ModalOptions, OverlayInterface, PickerOptions, PopoverOptions, ToastOptions } from '../interface';

import { OVERLAY_BACK_BUTTON_PRIORITY } from './hardware-back-button';
import { addEventListener, componentOnReady, focusElement, getElementRoot, removeEventListener } from './helpers';

let lastId = 0;

export const activeAnimations = new WeakMap<OverlayInterface, Animation[]>();

type ChildCustomElementDefinition = {
  tagName: string;
  customElement: any;
}

const createController = <Opts extends object, HTMLElm extends any>(tagName: string, customElement?: any, childrenCustomElements?: ChildCustomElementDefinition[]) => {
  return {
    create(options: Opts): Promise<HTMLElm> {
      return createOverlay(tagName, options, customElement, childrenCustomElements) as any;
    },
    dismiss(data?: any, role?: string, id?: string) {
      return dismissOverlay(document, data, role, tagName, id);
    },
    async getTop(): Promise<HTMLElm | undefined> {
      return getOverlay(document, tagName) as any;
    }
  };
};

export const alertController = /*@__PURE__*/createController<AlertOptions, HTMLIonAlertElement>('ion-alert', Alert, [{ tagName: 'ion-backdrop', customElement: Backdrop }]);
export const actionSheetController = /*@__PURE__*/createController<ActionSheetOptions, HTMLIonActionSheetElement>('ion-action-sheet', ActionSheet, [{ tagName: 'ion-backdrop', customElement: Backdrop }, { tagName: 'ion-ripple-effect', customElement: RippleEffect }]);
export const loadingController = /*@__PURE__*/createController<LoadingOptions, HTMLIonLoadingElement>('ion-loading', Loading, [{ tagName: 'ion-backdrop', customElement: Backdrop }, { tagName: 'ion-spinner', customElement: Spinner }]);
export const modalController = /*@__PURE__*/createController<ModalOptions, HTMLIonModalElement>('ion-modal', Modal, [{ tagName: 'ion-backdrop', customElement: Backdrop }]);
export const pickerController = /*@__PURE__*/createController<PickerOptions, HTMLIonPickerElement>('ion-picker', Picker, [{ tagName: 'ion-picker-column', customElement: PickerColumnCmp }, { tagName: 'ion-backdrop', customElement: Backdrop }]);
export const popoverController = /*@__PURE__*/createController<PopoverOptions, HTMLIonPopoverElement>('ion-popover', Popover, [{ tagName: 'ion-backdrop', customElement: Backdrop }]);
export const toastController = /*@__PURE__*/createController<ToastOptions, HTMLIonToastElement>('ion-toast', Toast, [{ tagName: 'ion-ripple-effect', customElement: RippleEffect }]);

export interface OverlayListenerOptions {
  trapKeyboardFocus: boolean;
}

export const prepareOverlay = <T extends HTMLIonOverlayElement>(el: T, options: OverlayListenerOptions = {
  trapKeyboardFocus: true
}) => {
  /* tslint:disable-next-line */
  if (typeof document !== 'undefined') {
    connectListeners(document, options);
  }
  const overlayIndex = lastId++;
  el.overlayIndex = overlayIndex;
  if (!el.hasAttribute('id')) {
    el.id = `ion-overlay-${overlayIndex}`;
  }
};

const registerOverlayComponents = (tagName: string, customElement: any, childrenCustomElements?: ChildCustomElementDefinition[]): Promise<any> => {
  const { customElements } = window;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, customElement);
  }
  /**
   * If the parent element has nested usage of custom elements,
   * we need to manually define those custom elements.
   */
  if (childrenCustomElements) {
    for (const customElementDefinition of childrenCustomElements) {
      if (!customElements.get(customElementDefinition.tagName)) {
        customElements.define(customElementDefinition.tagName, customElementDefinition.customElement);
      }
    }
  }
  return customElements.whenDefined(tagName);
}

export const createOverlay = <T extends HTMLIonOverlayElement>(tagName: string, opts: object | undefined, customElement?: any, childrenCustomElements?: ChildCustomElementDefinition[]): Promise<T> => {
  /* tslint:disable-next-line */
  if (typeof window !== 'undefined' && typeof window.customElements !== 'undefined') {
    return registerOverlayComponents(tagName, customElement, childrenCustomElements).then(() => {
      const element = document.createElement(tagName) as HTMLIonOverlayElement;
      element.classList.add('overlay-hidden');

      /**
       * Convert the passed in overlay options into props
       * that get passed down into the new overlay.
       */
      Object.assign(element, { ...opts, hasController: true });

      // append the overlay element to the document body
      getAppRoot(document).appendChild(element);

      return new Promise(resolve => componentOnReady(element, resolve));
    });
  }
  return Promise.resolve() as any;
};

const focusableQueryString = '[tabindex]:not([tabindex^="-"]), input:not([type=hidden]):not([tabindex^="-"]), textarea:not([tabindex^="-"]), button:not([tabindex^="-"]), select:not([tabindex^="-"]), .ion-focusable:not([tabindex^="-"])';
const innerFocusableQueryString = 'input:not([type=hidden]), textarea, button, select';

export const focusFirstDescendant = (ref: Element, overlay: HTMLIonOverlayElement) => {
  let firstInput = ref.querySelector(focusableQueryString) as HTMLElement | null;

  const shadowRoot = firstInput && firstInput.shadowRoot;
  if (shadowRoot) {
    // If there are no inner focusable elements, just focus the host element.
    firstInput = shadowRoot.querySelector(innerFocusableQueryString) || firstInput;
  }

  if (firstInput) {
    focusElement(firstInput);
  } else {
    // Focus overlay instead of letting focus escape
    overlay.focus();
  }
};

const isOverlayHidden = (overlay: Element) => overlay.classList.contains('overlay-hidden');

const focusLastDescendant = (ref: Element, overlay: HTMLIonOverlayElement) => {
  const inputs = Array.from(ref.querySelectorAll(focusableQueryString)) as HTMLElement[];
  let lastInput = inputs.length > 0 ? inputs[inputs.length - 1] : null;

  const shadowRoot = lastInput && lastInput.shadowRoot;
  if (shadowRoot) {
    // If there are no inner focusable elements, just focus the host element.
    lastInput = shadowRoot.querySelector(innerFocusableQueryString) || lastInput;
  }

  if (lastInput) {
    lastInput.focus();
  } else {
    // Focus overlay instead of letting focus escape
    overlay.focus();
  }
};

/**
 * Traps keyboard focus inside of overlay components.
 * Based on https://w3c.github.io/aria-practices/examples/dialog-modal/alertdialog.html
 * This includes the following components: Action Sheet, Alert, Loading, Modal,
 * Picker, and Popover.
 * Should NOT include: Toast
 */
const trapKeyboardFocus = (ev: Event, doc: Document) => {
  const lastOverlay = getOverlay(doc);
  const target = ev.target as HTMLElement | null;

  /**
   * If no active overlay, ignore this event.
   *
   * If this component uses the shadow dom,
   * this global listener is pointless
   * since it will not catch the focus
   * traps as they are inside the shadow root.
   * We need to add a listener to the shadow root
   * itself to ensure the focus trap works.
   */
  if (!lastOverlay || !target) { return; }

  const trapScopedFocus = () => {
    /**
     * If we are focusing the overlay, clear
     * the last focused element so that hitting
     * tab activates the first focusable element
     * in the overlay wrapper.
     */
    if (lastOverlay === target) {
      lastOverlay.lastFocus = undefined;

      /**
       * Otherwise, we must be focusing an element
       * inside of the overlay. The two possible options
       * here are an input/button/etc or the ion-focus-trap
       * element. The focus trap element is used to prevent
       * the keyboard focus from leaving the overlay when
       * using Tab or screen assistants.
       */
    } else {
      /**
       * We do not want to focus the traps, so get the overlay
       * wrapper element as the traps live outside of the wrapper.
       */

      const overlayRoot = getElementRoot(lastOverlay);
      if (!overlayRoot.contains(target)) { return; }

      const overlayWrapper = overlayRoot.querySelector('.ion-overlay-wrapper');
      if (!overlayWrapper) { return; }

      /**
       * If the target is inside the wrapper, let the browser
       * focus as normal and keep a log of the last focused element.
       */
      if (overlayWrapper.contains(target)) {
        lastOverlay.lastFocus = target;
      } else {
        /**
         * Otherwise, we must have focused one of the focus traps.
         * We need to wrap the focus to either the first element
         * or the last element.
         */

        /**
         * Once we call `focusFirstDescendant` and focus the first
         * descendant, another focus event will fire which will
         * cause `lastOverlay.lastFocus` to be updated before
         * we can run the code after that. We will cache the value
         * here to avoid that.
         */
        const lastFocus = lastOverlay.lastFocus;

        // Focus the first element in the overlay wrapper
        focusFirstDescendant(overlayWrapper, lastOverlay);

        /**
         * If the cached last focused element is the
         * same as the active element, then we need
         * to wrap focus to the last descendant. This happens
         * when the first descendant is focused, and the user
         * presses Shift + Tab. The previous line will focus
         * the same descendant again (the first one), causing
         * last focus to equal the active element.
         */
        if (lastFocus === doc.activeElement) {
          focusLastDescendant(overlayWrapper, lastOverlay);
        }
        lastOverlay.lastFocus = doc.activeElement as HTMLElement;
      }
    }
  }
  const trapShadowFocus = () => {

    /**
     * If the target is inside the wrapper, let the browser
     * focus as normal and keep a log of the last focused element.
     */
    if (lastOverlay.contains(target)) {
      lastOverlay.lastFocus = target;
    } else {
      /**
       * Otherwise, we are about to have focus
       * go out of the overlay. We need to wrap
       * the focus to either the first element
       * or the last element.
       */

      /**
       * Once we call `focusFirstDescendant` and focus the first
       * descendant, another focus event will fire which will
       * cause `lastOverlay.lastFocus` to be updated before
       * we can run the code after that. We will cache the value
       * here to avoid that.
       */
      const lastFocus = lastOverlay.lastFocus;

      // Focus the first element in the overlay wrapper
      focusFirstDescendant(lastOverlay, lastOverlay);

      /**
       * If the cached last focused element is the
       * same as the active element, then we need
       * to wrap focus to the last descendant. This happens
       * when the first descendant is focused, and the user
       * presses Shift + Tab. The previous line will focus
       * the same descendant again (the first one), causing
       * last focus to equal the active element.
       */
      if (lastFocus === doc.activeElement) {
        focusLastDescendant(lastOverlay, lastOverlay);
      }
      lastOverlay.lastFocus = doc.activeElement as HTMLElement;
    }
  }

  if (lastOverlay.shadowRoot) {
    trapShadowFocus();
  } else {
    trapScopedFocus();
  }
};

const connectListeners = (doc: Document, options: OverlayListenerOptions) => {
  if (lastId === 0) {
    lastId = 1;
    if (options.trapKeyboardFocus) {
      doc.addEventListener('focus', (ev: FocusEvent) => {
        /**
         * ion-menu has its own focus trapping listener
         * so we do not want the two listeners to conflict
         * with each other.
         */
        if (ev.target && (ev.target as HTMLElement).tagName === 'ION-MENU') {
          return;
        }
        trapKeyboardFocus(ev, doc);
      }, true);
    }

    // handle back-button click
    doc.addEventListener('ionBackButton', ev => {
      const lastOverlay = getOverlay(doc);
      if (lastOverlay && lastOverlay.backdropDismiss) {
        (ev as BackButtonEvent).detail.register(OVERLAY_BACK_BUTTON_PRIORITY, () => {
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

export const getOverlays = (doc: Document, selector?: string): HTMLIonOverlayElement[] => {
  if (selector === undefined) {
    selector = 'ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker,ion-popover,ion-toast';
  }
  return (Array.from(doc.querySelectorAll(selector)) as HTMLIonOverlayElement[])
    .filter(c => c.overlayIndex > 0);
};

/**
 * Returns an overlay element
 * @param doc The document to find the element within.
 * @param overlayTag The selector for the overlay, defaults to Ionic overlay components.
 * @param id The unique identifier for the overlay instance.
 * @returns The overlay element or `undefined` if no overlay element is found.
 */
export const getOverlay = (doc: Document, overlayTag?: string, id?: string): HTMLIonOverlayElement | undefined => {
  const overlays = getOverlays(doc, overlayTag).filter(o => !isOverlayHidden(o));
  return (id === undefined)
    ? overlays[overlays.length - 1]
    : overlays.find(o => o.id === id);
};

/**
 * When an overlay is presented, the main
 * focus is the overlay not the page content.
 * We need to remove the page content from the
 * accessibility tree otherwise when
 * users use "read screen from top" gestures with
 * TalkBack and VoiceOver, the screen reader will begin
 * to read the content underneath the overlay.
 *
 * We need a container where all page components
 * exist that is separate from where the overlays
 * are added in the DOM. For most apps, this element
 * is the top most ion-router-outlet. In the event
 * that devs are not using a router,
 * they will need to add the "ion-view-container-root"
 * id to the element that contains all of their views.
 *
 * TODO: If Framework supports having multiple top
 * level router outlets we would need to update this.
 * Example: One outlet for side menu and one outlet
 * for main content.
 */
export const setRootAriaHidden = (hidden = false) => {
  const root = getAppRoot(document);
  const viewContainer = root.querySelector('ion-router-outlet, ion-nav, #ion-view-container-root');

  if (!viewContainer) { return; }

  if (hidden) {
    viewContainer.setAttribute('aria-hidden', 'true');
  } else {
    viewContainer.removeAttribute('aria-hidden');
  }
}

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

  setRootAriaHidden(true);

  overlay.presented = true;
  overlay.willPresent.emit();
  overlay.willPresentShorthand?.emit();

  const mode = getIonMode(overlay);
  // get the user's animation fn if one was provided
  const animationBuilder = (overlay.enterAnimation)
    ? overlay.enterAnimation
    : config.get(name, mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);

  const completed = await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
  if (completed) {
    overlay.didPresent.emit();
    overlay.didPresentShorthand?.emit();
  }

  /**
   * When an overlay that steals focus
   * is dismissed, focus should be returned
   * to the element that was focused
   * prior to the overlay opening. Toast
   * does not steal focus and is excluded
   * from returning focus as a result.
   */
  if (overlay.el.tagName !== 'ION-TOAST') {
    focusPreviousElementOnDismiss(overlay.el);
  }

  if (overlay.keyboardClose) {
    overlay.el.focus();
  }
};

/**
 * When an overlay component is dismissed,
 * focus should be returned to the element
 * that presented the overlay. Otherwise
 * focus will be set on the body which
 * means that people using screen readers
 * or tabbing will need to re-navigate
 * to where they were before they
 * opened the overlay.
 */
const focusPreviousElementOnDismiss = async (overlayEl: any) => {
  let previousElement = document.activeElement as HTMLElement | null;
  if (!previousElement) { return; }

  const shadowRoot = previousElement && previousElement.shadowRoot;
  if (shadowRoot) {
    // If there are no inner focusable elements, just focus the host element.
    previousElement = shadowRoot.querySelector(innerFocusableQueryString) || previousElement;
  }

  await overlayEl.onDidDismiss();
  previousElement.focus();
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

  setRootAriaHidden(false);

  overlay.presented = false;

  try {
    // Overlay contents should not be clickable during dismiss
    overlay.el.style.setProperty('pointer-events', 'none');
    overlay.willDismiss.emit({ data, role });
    overlay.willDismissShorthand?.emit({ data, role });

    const mode = getIonMode(overlay);
    const animationBuilder = (overlay.leaveAnimation)
      ? overlay.leaveAnimation
      : config.get(name, mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    // If dismissed via gesture, no need to play leaving animation again
    if (role !== 'gesture') {
      await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
    }
    overlay.didDismiss.emit({ data, role });
    overlay.didDismissShorthand?.emit({ data, role });

    activeAnimations.delete(overlay);

    /**
     * Make overlay hidden again in case it is being reused.
     * We can safely remove pointer-events: none as
     * overlay-hidden will set display: none.
     */
    overlay.el.classList.add('overlay-hidden');
    overlay.el.style.removeProperty('pointer-events');

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
  // Make overlay visible in case it's hidden
  baseEl.classList.remove('overlay-hidden');

  const aniRoot = overlay.el;
  const animation = animationBuilder(aniRoot, opts);

  if (!overlay.animated || !config.getBoolean('animated', true)) {
    animation.duration(0);
  }

  if (overlay.keyboardClose) {
    animation.beforeAddWrite(() => {
      const activeElement = baseEl.ownerDocument!.activeElement as HTMLElement;
      if (activeElement && activeElement.matches('input,ion-input, ion-textarea')) {
        activeElement.blur();
      }
    });
  }

  const activeAni = activeAnimations.get(overlay) || [];
  activeAnimations.set(overlay, [...activeAni, animation]);

  await animation.play();

  return true;
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
    removeEventListener(element, eventName, handler);
    callback(ev);
  };
  addEventListener(element, eventName, handler);
};

export const isCancel = (role: string | undefined): boolean => {
  return role === 'cancel' || role === BACKDROP;
};

const defaultGate = (h: any) => h();

/**
 * Calls a developer provided method while avoiding
 * Angular Zones. Since the handler is provided by
 * the developer, we should throw any errors
 * received so that developer-provided bug
 * tracking software can log it.
 */
export const safeCall = (handler: any, arg?: any) => {
  if (typeof handler === 'function') {
    const jmp = config.get('_zoneGate', defaultGate);
    return jmp(() => {
      try {
        return handler(arg);
      } catch (e) {
        throw e;
      }
    });
  }
  return undefined;
};

export const BACKDROP = 'backdrop';
