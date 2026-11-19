import { raf } from '@utils/helpers';

export interface ClickController {
  handleClickCapture: (ev: Event) => void;
}

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
 * A utility for form components that wrap their content in a <label>, such as
 * ion-input, ion-textarea and ion-select.
 *
 * Clicking slotted content also clicks that label, and the browser follows it
 * with a click on the label's control. That second click would be emitted from
 * the host as a duplicate, so the slotted click is remembered and the click
 * that follows it is suppressed.
 *
 * Browsers skip the forwarding when the click lands on interactive content,
 * such as a slotted button, so the slotted click is remembered for a frame
 * rather than until a forwarded click that may never arrive.
 *
 * @internal
 * @param el - The host element.
 * @param getNativeInput - A callback returning the native form control the
 * label points at, for components that have one. Those components emit the
 * click from the host rather than the control, so the control's click is
 * always stopped and re-dispatched from the host. Omit it for components whose
 * label has no `for` attribute, such as ion-select, where the browser forwards
 * to an internal control that already re-bubbles targeting the host.
 */
export const createClickController = (
  el: HTMLElement,
  getNativeInput?: () => HTMLInputElement | HTMLTextAreaElement | undefined
): ClickController => {
  let hasSlottedClick = false;

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
