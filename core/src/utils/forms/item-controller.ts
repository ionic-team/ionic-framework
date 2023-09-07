import { hostContext } from '@utils/theme';

/**
 * This is a utility class that is used by form controls rendered inside of an `ion-item`.
 */
export const createItemController = (el: HTMLElement) => {
  let labelEl: HTMLLabelElement | undefined;

  const setLabelRef = (el?: HTMLLabelElement | undefined) => {
    labelEl = el;
  };

  /**
   * Prevents the click event from bubbling up and triggering the parent ion-item click listener,
   * when using a control inside of an ion-item.
   * @param ev The click event for the control's label.
   * @returns True if the click event should be allowed to bubble up, false if it should be stopped.
   */
  const controlClickHandler = (ev: MouseEvent) => {
    const path = ev.composedPath();
    const inItem = hostContext('ion-item', el);

    if (!inItem) {
      // If the control is not inside of an ion-item, allow the default click behavior.
      return true;
    }

    if (labelEl !== undefined) {
      if (!ev.isTrusted) {
        /**
         * If the event is not trusted, it is most likely a synthetic event
         * from the `ion-item` clicking the first interactive control inside of it.
         *
         * When that occurs, we do not want to allow the even to bubble up,
         * otherwise the `ion-item` will fire its click event twice.
         */
        ev.stopPropagation();
      }
      if (path.includes(labelEl)) {
        return false;
      }
    }
    return true;
  };

  return {
    setLabelRef,
    controlClickHandler,
  };
};

export type ItemController = ReturnType<typeof createItemController>;
