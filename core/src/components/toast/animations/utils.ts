import { win } from '@utils/browser';
import { printIonWarning } from '@utils/logging';
import type { Mode } from 'src/interface';

import type { ToastAnimationPosition, ToastPosition } from '../toast-interface';

/**
 * Calculate the CSS top and bottom position of the toast, to be used
 * as starting points for the animation keyframes.
 *
 * The default animations for both MD and iOS
 * use translateY, which calculates from the
 * top edge of the screen. This behavior impacts
 * how we compute the offset when a toast has
 * position='bottom' since we need to calculate from
 * the bottom edge of the screen instead.
 *
 * @param position The value of the toast's position prop.
 * @param positionAnchor The element the toast should be anchored to,
 * if applicable.
 * @param mode The toast component's mode (md, ios, etc).
 * @param toast A reference to the toast element itself.
 */
export function getAnimationPosition(
  position: ToastPosition,
  positionAnchor: HTMLElement | undefined,
  mode: Mode,
  toast: HTMLElement
): ToastAnimationPosition {
  /**
   * Start with a predefined offset from the edge the toast will be
   * positioned relative to, whether on the screen or anchor element.
   */
  let offset: number;
  if (mode === 'md') {
    offset = position === 'top' ? 8 : -8;
  } else {
    offset = position === 'top' ? 10 : -10;
  }

  /**
   * If positionAnchor is defined, add in the distance from the target
   * screen edge to the target anchor edge. For position="top", the
   * bottom anchor edge is targeted. For position="bottom", the top
   * anchor edge is targeted.
   */
  if (positionAnchor && win) {
    warnIfAnchorIsHidden(positionAnchor, toast);

    const box = positionAnchor.getBoundingClientRect();
    if (position === 'top') {
      offset += box.bottom;
    } else if (position === 'bottom') {
      /**
       * Just box.top is the distance from the top edge of the screen
       * to the top edge of the anchor. We want to calculate from the
       * bottom edge of the screen instead.
       */
      offset -= win.innerHeight - box.top;
    }

    /**
     * We don't include safe area here because that should already be
     * accounted for when checking the position of the anchor.
     */
    return {
      top: `${offset}px`,
      bottom: `${offset}px`,
    };
  } else {
    return {
      top: `calc(${offset}px + var(--ion-safe-area-top, 0px))`,
      bottom: `calc(${offset}px - var(--ion-safe-area-bottom, 0px))`,
    };
  }
}

/**
 * If the anchor element is hidden, getBoundingClientRect()
 * will return all 0s for it, which can cause unexpected
 * results in the position calculation when animating.
 */
function warnIfAnchorIsHidden(positionAnchor: HTMLElement, toast: HTMLElement) {
  if (positionAnchor.offsetParent === null) {
    printIonWarning(
      'The positionAnchor element for ion-toast was found in the DOM, but appears to be hidden. This may lead to unexpected positioning of the toast.',
      toast
    );
  }
}

/**
 * Returns the top offset required to place
 * the toast in the middle of the screen.
 * Only needed when position="toast".
 * @param toastHeight: The height of the ion-toast element
 * @param wrapperHeight: The height of the .toast-wrapper element
 * inside the toast's shadow root.
 */
export const getOffsetForMiddlePosition = (toastHeight: number, wrapperHeight: number) => {
  return Math.floor(toastHeight / 2 - wrapperHeight / 2);
};
