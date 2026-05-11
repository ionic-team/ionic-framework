import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import {
  calculateWindowAdjustment,
  getArrowDimensions,
  getPopoverDimensions,
  getPopoverPosition,
  getSafeAreaInsets,
  shouldShowArrow,
} from '../utils';

const POPOVER_IOS_BODY_PADDING = 5;

/**
 * Minimum edge margin for iOS popovers ensures visual spacing from screen
 * edges on devices without safe areas (e.g., older iPhones without notches).
 * Previously this was a hardcoded `safeAreaMargin = 25` that served dual
 * purpose: safe-area avoidance AND visual spacing. Now that actual safe-area
 * insets are read dynamically, this floor preserves the visual spacing when
 * safe-area values are 0.
 */
const POPOVER_IOS_MIN_EDGE_MARGIN = 25;

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
  const rawSafeArea = getSafeAreaInsets(doc as Document);
  const safeArea =
    size === 'cover'
      ? { top: 0, bottom: 0, left: 0, right: 0 }
      : {
          top: Math.max(rawSafeArea.top, POPOVER_IOS_MIN_EDGE_MARGIN),
          bottom: Math.max(rawSafeArea.bottom, POPOVER_IOS_MIN_EDGE_MARGIN),
          left: Math.max(rawSafeArea.left, POPOVER_IOS_MIN_EDGE_MARGIN),
          right: Math.max(rawSafeArea.right, POPOVER_IOS_MIN_EDGE_MARGIN),
        };

  const {
    originX,
    originY,
    top,
    left,
    bottom,
    checkSafeAreaLeft,
    checkSafeAreaRight,
    checkSafeAreaTop,
    checkSafeAreaBottom,
    arrowTop,
    arrowLeft,
    addPopoverBottomClass,
    hideArrow,
  } = calculateWindowAdjustment(
    side,
    results.top,
    results.left,
    padding,
    bodyWidth,
    bodyHeight,
    contentWidth,
    contentHeight,
    safeArea,
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
        let bottomValue = `${bottom}px`;
        if (checkSafeAreaBottom) {
          bottomValue = `${bottom}px + var(--ion-safe-area-bottom, 0px)`;
        }
        contentEl.style.setProperty('bottom', `calc(${bottomValue})`);
      }

      const safeAreaLeft = ' + var(--ion-safe-area-left, 0px)';
      const safeAreaRight = ' - var(--ion-safe-area-right, 0px)';

      let leftValue = `${left}px`;

      if (checkSafeAreaLeft) {
        leftValue = `${left}px${safeAreaLeft}`;
      }
      if (checkSafeAreaRight) {
        leftValue = `${left}px${safeAreaRight}`;
      }

      let topValue = `${top}px`;
      if (checkSafeAreaTop) {
        topValue = `${top}px + var(--ion-safe-area-top, 0px)`;
      }

      contentEl.style.setProperty('top', `calc(${topValue} + var(--offset-y, 0))`);
      contentEl.style.setProperty('left', `calc(${leftValue} + var(--offset-x, 0))`);
      contentEl.style.setProperty('transform-origin', `${originY} ${originX}`);

      if (arrowEl !== null) {
        const didAdjustBounds = results.top !== top || results.left !== left;
        const showArrow = !hideArrow && shouldShowArrow(side, didAdjustBounds, ev, trigger);

        if (showArrow) {
          arrowEl.style.setProperty('top', `calc(${arrowTop}px + var(--offset-y, 0))`);
          arrowEl.style.setProperty('left', `calc(${arrowLeft}px + var(--offset-x, 0))`);
        } else {
          arrowEl.style.setProperty('display', 'none');
        }
      }
    })
    .addAnimation([backdropAnimation, contentAnimation]);
};
