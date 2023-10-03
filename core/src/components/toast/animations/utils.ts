import { win } from '@utils/browser';
import { printIonWarning } from '@utils/logging';
import type { Mode } from 'src/interface';

import type { ToastAnimationPosition, ToastPosition } from '../toast-interface';

/**
 * Calculate the CSS top and bottom position of the toast, to be used
 * as starting points for the animation keyframes.
 *
 * Note that MD animates bottom-positioned toasts using style.bottom,
 * which calculates from the bottom edge of the screen, while iOS uses
 * translateY, which calculates from the top edge of the screen. This
 * is why the bottom calculates differ slightly between modes.
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
    offset = 8;
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
      if (mode === 'md') {
        offset += win.innerHeight - box.top;
      } else {
        offset -= win.innerHeight - box.top;
      }
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
      bottom:
        mode === 'md'
          ? `calc(${offset}px + var(--ion-safe-area-bottom, 0px))`
          : `calc(${offset}px - var(--ion-safe-area-bottom, 0px))`,
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
