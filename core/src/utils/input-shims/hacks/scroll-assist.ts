import { getScrollElement, scrollByPoint } from '../../content';
import { raf } from '../../helpers';
import type { KeyboardResizeOptions } from '../../native/keyboard';
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
    jsSetFocus(componentEl, inputEl, contentEl, footerEl, keyboardHeight, addScrollPadding, disableClonedInput);
  };
  componentEl.addEventListener('focusin', focusIn, true);

  return () => {
    componentEl.removeEventListener('focusin', focusIn, true);
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
  disableClonedInput = false
) => {
  if (!contentEl && !footerEl) {
    return;
  }
  const scrollData = getScrollData(componentEl, (contentEl || footerEl)!, keyboardHeight);

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
      if (scrollData.scrollAmount > totalScrollAmount - scrollEl.scrollTop) {
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
