import { Animation } from '../../../index';

/**
 * Md Popover Enter Animation
 */
export default function mdEnterAnimation(Animation: Animation, baseElm: HTMLElement, ev?: Event): Animation {
  let originY = 'top';
  let originX = 'left';

  let contentEl = baseElm.querySelector('.popover-content') as HTMLElement;
  let contentDimentions = contentEl.getBoundingClientRect();
  let contentWidth = contentDimentions.width;
  let contentHeight = contentDimentions.height;

  let bodyWidth = window.innerWidth;
  let bodyHeight = window.innerHeight;

  // If ev was passed, use that for target element
  let targetDim =
    ev && ev.target && (ev.target as HTMLElement).getBoundingClientRect();

  let targetTop =
    targetDim && 'top' in targetDim
      ? targetDim.top
      : bodyHeight / 2 - contentHeight / 2;

  let targetLeft =
    targetDim && 'left' in targetDim
      ? targetDim.left
      : bodyWidth / 2 - contentWidth / 2;

  let targetHeight = (targetDim && targetDim.height) || 0;

  let popoverCSS: { top: any; left: any } = {
    top: targetTop,
    left: targetLeft
  };

  // If the popover left is less than the padding it is off screen
  // to the left so adjust it, else if the width of the popover
  // exceeds the body width it is off screen to the right so adjust
  if (popoverCSS.left < POPOVER_MD_BODY_PADDING) {
    popoverCSS.left = POPOVER_MD_BODY_PADDING;
  } else if (
    contentWidth + POPOVER_MD_BODY_PADDING + popoverCSS.left >
    bodyWidth
  ) {
    popoverCSS.left = bodyWidth - contentWidth - POPOVER_MD_BODY_PADDING;
    originX = 'right';
  }

  // If the popover when popped down stretches past bottom of screen,
  // make it pop up if there's room above
  if (
    targetTop + targetHeight + contentHeight > bodyHeight &&
    targetTop - contentHeight > 0
  ) {
    popoverCSS.top = targetTop - contentHeight;
    baseElm.className = baseElm.className + ' popover-bottom';
    originY = 'bottom';
    // If there isn't room for it to pop up above the target cut it off
  } else if (targetTop + targetHeight + contentHeight > bodyHeight) {
    contentEl.style.bottom = POPOVER_MD_BODY_PADDING + 'px';
  }

  contentEl.style.top = popoverCSS.top + 'px';
  contentEl.style.left = popoverCSS.left + 'px';
  contentEl.style.transformOrigin = originY + ' ' + originX;

  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.popover-backdrop'));
  backdropAnimation.fromTo('opacity', 0.01, 0.08);

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.popover-wrapper'));
  wrapperAnimation.fromTo('opacity', 0.01, 1);

  const contentAnimation = new Animation();
  contentAnimation.addElement(baseElm.querySelector('.popover-content'));
  contentAnimation.fromTo('scale', 0.001, 1);

  const viewportAnimation = new Animation();
  viewportAnimation.addElement(baseElm.querySelector('.popover-viewport'));
  viewportAnimation.fromTo('opacity', 0.01, 1);

  return baseAnimation
    .addElement(baseElm)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(300)
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(contentAnimation)
    .add(viewportAnimation);
}
const POPOVER_MD_BODY_PADDING = 12;
