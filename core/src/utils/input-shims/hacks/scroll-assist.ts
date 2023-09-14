import type { KeyboardResizeOptions } from '@capacitor/keyboard';
import { win } from '@utils/browser';

import { getScrollElement, scrollByPoint } from '../../content';
import { raf } from '../../helpers';
import { KeyboardResize } from '../../native/keyboard';

import { relocateInput, SCROLL_AMOUNT_PADDING } from './common';
import { getScrollData } from './scroll-data';
import { setScrollPadding, setClearScrollPaddingListener } from './scroll-padding';

let currentPadding = 0;

const SKIP_SCROLL_ASSIST = 'data-ionic-skip-scroll-assist';

export const enableScrollAssist = (
  componentEl: HTMLElement,
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  contentEl: HTMLElement | null,
  footerEl: HTMLIonFooterElement | null,
  keyboardHeight: number,
  enableScrollPadding: boolean,
  keyboardResize: KeyboardResizeOptions | undefined,
  disableClonedInput = false
) => {
  /**
   * Scroll padding should only be added if:
   * 1. The global scrollPadding config option
   * is set to true.
   * 2. The native keyboard resize mode is either "none"
   * (keyboard overlays webview) or undefined (resize
   * information unavailable)
   * Resize info is available on Capacitor 4+
   */
  const addScrollPadding =
    enableScrollPadding && (keyboardResize === undefined || keyboardResize.mode === KeyboardResize.None);

  /**
   * This tracks whether or not the keyboard has been
   * presented for a single focused text field. Note
   * that it does not track if the keyboard is open
   * in general such as if the keyboard is open for
   * a different focused text field.
   */
  let hasKeyboardBeenPresentedForTextField = false;

  /**
   * When adding scroll padding we need to know
   * how much of the viewport the keyboard obscures.
   * We do this by subtracting the keyboard height
   * from the platform height.
   *
   * If we compute this value when switching between
   * inputs then the webview may already be resized.
   * At this point, `win.innerHeight` has already accounted
   * for the keyboard meaning we would then subtract
   * the keyboard height again. This will result in the input
   * being scrolled more than it needs to.
   */
  const platformHeight = win !== undefined ? win.innerHeight : 0;

  /**
   * Scroll assist is run when a text field
   * is focused. However, it may need to
   * re-run when the keyboard size changes
   * such that the text field is now hidden
   * underneath the keyboard.
   * This function re-runs scroll assist
   * when that happens.
   *
   * One limitation of this is on a web browser
   * where native keyboard APIs do not have cross-browser
   * support. `ionKeyboardDidShow` relies on the Visual Viewport API.
   * This means that if the keyboard changes but does not change
   * geometry, then scroll assist will not re-run even if
   * the user has scrolled the text field under the keyboard.
   * This is not a problem when running in Cordova/Capacitor
   * because `ionKeyboardDidShow` uses the native events
   * which fire every time the keyboard changes.
   */
  const keyboardShow = (ev: CustomEvent<{ keyboardHeight: number }>) => {
    /**
     * If the keyboard has not yet been presented
     * for this text field then the text field has just
     * received focus. In that case, the focusin listener
     * will run scroll assist.
     */
    if (hasKeyboardBeenPresentedForTextField === false) {
      hasKeyboardBeenPresentedForTextField = true;
      return;
    }

    /**
     * Otherwise, the keyboard has already been presented
     * for the focused text field.
     * This means that the keyboard likely changed
     * geometry, and we need to re-run scroll assist.
     * This can happen when the user rotates their device
     * or when they switch keyboards.
     *
     * Make sure we pass in the computed keyboard height
     * rather than the estimated keyboard height.
     *
     * Since the keyboard is already open then we do not
     * need to wait for the webview to resize, so we pass
     * "waitForResize: false".
     */
    jsSetFocus(
      componentEl,
      inputEl,
      contentEl,
      footerEl,
      ev.detail.keyboardHeight,
      addScrollPadding,
      disableClonedInput,
      platformHeight,
      false
    );
  };

  /**
   * Reset the internal state when the text field loses focus.
   */
  const focusOut = () => {
    hasKeyboardBeenPresentedForTextField = false;
    win?.removeEventListener('ionKeyboardDidShow', keyboardShow);
    componentEl.removeEventListener('focusout', focusOut, true);
  };

  /**
   * When the input is about to receive
   * focus, we need to move it to prevent
   * mobile Safari from adjusting the viewport.
   */
  const focusIn = async () => {
    /**
     * Scroll assist should not run again
     * on inputs that have been manually
     * focused inside of the scroll assist
     * implementation.
     */
    if (inputEl.hasAttribute(SKIP_SCROLL_ASSIST)) {
      inputEl.removeAttribute(SKIP_SCROLL_ASSIST);
      return;
    }
    jsSetFocus(
      componentEl,
      inputEl,
      contentEl,
      footerEl,
      keyboardHeight,
      addScrollPadding,
      disableClonedInput,
      platformHeight
    );

    win?.addEventListener('ionKeyboardDidShow', keyboardShow);
    componentEl.addEventListener('focusout', focusOut, true);
  };

  componentEl.addEventListener('focusin', focusIn, true);

  return () => {
    componentEl.removeEventListener('focusin', focusIn, true);
    win?.removeEventListener('ionKeyboardDidShow', keyboardShow);
    componentEl.removeEventListener('focusout', focusOut, true);
  };
};

/**
 * Use this function when you want to manually
 * focus an input but not have scroll assist run again.
 */
const setManualFocus = (el: HTMLElement) => {
  /**
   * If element is already focused then
   * a new focusin event will not be dispatched
   * to remove the SKIL_SCROLL_ASSIST attribute.
   */
  if (document.activeElement === el) {
    return;
  }

  el.setAttribute(SKIP_SCROLL_ASSIST, 'true');
  el.focus();
};

const jsSetFocus = async (
  componentEl: HTMLElement,
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  contentEl: HTMLElement | null,
  footerEl: HTMLIonFooterElement | null,
  keyboardHeight: number,
  enableScrollPadding: boolean,
  disableClonedInput = false,
  platformHeight = 0,
  waitForResize = true
) => {
  if (!contentEl && !footerEl) {
    return;
  }
  const scrollData = getScrollData(componentEl, (contentEl || footerEl)!, keyboardHeight, platformHeight);

  if (contentEl && Math.abs(scrollData.scrollAmount) < 4) {
    // the text input is in a safe position that doesn't
    // require it to be scrolled into view, just set focus now
    setManualFocus(inputEl);

    /**
     * Even though the input does not need
     * scroll assist, we should preserve the
     * the scroll padding as users could be moving
     * focus from an input that needs scroll padding
     * to an input that does not need scroll padding.
     * If we remove the scroll padding now, users will
     * see the page jump.
     */
    if (enableScrollPadding && contentEl !== null) {
      setScrollPadding(contentEl, currentPadding);
      setClearScrollPaddingListener(inputEl, contentEl, () => (currentPadding = 0));
    }

    return;
  }

  // temporarily move the focus to the focus holder so the browser
  // doesn't freak out while it's trying to get the input in place
  // at this point the native text input still does not have focus
  relocateInput(componentEl, inputEl, true, scrollData.inputSafeY, disableClonedInput);
  setManualFocus(inputEl);

  /**
   * Relocating/Focusing input causes the
   * click event to be cancelled, so
   * manually fire one here.
   */
  raf(() => componentEl.click());

  /**
   * If enabled, we can add scroll padding to
   * the bottom of the content so that scroll assist
   * has enough room to scroll the input above
   * the keyboard.
   */
  if (enableScrollPadding && contentEl) {
    currentPadding = scrollData.scrollPadding;
    setScrollPadding(contentEl, currentPadding);
  }

  if (typeof window !== 'undefined') {
    let scrollContentTimeout: ReturnType<typeof setTimeout>;
    const scrollContent = async () => {
      // clean up listeners and timeouts
      if (scrollContentTimeout !== undefined) {
        clearTimeout(scrollContentTimeout);
      }

      window.removeEventListener('ionKeyboardDidShow', doubleKeyboardEventListener);
      window.removeEventListener('ionKeyboardDidShow', scrollContent);

      // scroll the input into place
      if (contentEl) {
        await scrollByPoint(contentEl, 0, scrollData.scrollAmount, scrollData.scrollDuration);
      }

      // the scroll view is in the correct position now
      // give the native text input focus
      relocateInput(componentEl, inputEl, false, scrollData.inputSafeY);

      // ensure this is the focused input
      setManualFocus(inputEl);

      /**
       * When the input is about to be blurred
       * we should set a timeout to remove
       * any scroll padding.
       */
      if (enableScrollPadding) {
        setClearScrollPaddingListener(inputEl, contentEl, () => (currentPadding = 0));
      }
    };

    const doubleKeyboardEventListener = () => {
      window.removeEventListener('ionKeyboardDidShow', doubleKeyboardEventListener);
      window.addEventListener('ionKeyboardDidShow', scrollContent);
    };

    if (contentEl) {
      const scrollEl = await getScrollElement(contentEl);

      /**
       * scrollData will only consider the amount we need
       * to scroll in order to properly bring the input
       * into view. It will not consider the amount
       * we can scroll in the content element.
       * As a result, scrollData may request a greater
       * scroll position than is currently available
       * in the DOM. If this is the case, we need to
       * wait for the webview to resize/the keyboard
       * to show in order for additional scroll
       * bandwidth to become available.
       */
      const totalScrollAmount = scrollEl.scrollHeight - scrollEl.clientHeight;
      if (waitForResize && scrollData.scrollAmount > totalScrollAmount - scrollEl.scrollTop) {
        /**
         * On iOS devices, the system will show a "Passwords" bar above the keyboard
         * after the initial keyboard is shown. This prevents the webview from resizing
         * until the "Passwords" bar is shown, so we need to wait for that to happen first.
         */
        if (inputEl.type === 'password') {
          // Add 50px to account for the "Passwords" bar
          scrollData.scrollAmount += SCROLL_AMOUNT_PADDING;
          window.addEventListener('ionKeyboardDidShow', doubleKeyboardEventListener);
        } else {
          window.addEventListener('ionKeyboardDidShow', scrollContent);
        }

        /**
         * This should only fire in 2 instances:
         * 1. The app is very slow.
         * 2. The app is running in a browser on an old OS
         * that does not support Ionic Keyboard Events
         */
        scrollContentTimeout = setTimeout(scrollContent, 1000);
        return;
      }
    }

    scrollContent();
  }
};
