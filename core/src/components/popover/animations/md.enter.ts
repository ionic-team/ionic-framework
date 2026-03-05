import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import { calculateWindowAdjustment, getPopoverDimensions, getPopoverPosition, getSafeAreaInsets } from '../utils';

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
  // MD mode now applies safe-area insets (previously passed 0, ignoring all safe areas).
  // This is needed for Android edge-to-edge (API 36+) where system bars overlap content.
  const safeArea = size === 'cover' ? { top: 0, bottom: 0, left: 0, right: 0 } : getSafeAreaInsets(doc as Document);

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
    safeArea,
    results.originX,
    results.originY,
    results.referenceCoordinates
  );

  const safeAreaLeftCalc = ' + var(--ion-safe-area-left, 0px)';
  const safeAreaRightCalc = ' - var(--ion-safe-area-right, 0px)';

  let leftValue = `${left}px`;
  if (checkSafeAreaLeft) {
    leftValue = `${left}px${safeAreaLeftCalc}`;
  }
  if (checkSafeAreaRight) {
    leftValue = `${left}px${safeAreaRightCalc}`;
  }

  let topValue = `${top}px`;
  if (checkSafeAreaTop) {
    topValue = `${top}px + var(--ion-safe-area-top, 0px)`;
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
      if (bottom !== undefined) {
        let bottomValue = `${bottom}px`;
        if (checkSafeAreaBottom) {
          bottomValue = `${bottom}px + var(--ion-safe-area-bottom, 0px)`;
        }
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
      if (addPopoverBottomClass) {
        baseEl.classList.add('popover-bottom');
      }
    })
    .addAnimation([backdropAnimation, wrapperAnimation, contentAnimation, viewportAnimation]);
};
