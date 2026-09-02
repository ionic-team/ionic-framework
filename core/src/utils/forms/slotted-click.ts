import { raf } from '@utils/helpers';

export interface SlottedClickController {
  handleClickCapture: (ev: Event) => void;
}

/**
 * Whether a click started on content slotted into a form control's start or
 * end slot.
 *
 * The slotted element is compared against the host in case the form control
 * itself is slotted into, for example, an item. Without that check a control
 * carrying slot="start"/"end" would treat every click on itself as a slotted
 * click.
 */
export const isSlottedClick = (ev: Event, el: HTMLElement): boolean => {
  const slotted = (ev.target as HTMLElement).closest('[slot="start"], [slot="end"]');

  return slotted !== null && slotted !== el && el.contains(slotted);
};

/**
 * A utility for form components that wrap their content in a <label> pointing
 * at a native control, such as ion-input and ion-textarea.
 *
 * Those components emit the click event from the host rather than the native
 * control, which means re-dispatching the click when the native control is
 * the target. Clicking slotted content has already reached listeners on the
 * host by the time the label forwards a click to the native control, so the
 * forwarded click has to be left alone or a single click is emitted twice.
 *
 * Browsers skip that forwarding when the click lands on interactive content,
 * such as a slotted button, so the slotted click is remembered for a frame
 * rather than until a forwarded click that may never arrive.
 *
 * @internal
 * @param el - The host element (ion-input or ion-textarea).
 * @param getNativeInput - A callback that returns the native form control.
 */
export const createSlottedClickController = (
  el: HTMLElement,
  getNativeInput: () => HTMLInputElement | HTMLTextAreaElement | undefined
): SlottedClickController => {
  let hasSlottedClick = false;

  const handleClickCapture = (ev: Event) => {
    if (isSlottedClick(ev, el)) {
      hasSlottedClick = true;
      raf(() => (hasSlottedClick = false));
      return;
    }

    const nativeInput = getNativeInput();
    if (nativeInput !== undefined && ev.target === nativeInput) {
      ev.stopPropagation();

      if (!hasSlottedClick) {
        el.click();
      }

      hasSlottedClick = false;
    }
  };

  return { handleClickCapture };
};
