import { doc } from '@utils/browser';
import { focusFirstDescendant, focusLastDescendant, focusableQueryString } from '@utils/focus-trap';
import type { BackButtonEvent } from '@utils/hardware-back-button';
import { shouldUseCloseWatcher } from '@utils/hardware-back-button';

import { config } from '../global/config';
import { getIonMode } from '../global/ionic-global';
import type {
  ActionSheetOptions,
  AlertOptions,
  Animation,
  AnimationBuilder,
  FrameworkDelegate,
  HTMLIonOverlayElement,
  IonicConfig,
  LoadingOptions,
  ModalOptions,
  OverlayInterface,
  PickerOptions,
  PopoverOptions,
  ToastOptions,
} from '../interface';

import { CoreDelegate } from './framework-delegate';
import { BACKDROP_NO_SCROLL } from './gesture/gesture-controller';
import { OVERLAY_BACK_BUTTON_PRIORITY } from './hardware-back-button';
import {
  addEventListener,
  componentOnReady,
  focusVisibleElement,
  getElementRoot,
  removeEventListener,
} from './helpers';
import { printIonWarning } from './logging';

let lastOverlayIndex = 0;
let lastId = 0;

export const activeAnimations = new WeakMap<OverlayInterface, Animation[]>();

const createController = <Opts extends object, HTMLElm>(tagName: string) => {
  return {
    create(options: Opts): Promise<HTMLElm> {
      return createOverlay(tagName, options) as any;
    },
    dismiss(data?: any, role?: string, id?: string) {
      return dismissOverlay(document, data, role, tagName, id);
    },
    async getTop(): Promise<HTMLElm | undefined> {
      return getPresentedOverlay(document, tagName) as any;
    },
  };
};

export const alertController = /*@__PURE__*/ createController<AlertOptions, HTMLIonAlertElement>('ion-alert');
export const actionSheetController = /*@__PURE__*/ createController<ActionSheetOptions, HTMLIonActionSheetElement>(
  'ion-action-sheet'
);
export const loadingController = /*@__PURE__*/ createController<LoadingOptions, HTMLIonLoadingElement>('ion-loading');
export const modalController = /*@__PURE__*/ createController<ModalOptions, HTMLIonModalElement>('ion-modal');
/**
 * @deprecated Use the inline ion-picker component instead.
 */
export const pickerController = /*@__PURE__*/ createController<PickerOptions, HTMLIonPickerLegacyElement>(
  'ion-picker-legacy'
);
export const popoverController = /*@__PURE__*/ createController<PopoverOptions, HTMLIonPopoverElement>('ion-popover');
export const toastController = /*@__PURE__*/ createController<ToastOptions, HTMLIonToastElement>('ion-toast');

/**
 * Prepares the overlay element to be presented.
 */
export const prepareOverlay = <T extends HTMLIonOverlayElement>(el: T) => {
  if (typeof document !== 'undefined') {
    /**
     * Adds a single instance of event listeners for application behaviors:
     *
     * - Escape Key behavior to dismiss an overlay
     * - Trapping focus within an overlay
     * - Back button behavior to dismiss an overlay
     *
     * This only occurs when the first overlay is created.
     */
    connectListeners(document);
  }
  const overlayIndex = lastOverlayIndex++;
  /**
   * overlayIndex is used in the overlay components to set a zIndex.
   * This ensures that the most recently presented overlay will be
   * on top.
   */
  el.overlayIndex = overlayIndex;
};

/**
 * Assigns an incrementing id to an overlay element, that does not
 * already have an id assigned to it.
 *
 * Used to track unique instances of an overlay element.
 */
export const setOverlayId = <T extends HTMLIonOverlayElement>(el: T) => {
  if (!el.hasAttribute('id')) {
    el.id = `ion-overlay-${++lastId}`;
  }
  return el.id;
};

export const createOverlay = <T extends HTMLIonOverlayElement>(
  tagName: string,
  opts: object | undefined
): Promise<T> => {
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (typeof window !== 'undefined' && typeof window.customElements !== 'undefined') {
    return window.customElements.whenDefined(tagName).then(() => {
      const element = document.createElement(tagName) as HTMLIonOverlayElement;
      element.classList.add('overlay-hidden');

      /**
       * Convert the passed in overlay options into props
       * that get passed down into the new overlay.
       */
      Object.assign(element, { ...opts, hasController: true });

      // append the overlay element to the document body
      getAppRoot(document).appendChild(element);

      return new Promise((resolve) => componentOnReady(element, resolve));
    });
  }
  return Promise.resolve() as any;
};

const isOverlayHidden = (overlay: Element) => overlay.classList.contains('overlay-hidden');

/**
 * Focuses a particular element in an overlay. If the element
 * doesn't have anything focusable associated with it then
 * the overlay itself will be focused.
 * This should be used instead of the focus() method
 * on most elements because the focusable element
 * may not be the host element.
 *
 * For example, if an ion-button should be focused
 * then we should actually focus the native <button>
 * element inside of ion-button's shadow root, not
 * the host element itself.
 */
const focusElementInOverlay = (hostToFocus: HTMLElement | null | undefined, overlay: HTMLIonOverlayElement) => {
  let elementToFocus = hostToFocus;

  const shadowRoot = hostToFocus?.shadowRoot;
  if (shadowRoot) {
    // If there are no inner focusable elements, just focus the host element.
    elementToFocus = shadowRoot.querySelector<HTMLElement>(focusableQueryString) || hostToFocus;
  }

  if (elementToFocus) {
    focusVisibleElement(elementToFocus);
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
  const lastOverlay = getPresentedOverlay(
    doc,
    'ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker-legacy,ion-popover'
  );
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
  if (!lastOverlay || !target) {
    return;
  }

  /**
   * If the ion-disable-focus-trap class
   * is present on an overlay, then this component
   * instance has opted out of focus trapping.
   * An example of this is when the sheet modal
   * has a backdrop that is disabled. The content
   * behind the sheet should be focusable until
   * the backdrop is enabled.
   */
  if (lastOverlay.classList.contains(FOCUS_TRAP_DISABLE_CLASS)) {
    return;
  }

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
       * Toasts can be presented from an overlay.
       * However, focus should still be returned to
       * the overlay when clicking a toast. Normally,
       * focus would be returned to the last focusable
       * descendant in the overlay which may not always be
       * the button that the toast was presented from. In this case,
       * the focus may be returned to an unexpected element.
       * To account for this, we make sure to return focus to the
       * last focused element in the overlay if focus is
       * moved to the toast.
       */
    } else if (target.tagName === 'ION-TOAST') {
      focusElementInOverlay(lastOverlay.lastFocus, lastOverlay);

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
      if (!overlayRoot.contains(target)) {
        return;
      }

      const overlayWrapper = overlayRoot.querySelector<HTMLElement>('.ion-overlay-wrapper');
      if (!overlayWrapper) {
        return;
      }

      /**
       * If the target is inside the wrapper, let the browser
       * focus as normal and keep a log of the last focused element.
       * Additionally, if the backdrop was tapped we should not
       * move focus back inside the wrapper as that could cause
       * an interactive elements focus state to activate.
       */
      if (overlayWrapper.contains(target) || target === overlayRoot.querySelector('ion-backdrop')) {
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
  };
  const trapShadowFocus = () => {
    /**
     * If the target is inside the wrapper, let the browser
     * focus as normal and keep a log of the last focused element.
     */
    if (lastOverlay.contains(target)) {
      lastOverlay.lastFocus = target;
      /**
       * Toasts can be presented from an overlay.
       * However, focus should still be returned to
       * the overlay when clicking a toast. Normally,
       * focus would be returned to the last focusable
       * descendant in the overlay which may not always be
       * the button that the toast was presented from. In this case,
       * the focus may be returned to an unexpected element.
       * To account for this, we make sure to return focus to the
       * last focused element in the overlay if focus is
       * moved to the toast.
       */
    } else if (target.tagName === 'ION-TOAST') {
      focusElementInOverlay(lastOverlay.lastFocus, lastOverlay);
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
      focusFirstDescendant(lastOverlay);

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
        focusLastDescendant(lastOverlay);
      }
      lastOverlay.lastFocus = doc.activeElement as HTMLElement;
    }
  };

  if (lastOverlay.shadowRoot) {
    trapShadowFocus();
  } else {
    trapScopedFocus();
  }
};

const connectListeners = (doc: Document) => {
  if (lastOverlayIndex === 0) {
    lastOverlayIndex = 1;
    doc.addEventListener(
      'focus',
      (ev: FocusEvent) => {
        trapKeyboardFocus(ev, doc);
      },
      true
    );

    // handle back-button click
    doc.addEventListener('ionBackButton', (ev) => {
      const lastOverlay = getPresentedOverlay(doc);
      if (lastOverlay?.backdropDismiss) {
        (ev as BackButtonEvent).detail.register(OVERLAY_BACK_BUTTON_PRIORITY, () => {
          /**
           * Do not return this promise otherwise
           * the hardware back button utility will
           * be blocked until the overlay dismisses.
           * This is important for a modal with canDismiss.
           * If the application presents a confirmation alert
           * in the "canDismiss" callback, then it will be impossible
           * to use the hardware back button to dismiss the alert
           * dialog because the hardware back button utility
           * is blocked on waiting for the modal to dismiss.
           */
          lastOverlay.dismiss(undefined, BACKDROP);
        });
      }
    });

    /**
     * Handle ESC to close overlay.
     * CloseWatcher also handles pressing the Esc
     * key, so if a browser supports CloseWatcher then
     * this behavior will be handled via the ionBackButton
     * event.
     */
    if (!shouldUseCloseWatcher()) {
      doc.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
          const lastOverlay = getPresentedOverlay(doc);
          if (lastOverlay?.backdropDismiss) {
            lastOverlay.dismiss(undefined, BACKDROP);
          }
        }
      });
    }
  }
};

export const dismissOverlay = (
  doc: Document,
  data: any,
  role: string | undefined,
  overlayTag: string,
  id?: string
): Promise<boolean> => {
  const overlay = getPresentedOverlay(doc, overlayTag, id);
  if (!overlay) {
    return Promise.reject('overlay does not exist');
  }
  return overlay.dismiss(data, role);
};

/**
 * Returns a list of all overlays in the DOM even if they are not presented.
 */
export const getOverlays = (doc: Document, selector?: string): HTMLIonOverlayElement[] => {
  if (selector === undefined) {
    selector = 'ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker-legacy,ion-popover,ion-toast';
  }
  return (Array.from(doc.querySelectorAll(selector)) as HTMLIonOverlayElement[]).filter((c) => c.overlayIndex > 0);
};

/**
 * Returns a list of all presented overlays.
 * Inline overlays can exist in the DOM but not be presented,
 * so there are times when we want to exclude those.
 * @param doc The document to find the element within.
 * @param overlayTag The selector for the overlay, defaults to Ionic overlay components.
 */
const getPresentedOverlays = (doc: Document, overlayTag?: string): HTMLIonOverlayElement[] => {
  return getOverlays(doc, overlayTag).filter((o) => !isOverlayHidden(o));
};

/**
 * Returns a presented overlay element.
 * @param doc The document to find the element within.
 * @param overlayTag The selector for the overlay, defaults to Ionic overlay components.
 * @param id The unique identifier for the overlay instance.
 * @returns The overlay element or `undefined` if no overlay element is found.
 */
export const getPresentedOverlay = (
  doc: Document,
  overlayTag?: string,
  id?: string
): HTMLIonOverlayElement | undefined => {
  const overlays = getPresentedOverlays(doc, overlayTag);
  return id === undefined ? overlays[overlays.length - 1] : overlays.find((o) => o.id === id);
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

  if (!viewContainer) {
    return;
  }

  if (hidden) {
    viewContainer.setAttribute('aria-hidden', 'true');
  } else {
    viewContainer.removeAttribute('aria-hidden');
  }
};

export const present = async <OverlayPresentOptions>(
  overlay: OverlayInterface,
  name: keyof IonicConfig,
  iosEnterAnimation: AnimationBuilder,
  mdEnterAnimation: AnimationBuilder,
  opts?: OverlayPresentOptions
) => {
  if (overlay.presented) {
    return;
  }

  setRootAriaHidden(true);

  document.body.classList.add(BACKDROP_NO_SCROLL);

  hideOverlaysFromScreenReaders(overlay.el);

  overlay.presented = true;
  overlay.willPresent.emit();
  overlay.willPresentShorthand?.emit();

  const mode = getIonMode(overlay);
  // get the user's animation fn if one was provided
  const animationBuilder = overlay.enterAnimation
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
    restoreElementFocus(overlay.el);
  }

  /**
   * If the focused element is already
   * inside the overlay component then
   * focus should not be moved from that
   * to the overlay container.
   */
  if (overlay.keyboardClose && (document.activeElement === null || !overlay.el.contains(document.activeElement))) {
    overlay.el.focus();
  }

  /**
   * If this overlay was previously dismissed without being
   * the topmost one (such as by manually calling dismiss()),
   * it would still have aria-hidden on being presented again.
   * Removing it here ensures the overlay is visible to screen
   * readers.
   */
  overlay.el.removeAttribute('aria-hidden');
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
const restoreElementFocus = async (overlayEl: any) => {
  let previousElement = document.activeElement as HTMLElement | null;
  if (!previousElement) {
    return;
  }

  const shadowRoot = previousElement?.shadowRoot;
  if (shadowRoot) {
    // If there are no inner focusable elements, just focus the host element.
    previousElement = shadowRoot.querySelector(focusableQueryString) || previousElement;
  }

  await overlayEl.onDidDismiss();

  /**
   * After onDidDismiss, the overlay loses focus
   * because it is removed from the document
   *
   * > An element will also lose focus [...]
   * > if the element is removed from the document)
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
   *
   * Additionally, `document.activeElement` returns:
   *
   * > The Element which currently has focus,
   * > `<body>` or null if there is
   * > no focused element.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement#value
   *
   * However, if the user has already focused
   * an element sometime between onWillDismiss
   * and onDidDismiss (for example, focusing a
   * text box after tapping a button in an
   * action sheet) then don't restore focus to
   * previous element
   */
  if (document.activeElement === null || document.activeElement === document.body) {
    previousElement.focus();
  }
};

export const dismiss = async <OverlayDismissOptions>(
  overlay: OverlayInterface,
  data: any | undefined,
  role: string | undefined,
  name: keyof IonicConfig,
  iosLeaveAnimation: AnimationBuilder,
  mdLeaveAnimation: AnimationBuilder,
  opts?: OverlayDismissOptions
): Promise<boolean> => {
  if (!overlay.presented) {
    return false;
  }

  const lastOverlay = doc !== undefined && getPresentedOverlays(doc).length === 1;

  /**
   * If this is the last visible overlay then
   * we want to re-add the root to the accessibility tree.
   */
  if (lastOverlay) {
    setRootAriaHidden(false);
    document.body.classList.remove(BACKDROP_NO_SCROLL);
  }

  overlay.presented = false;

  try {
    // Overlay contents should not be clickable during dismiss
    overlay.el.style.setProperty('pointer-events', 'none');
    overlay.willDismiss.emit({ data, role });
    overlay.willDismissShorthand?.emit({ data, role });

    const mode = getIonMode(overlay);
    const animationBuilder = overlay.leaveAnimation
      ? overlay.leaveAnimation
      : config.get(name, mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);

    // If dismissed via gesture, no need to play leaving animation again
    if (role !== GESTURE) {
      await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
    }

    overlay.didDismiss.emit({ data, role });
    overlay.didDismissShorthand?.emit({ data, role });

    // Get a reference to all animations currently assigned to this overlay
    // Then tear them down to return the overlay to its initial visual state
    const animations = activeAnimations.get(overlay) || [];

    animations.forEach((ani) => ani.destroy());

    activeAnimations.delete(overlay);

    /**
     * Make overlay hidden again in case it is being reused.
     * We can safely remove pointer-events: none as
     * overlay-hidden will set display: none.
     */
    overlay.el.classList.add('overlay-hidden');
    overlay.el.style.removeProperty('pointer-events');

    /**
     * Clear any focus trapping references
     * when the overlay is dismissed.
     */
    if (overlay.el.lastFocus !== undefined) {
      overlay.el.lastFocus = undefined;
    }
  } catch (err) {
    console.error(err);
  }

  overlay.el.remove();

  revealOverlaysToScreenReaders();

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
      if (activeElement?.matches('input,ion-input, ion-textarea')) {
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
  const promise = new Promise<T>((r) => (resolve = r));
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
export const GESTURE = 'gesture';
export const OVERLAY_GESTURE_PRIORITY = 39;

/**
 * Creates a delegate controller.
 *
 * Requires that the component has the following properties:
 * - `el: HTMLElement`
 * - `hasController: boolean`
 * - `delegate?: FrameworkDelegate`
 *
 * @param ref The component class instance.
 */
export const createDelegateController = (ref: {
  el: HTMLElement;
  hasController: boolean;
  delegate?: FrameworkDelegate;
}) => {
  let inline = false;
  let workingDelegate: FrameworkDelegate | undefined;

  const coreDelegate: FrameworkDelegate = CoreDelegate();

  /**
   * Determines whether or not an overlay is being used
   * inline or via a controller/JS and returns the correct delegate.
   * By default, subsequent calls to getDelegate will use
   * a cached version of the delegate.
   * This is useful for calling dismiss after present,
   * so that the correct delegate is given.
   * @param force `true` to force the non-cached version of the delegate.
   * @returns The delegate to use and whether or not the overlay is inline.
   */
  const getDelegate = (force = false) => {
    if (workingDelegate && !force) {
      return {
        delegate: workingDelegate,
        inline,
      };
    }
    const { el, hasController, delegate } = ref;
    /**
     * If using overlay inline
     * we potentially need to use the coreDelegate
     * so that this works in vanilla JS apps.
     * If a developer has presented this component
     * via a controller, then we can assume
     * the component is already in the
     * correct place.
     */
    const parentEl = el.parentNode as HTMLElement | null;
    inline = parentEl !== null && !hasController;
    workingDelegate = inline ? delegate || coreDelegate : delegate;

    return { inline, delegate: workingDelegate };
  };

  /**
   * Attaches a component in the DOM. Teleports the component
   * to the root of the app.
   * @param component The component to optionally construct and append to the element.
   */
  const attachViewToDom = async (component?: any) => {
    const { delegate } = getDelegate(true);
    if (delegate) {
      return await delegate.attachViewToDom(ref.el, component);
    }
    const { hasController } = ref;
    if (hasController && component !== undefined) {
      throw new Error('framework delegate is missing');
    }
    return null;
  };

  /**
   * Moves a component back to its original location in the DOM.
   */
  const removeViewFromDom = () => {
    const { delegate } = getDelegate();
    if (delegate && ref.el !== undefined) {
      delegate.removeViewFromDom(ref.el.parentElement, ref.el);
    }
  };

  return {
    attachViewToDom,
    removeViewFromDom,
  };
};

/**
 * Constructs a trigger interaction for an overlay.
 * Presents an overlay when the trigger is clicked.
 *
 * Usage:
 * ```ts
 * triggerController = createTriggerController();
 * triggerController.addClickListener(el, trigger);
 * ```
 */
export const createTriggerController = () => {
  let destroyTriggerInteraction: (() => void) | undefined;

  /**
   * Removes the click listener from the trigger element.
   */
  const removeClickListener = (): void => {
    if (destroyTriggerInteraction) {
      destroyTriggerInteraction();
      destroyTriggerInteraction = undefined;
    }
  };

  /**
   * Adds a click listener to the trigger element.
   * Presents the overlay when the trigger is clicked.
   * @param el The overlay element.
   * @param trigger The ID of the element to add a click listener to.
   */
  const addClickListener = (el: HTMLIonOverlayElement, trigger: string): void => {
    removeClickListener();

    const triggerEl = trigger !== undefined ? document.getElementById(trigger) : null;
    if (!triggerEl) {
      printIonWarning(
        `A trigger element with the ID "${trigger}" was not found in the DOM. The trigger element must be in the DOM when the "trigger" property is set on an overlay component.`,
        el
      );
      return;
    }

    const configureTriggerInteraction = (targetEl: HTMLElement, overlayEl: HTMLIonOverlayElement) => {
      const openOverlay = () => {
        overlayEl.present();
      };
      targetEl.addEventListener('click', openOverlay);

      return () => {
        targetEl.removeEventListener('click', openOverlay);
      };
    };

    destroyTriggerInteraction = configureTriggerInteraction(triggerEl, el);
  };

  return {
    addClickListener,
    removeClickListener,
  };
};

/**
 * Ensure that underlying overlays have aria-hidden if necessary so that screen readers
 * cannot move focus to these elements. Note that we cannot rely on focus/focusin/focusout
 * events here because those events do not fire when the screen readers moves to a non-focusable
 * element such as text.
 * Without this logic screen readers would be able to move focus outside of the top focus-trapped overlay.
 *
 * @param newTopMostOverlay - The overlay that is being presented. Since the overlay has not been
 * fully presented yet at the time this function is called it will not be included in the getPresentedOverlays result.
 */
const hideOverlaysFromScreenReaders = (newTopMostOverlay: HTMLIonOverlayElement) => {
  if (doc === undefined) return;

  const overlays = getPresentedOverlays(doc);

  for (let i = overlays.length - 1; i >= 0; i--) {
    const presentedOverlay = overlays[i];
    const nextPresentedOverlay = overlays[i + 1] ?? newTopMostOverlay;

    /**
     * If next overlay has aria-hidden then all remaining overlays will have it too.
     * Or, if the next overlay is a Toast that does not have aria-hidden then current overlay
     * should not have aria-hidden either so focus can remain in the current overlay.
     */
    if (nextPresentedOverlay.hasAttribute('aria-hidden') || nextPresentedOverlay.tagName !== 'ION-TOAST') {
      presentedOverlay.setAttribute('aria-hidden', 'true');
    }
  }
};

/**
 * When dismissing an overlay we need to reveal the new top-most overlay to screen readers.
 * If the top-most overlay is a Toast we potentially need to reveal more overlays since
 * focus is never automatically moved to the Toast.
 */
const revealOverlaysToScreenReaders = () => {
  if (doc === undefined) return;

  const overlays = getPresentedOverlays(doc);

  for (let i = overlays.length - 1; i >= 0; i--) {
    const currentOverlay = overlays[i];

    /**
     * If the current we are looking at is a Toast then we can remove aria-hidden.
     * However, we potentially need to keep looking at the overlay stack because there
     * could be more Toasts underneath. Additionally, we need to unhide the closest non-Toast
     * overlay too so focus can move there since focus is never automatically moved to the Toast.
     */
    currentOverlay.removeAttribute('aria-hidden');

    /**
     * If we found a non-Toast element then we can just remove aria-hidden and stop searching entirely
     * since this overlay should always receive focus. As a result, all underlying overlays should still
     * be hidden from screen readers.
     */
    if (currentOverlay.tagName !== 'ION-TOAST') {
      break;
    }
  }
};

export const FOCUS_TRAP_DISABLE_CLASS = 'ion-disable-focus-trap';
