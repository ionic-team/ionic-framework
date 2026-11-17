import { raf } from '@utils/helpers';

export interface ClickController {
  handleClickCapture: (ev: Event) => void;
  handleMouseDown: (ev: MouseEvent) => void;
  rejectFocus: (ev: FocusEvent) => boolean;
  cancelFocusRejection: () => void;
  destroy: () => void;
}

/**
 * Content that handles its own click, so clicking it should not also activate
 * the form control.
 */
const INTERACTIVE_CONTENT =
  'a[href], button, details, embed, iframe, select, textarea, input:not([type="hidden"]), audio[controls], video[controls], [contenteditable]:not([contenteditable="false"]), .ion-activatable, .ion-focusable';

/**
 * The content slotted into a form control's start or end slot that a click
 * started on, or `null` when the click did not start on slotted content.
 *
 * The slotted element is compared against the host in case the form control
 * itself is slotted into, for example, an item. Without that check a control
 * carrying slot="start"/"end" would treat every click on itself as a slotted
 * click.
 */
export const getSlottedClickContent = (ev: Event, el: HTMLElement): HTMLElement | null => {
  const slotted = (ev.target as HTMLElement).closest<HTMLElement>('[slot="start"], [slot="end"]');

  return slotted !== null && slotted !== el && el.contains(slotted) ? slotted : null;
};

/**
 * Whether a click started on content slotted into a form control's start or
 * end slot.
 */
const isSlottedClick = (ev: Event, el: HTMLElement): boolean => getSlottedClickContent(ev, el) !== null;

/**
 * Whether a click started on slotted content that handles its own click.
 *
 * The composed path is used rather than `closest` so that a control which
 * keeps its interactive element inside its own shadow root, such as
 * `ion-datetime-button`, is still recognized.
 */
const isInteractiveSlottedClick = (ev: Event, el: HTMLElement): boolean => {
  const slotted = getSlottedClickContent(ev, el);

  if (slotted === null) {
    return false;
  }

  const path = ev.composedPath();

  return path.slice(0, path.indexOf(slotted) + 1).some((node) => {
    const target = node as Node;

    return target.nodeType === Node.ELEMENT_NODE && (target as Element).matches(INTERACTIVE_CONTENT);
  });
};

/**
 * A utility for form components that wrap their content in a <label>, such as
 * ion-input, ion-textarea and ion-select.
 *
 * Clicking slotted content also clicks that label, and the browser follows it
 * with a click on the label's control. That second click would be emitted from
 * the host as a duplicate, so the slotted click is remembered and the click
 * that follows it is suppressed.
 *
 * Chromium and Firefox skip the forwarding when the click lands on interactive
 * content, such as a slotted button, so the slotted click is remembered for a
 * frame rather than until a forwarded click that may never arrive.
 *
 * A native control inside the host's shadow root is found through the composed
 * path, because its click is retargeted to the host. That click is already
 * emitted from the host, so only the duplicate is suppressed.
 *
 * Components using `delegatesFocus`, such as ion-textarea, can reject the focus
 * a press on interactive slotted content moves to the native control by calling
 * `handleMouseDown` from the label and `rejectFocus` from the focus handler.
 *
 * @internal
 * @param el - The host element.
 * @param getNativeInput - A callback returning the native form control the
 * label points at, for components that have one. Those components emit the
 * click from the host rather than the control. Omit it for components whose
 * label has no `for` attribute, such as ion-select, where the browser forwards
 * to an internal control that already re-bubbles targeting the host.
 */
export const createClickController = (
  el: HTMLElement,
  getNativeInput?: () => HTMLInputElement | HTMLTextAreaElement | undefined
): ClickController => {
  let hasSlottedClick = false;
  let rejectingFocus = false;
  let removeDisarmListeners: (() => void) | undefined;

  const handleClickCapture = (ev: Event) => {
    if (isSlottedClick(ev, el)) {
      hasSlottedClick = true;
      raf(() => (hasSlottedClick = false));
      return;
    }

    if (getNativeInput === undefined) {
      if (hasSlottedClick) {
        ev.stopPropagation();
        hasSlottedClick = false;
      }
      return;
    }

    const nativeInput = getNativeInput();
    if (nativeInput !== undefined && ev.composedPath()[0] === nativeInput) {
      const isRetargeted = el.shadowRoot !== null && nativeInput.getRootNode() === el.shadowRoot;

      if (hasSlottedClick || !isRetargeted) {
        ev.stopPropagation();
      }

      if (!hasSlottedClick && !isRetargeted) {
        el.click();
      }

      hasSlottedClick = false;
    }
  };

  /**
   * The press ends with a click, which can land outside the label, or with a
   * `dragstart` or `pointercancel` when no click comes. The listeners capture
   * so a slotted control calling `stopPropagation` can't leave it armed.
   */
  const armFocusRejection = () => {
    removeDisarmListeners?.();
    rejectingFocus = true;

    const events = ['click', 'dragstart', 'pointercancel'];
    const removeListeners = () => {
      removeDisarmListeners = undefined;
      events.forEach((name) => document.removeEventListener(name, disarm, true));
    };
    const disarm = () => {
      removeListeners();
      raf(() => (rejectingFocus = false));
    };

    removeDisarmListeners = removeListeners;
    events.forEach((name) => document.addEventListener(name, disarm, true));
  };

  const handleMouseDown = (ev: MouseEvent) => {
    if (ev.button !== 0 || !isInteractiveSlottedClick(ev, el)) {
      return;
    }

    armFocusRejection();
  };

  /**
   * Drops focus moved to the native control by a press on interactive slotted
   * content, and returns whether it did. WebKit forwards the label's click even
   * then, so focus goes back to the content it came from inside the host.
   */
  const rejectFocus = (ev: FocusEvent) => {
    if (!rejectingFocus) {
      return false;
    }

    const previous = ev.relatedTarget as HTMLElement | null;

    if (previous !== null && previous !== el && el.contains(previous)) {
      previous.focus();
    }

    // The related target can be a slotted host that isn't focusable, such as ion-button.
    const nativeInput = getNativeInput?.();
    if (
      nativeInput !== undefined &&
      (nativeInput.getRootNode() as Document | ShadowRoot).activeElement === nativeInput
    ) {
      nativeInput.blur();
    }

    return true;
  };

  const cancelFocusRejection = () => {
    removeDisarmListeners?.();
    rejectingFocus = false;
  };

  return { handleClickCapture, handleMouseDown, rejectFocus, cancelFocusRejection, destroy: cancelFocusRejection };
};
