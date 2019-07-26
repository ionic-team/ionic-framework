import { Animation } from '../../../interface';

/**
 * Md Popover Enter Animation
 */
export const mdEnterAnimation = (AnimationC: Animation, baseEl: HTMLElement, ev?: Event): Promise<Animation> => {
  const doc = (baseEl.ownerDocument as any);
  const isRTL = doc.dir === 'rtl';

  let originY = 'top';
  let originX = isRTL ? 'right' : 'left';

  const contentEl = baseEl.querySelector('.popover-content') as HTMLElement;
  const contentDimentions = contentEl.getBoundingClientRect();
  const contentWidth = contentDimentions.width;
  const contentHeight = contentDimentions.height;

  const bodyWidth = doc.defaultView.innerWidth;
  const bodyHeight = doc.defaultView.innerHeight;

  // If ev was passed, use that for target element
  const targetDim =
    ev && ev.target && (ev.target as HTMLElement).getBoundingClientRect();

  // As per MD spec, by default position the popover below the target (trigger) element
  const targetTop =
    targetDim != null && 'bottom' in targetDim
      ? targetDim.bottom
      : bodyHeight / 2 - contentHeight / 2;

  const targetLeft =
    targetDim != null && 'left' in targetDim
      ? isRTL
        ? targetDim.left - contentWidth + targetDim.width
        : targetDim.left
      : bodyWidth / 2 - contentWidth / 2;

  const targetHeight = (targetDim && targetDim.height) || 0;

  const popoverCSS: { top: any; left: any } = {
    top: targetTop,
    left: targetLeft
  };

  // If the popover left is less than the padding it is off screen
  // to the left so adjust it, else if the width of the popover
  // exceeds the body width it is off screen to the right so adjust
  if (popoverCSS.left < POPOVER_MD_BODY_PADDING) {
    popoverCSS.left = POPOVER_MD_BODY_PADDING;

    // Same origin in this case for both LTR & RTL
    // Note: in LTR, originX is already 'left'
    originX = 'left';
  } else if (
    contentWidth + POPOVER_MD_BODY_PADDING + popoverCSS.left >
    bodyWidth
  ) {
    popoverCSS.left = bodyWidth - contentWidth - POPOVER_MD_BODY_PADDING;

    // Same origin in this case for both LTR & RTL
    // Note: in RTL, originX is already 'right'
    originX = 'right';
  }

  // If the popover when popped down stretches past bottom of screen,
  // make it pop up if there's room above
  if (
    targetTop + targetHeight + contentHeight > bodyHeight &&
    targetTop - contentHeight > 0
  ) {
    popoverCSS.top = targetTop - contentHeight - targetHeight;
    baseEl.className = baseEl.className + ' popover-bottom';
    originY = 'bottom';
    // If there isn't room for it to pop up above the target cut it off
  } else if (targetTop + targetHeight + contentHeight > bodyHeight) {
    contentEl.style.bottom = POPOVER_MD_BODY_PADDING + 'px';
  }

  contentEl.style.top = popoverCSS.top + 'px';
  contentEl.style.left = popoverCSS.left + 'px';
  contentEl.style.transformOrigin = originY + ' ' + originX;

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
  backdropAnimation.fromTo('opacity', 0.01, 0.32);

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
  wrapperAnimation.fromTo('opacity', 0.01, 1);

  const contentAnimation = new AnimationC();
  contentAnimation.addElement(baseEl.querySelector('.popover-content'));
  contentAnimation.fromTo('scale', 0.001, 1);

  const viewportAnimation = new AnimationC();
  viewportAnimation.addElement(baseEl.querySelector('.popover-viewport'));
  viewportAnimation.fromTo('opacity', 0.01, 1);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(300)
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(contentAnimation)
    .add(viewportAnimation));
};

const POPOVER_MD_BODY_PADDING = 12;
