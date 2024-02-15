import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import {
  calculateWindowAdjustment,
  getArrowDimensions,
  getPopoverDimensions,
  getPopoverPosition,
  shouldShowArrow,
} from '../utils';

const POPOVER_IOS_BODY_PADDING = 5;

/**
 * iOS Popover Enter Animation
 */
// TODO(FW-2832): types
export const iosEnterAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const { event: ev, size, trigger, reference, side, align } = opts;
  const doc = baseEl.ownerDocument as any;
  const isRTL = doc.dir === 'rtl';
  const bodyWidth = doc.defaultView.innerWidth;
  const bodyHeight = doc.defaultView.innerHeight;

  const root = getElementRoot(baseEl);
  const contentEl = root.querySelector('.popover-content') as HTMLElement;
  const arrowEl = root.querySelector('.popover-arrow') as HTMLElement | null;

  const referenceSizeEl = trigger || ev?.detail?.ionShadowTarget || ev?.target;
  const { contentWidth, contentHeight } = getPopoverDimensions(size, contentEl, referenceSizeEl);
  const { arrowWidth, arrowHeight } = getArrowDimensions(arrowEl);

  const defaultPosition = {
    top: bodyHeight / 2 - contentHeight / 2,
    left: bodyWidth / 2 - contentWidth / 2,
    originX: isRTL ? 'right' : 'left',
    originY: 'top',
  };

  const results = getPopoverPosition(
    isRTL,
    contentWidth,
    contentHeight,
    arrowWidth,
    arrowHeight,
    reference,
    side,
    align,
    defaultPosition,
    trigger,
    ev
  );

  const padding = size === 'cover' ? 0 : POPOVER_IOS_BODY_PADDING;

  /**
   * NOTE: The original experience guessed at a safe area margin of 25
   * for non-cover popovers. This was changed to always be 0 here for
   * debugging purposes, so we can be sure any safe area adjustment we
   * see is only from what we implement for this fix.
   */
  // const margin = size === 'cover' ? 0 : 25;
  const margin = 0;

  const {
    originX,
    originY,
    top,
    left,
    bottom,
    // checkSafeAreaLeft,
    // checkSafeAreaRight,
    arrowTop,
    arrowLeft,
    addPopoverBottomClass,
  } = calculateWindowAdjustment(
    side,
    results.top,
    results.left,
    padding,
    bodyWidth,
    bodyHeight,
    contentWidth,
    contentHeight,
    margin,
    results.originX,
    results.originY,
    results.referenceCoordinates,
    results.arrowTop,
    results.arrowLeft,
    arrowHeight
  );

  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const contentAnimation = createAnimation();

  backdropAnimation
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
    .beforeStyles({
      'pointer-events': 'none',
    })
    .afterClearStyles(['pointer-events']);

  // In Chromium, if the wrapper animates, the backdrop filter doesn't work.
  // The Chromium team stated that this behavior is expected and not a bug. The element animating opacity creates a backdrop root for the backdrop-filter.
  // To get around this, instead of animating the wrapper, animate both the arrow and content.
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1148826
  contentAnimation
    .addElement(root.querySelector('.popover-arrow')!)
    .addElement(root.querySelector('.popover-content')!)
    .fromTo('opacity', 0.01, 1);
  // TODO(FW-4376) Ensure that arrow also blurs when translucent

  return baseAnimation
    .easing('ease')
    .duration(100)
    .beforeAddWrite(() => {
      if (size === 'cover') {
        baseEl.style.setProperty('--width', `${contentWidth}px`);
      }

      if (addPopoverBottomClass) {
        baseEl.classList.add('popover-bottom');
      }

      if (bottom !== undefined) {
        contentEl.style.setProperty('bottom', `${bottom}px`);
      }

      /**
       * NOTE: We account for safe area through pure CSS by clamping the popover position
       * between the safe area bounds. This works except for the arrow position in certain
       * circumstances. (See comments on arrow position below for what.) Breakdown of
       * values used for the top position:
       *
       * - Min: calc(var(--ion-safe-area-top, 0px) + var(--offset-y, 0px) + ${arrowHeight}px)
       *   Top edge of safe area, plus custom y offset, plus a little gap to make room for the arrow.
       *   Note that arrowHeight resolves to 0px if the arrow is not displayed.
       *
       * - Preferred: calc(${top}px + var(--offset-y, 0px))
       *   Normal calculated value of the popover, including any custom offset. The value of top
       *   already accounts for all conditions aside from safe area, since it's what we were using
       *   before the fix.
       *
       * - Max: calc(100% - ${contentHeight + arrowHeight}px - var(--ion-safe-area-bottom) + var(--offset-y, 0px))
       *   Bottom edge of screen, minus the total height of the popover (content + arrow), minus
       *   the bottom safe area margin, including custom y offset.
       *
       * The left position is the same, but using x-axis values instead. We do this through
       * pure CSS to avoid needing to call window.getComputedStyle() to figure out the computed
       * safe area, which is very expensive and would introduce performance issues.
       *
       * The clamp() function is available in all browsers we support as of Ionic v7, except for
       * Firefox. The function was introduced in Firefox 75, which is conveniently the new minimum
       * supported version in Ionic v8. As such, we'll probably want to just push the fix to v8,
       * if v8 isn't already out by the time we get to this.
       */
      contentEl.style.setProperty('top', `clamp(calc(var(--ion-safe-area-top, 0px) + var(--offset-y, 0px) + ${arrowHeight}px), calc(${top}px + var(--offset-y, 0px)), calc(100% - ${contentHeight + arrowHeight}px - var(--ion-safe-area-bottom) + var(--offset-y, 0px)))`);
      contentEl.style.setProperty('left', `clamp(calc(var(--ion-safe-area-left, 0px) + var(--offset-x, 0px)), calc(${left}px + var(--offset-x, 0px)), calc(100% - ${contentWidth}px - var(--ion-safe-area-right) + var(--offset-x, 0px)))`);
      contentEl.style.setProperty('transform-origin', `${originY} ${originX}`);

      if (arrowEl !== null) {
        const didAdjustBounds = results.top !== top || results.left !== left;
        const showArrow = shouldShowArrow(side, didAdjustBounds, ev, trigger);

        /**
         * NOTE: Currently the fix assumes a default value for the side prop, which always
         * puts the arrow either above or below the popover. There are additional tweaks
         * needed to handle the arrow being on the left or right side.
         */

        if (showArrow) {
          /**
           * NOTE: Basically the same positioning logic as the popover content, but using the
           * existing arrowTop and arrowLeft values instead. The hardcoded 5px in the left
           * position was an early attempt at preventing the arrow from being flush with
           * the left/right edge of the content, which causes it to look disconnected due
           * to the content's border radius.
           *
           * The problem with this approach is that the popover content hits the max value
           * sooner than the arrow, due to being taller. If you present a popover low enough
           * on the screen to need safe area adjustment, but not so low that the popover flips
           * to present above the trigger, the arrow will render overlapping the popover because
           * the content has been adjusted for safe area but the arrow has not.
           *
           * In theory, the most straightforward way of fixing this would be to calculate the
           * final rendered position of the popover and position the arrow relative to that.
           * However, this would require using window.getComputedStyle(), which is exactly
           * what we're trying to avoid.
           */
          arrowEl.style.setProperty('top', `clamp(calc(var(--ion-safe-area-top, 0px) + var(--offset-y, 0px)), calc(${arrowTop}px + var(--offset-y, 0px)), calc(100% - ${arrowHeight + contentHeight}px - var(--ion-safe-area-bottom) + var(--offset-y, 0px)))`);
          arrowEl.style.setProperty('left', `clamp(calc(var(--ion-safe-area-left, 0px) + var(--offset-x, 0px) + 5px), calc(${arrowLeft}px + var(--offset-x, 0px)), calc(100% - ${arrowWidth}px - var(--ion-safe-area-right) + var(--offset-x, 0px) - 5px))`);

          /**
           * NOTE: An early attempt at positioning the arrow relative to the content.
           * See comments in popover.tsx for details.
           */
          // arrowEl.style.setProperty('top', `-${arrowHeight}px`);
          // arrowEl.style.setProperty('left', `calc(${contentWidth / 2}px - ${arrowWidth / 2}px)`);

          /**
           * NOTE: Some quick and dirty debugging code which will position some debug elements
           * in the adjustment test template at the min, preferred, and max values for the
           * popover content's position. This can help visualize how things are being calculated.
           */
          // const minLine = document.querySelector('#min-line') as HTMLElement;
          // const preferredLine = document.querySelector('#preferred-line') as HTMLElement;
          // const maxLine = document.querySelector('#max-line') as HTMLElement;
          // minLine!.style.top = `calc(var(--ion-safe-area-top, 0px) + var(--offset-y, 0px))`;
          // preferredLine!.style.top = `calc(${arrowTop}px + var(--offset-y, 0px))`;
          // maxLine!.style.top = `calc(100% - ${arrowHeight + contentHeight}px - var(--ion-safe-area-bottom) + var(--offset-y, 0px))`;
        } else {
          arrowEl.style.setProperty('display', 'none');
        }
      }
    })
    .addAnimation([backdropAnimation, contentAnimation]);
};
