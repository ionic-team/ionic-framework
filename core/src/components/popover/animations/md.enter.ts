import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import { calculateWindowAdjustment, getPopoverDimensions, getPopoverPosition } from '../utils';

const POPOVER_MD_BODY_PADDING = 12;

/**
 * Md Popover Enter Animation
 */
// TODO(FW-2832): types
export const mdEnterAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const { event: ev, size, trigger, reference, side, align } = opts;
  const doc = baseEl.ownerDocument as any;
  const isRTL = doc.dir === 'rtl';

  const bodyWidth = doc.defaultView.innerWidth;
  const bodyHeight = doc.defaultView.innerHeight;

  const root = getElementRoot(baseEl);
  const contentEl = root.querySelector('.popover-content') as HTMLElement;

  const referenceSizeEl = trigger || ev?.detail?.ionShadowTarget || ev?.target;
  const { contentWidth, contentHeight } = getPopoverDimensions(size, contentEl, referenceSizeEl);

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
    0,
    0,
    reference,
    side,
    align,
    defaultPosition,
    trigger,
    ev
  );

  const padding = size === 'cover' ? 0 : POPOVER_MD_BODY_PADDING;

  const {
    originX,
    originY,
    top,
    left,
    bottom,
    checkSafeAreaTop,
    checkSafeAreaBottom,
    checkSafeAreaLeft,
    checkSafeAreaRight,
  } = calculateWindowAdjustment(
    side,
    results.top,
    results.left,
    padding,
    bodyWidth,
    bodyHeight,
    contentWidth,
    contentHeight,
    0,
    results.originX,
    results.originY,
    results.referenceCoordinates
  );

  /**
   * Safe area CSS variable adjustments.
   * When the popover is positioned near an edge, we add the corresponding
   * safe-area inset to ensure the popover doesn't overlap with system UI
   * (status bars, home indicators, navigation bars on Android API 36+, etc.)
   */
  const safeAreaTop = ' + var(--ion-safe-area-top, 0)';
  const safeAreaBottom = ' + var(--ion-safe-area-bottom, 0)';
  const safeAreaLeft = ' + var(--ion-safe-area-left, 0)';
  const safeAreaRight = ' - var(--ion-safe-area-right, 0)';

  let topValue = `${top}px`;
  let bottomValue = bottom !== undefined ? `${bottom}px` : undefined;
  let leftValue = `${left}px`;

  if (checkSafeAreaTop) {
    topValue = `${top}px${safeAreaTop}`;
  }
  if (checkSafeAreaBottom && bottomValue !== undefined) {
    bottomValue = `${bottom}px${safeAreaBottom}`;
  }
  if (checkSafeAreaLeft) {
    leftValue = `${left}px${safeAreaLeft}`;
  }
  if (checkSafeAreaRight) {
    leftValue = `${left}px${safeAreaRight}`;
  }

  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const contentAnimation = createAnimation();
  const viewportAnimation = createAnimation();

  backdropAnimation
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
    .beforeStyles({
      'pointer-events': 'none',
    })
    .afterClearStyles(['pointer-events']);

  wrapperAnimation.addElement(root.querySelector('.popover-wrapper')!).duration(150).fromTo('opacity', 0.01, 1);

  contentAnimation
    .addElement(contentEl)
    .beforeStyles({
      top: `calc(${topValue} + var(--offset-y, 0px))`,
      left: `calc(${leftValue} + var(--offset-x, 0px))`,
      'transform-origin': `${originY} ${originX}`,
    })
    .beforeAddWrite(() => {
      if (bottomValue !== undefined) {
        contentEl.style.setProperty('bottom', `calc(${bottomValue})`);
      }
    })
    .fromTo('transform', 'scale(0.8)', 'scale(1)');

  viewportAnimation.addElement(root.querySelector('.popover-viewport')!).fromTo('opacity', 0.01, 1);

  return baseAnimation
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(300)
    .beforeAddWrite(() => {
      if (size === 'cover') {
        baseEl.style.setProperty('--width', `${contentWidth}px`);
      }
      if (originY === 'bottom') {
        baseEl.classList.add('popover-bottom');
      }
    })
    .addAnimation([backdropAnimation, wrapperAnimation, contentAnimation, viewportAnimation]);
};
