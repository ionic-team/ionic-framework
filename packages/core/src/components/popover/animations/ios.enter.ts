import { Animation } from '../../../index';

/**
 * iOS Popover Enter Animation
 */
export default function iosEnterAnimation(Animation: Animation, baseElm: HTMLElement, ev?: Event): Promise<Animation> {
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
    targetDim && 'left' in targetDim ? targetDim.left : bodyWidth / 2;
  let targetWidth = (targetDim && targetDim.width) || 0;
  let targetHeight = (targetDim && targetDim.height) || 0;

  let arrowEl = baseElm.querySelector('.popover-arrow') as HTMLElement;

  let arrowDim = arrowEl.getBoundingClientRect();
  let arrowWidth = arrowDim.width;
  let arrowHeight = arrowDim.height;

  if (!targetDim) {
    arrowEl.style.display = 'none';
  }

  let arrowCSS = {
    top: targetTop + targetHeight,
    left: targetLeft + targetWidth / 2 - arrowWidth / 2
  };

  let popoverCSS: { top: any; left: any } = {
    top: targetTop + targetHeight + (arrowHeight - 1),
    left: targetLeft + targetWidth / 2 - contentWidth / 2
  };

  // If the popover left is less than the padding it is off screen
  // to the left so adjust it, else if the width of the popover
  // exceeds the body width it is off screen to the right so adjust
  //
  let checkSafeAreaLeft = false;
  let checkSafeAreaRight = false;

  // If the popover left is less than the padding it is off screen
  // to the left so adjust it, else if the width of the popover
  // exceeds the body width it is off screen to the right so adjust
  // 25 is a random/arbitrary number. It seems to work fine for ios11
  // and iPhoneX. Is it perfect? No. Does it work? Yes.
  if (popoverCSS.left < POPOVER_IOS_BODY_PADDING + 25) {
    checkSafeAreaLeft = true;
    popoverCSS.left = POPOVER_IOS_BODY_PADDING;
  } else if (
    contentWidth + POPOVER_IOS_BODY_PADDING + popoverCSS.left + 25 >
    bodyWidth
  ) {
    // Ok, so we're on the right side of the screen,
    // but now we need to make sure we're still a bit further right
    // cus....notchurally... Again, 25 is random. It works tho
    checkSafeAreaRight = true;
    popoverCSS.left = bodyWidth - contentWidth - POPOVER_IOS_BODY_PADDING;
    originX = 'right';
  }

  // make it pop up if there's room above
  if (
    targetTop + targetHeight + contentHeight > bodyHeight &&
    targetTop - contentHeight > 0
  ) {
    arrowCSS.top = targetTop - (arrowHeight + 1);
    popoverCSS.top = targetTop - contentHeight - (arrowHeight - 1);
    baseElm.className = baseElm.className + ' popover-bottom';
    originY = 'bottom';
    // If there isn't room for it to pop up above the target cut it off
  } else if (targetTop + targetHeight + contentHeight > bodyHeight) {
    contentEl.style.bottom = POPOVER_IOS_BODY_PADDING + '%';
  }

  arrowEl.style.top = arrowCSS.top + 'px';
  arrowEl.style.left = arrowCSS.left + 'px';

  contentEl.style.top = popoverCSS.top + 'px';
  contentEl.style.left = popoverCSS.left + 'px';

  if (checkSafeAreaLeft) {
    if (CSS.supports('left', 'constant(safe-area-inset-left)')) {
      contentEl.style.left = `calc(${popoverCSS.left}px + constant(safe-area-inset-left)`;
    } else if (CSS.supports('left', 'env(safe-area-inset-left)')) {
      contentEl.style.left = `calc(${popoverCSS.left}px + env(safe-area-inset-left)`;
    }
  }

  if (checkSafeAreaRight) {
    if (CSS.supports('right', 'constant(safe-area-inset-right)')) {
      contentEl.style.left = `calc(${popoverCSS.left}px - constant(safe-area-inset-right)`;
    } else if (CSS.supports('right', 'env(safe-area-inset-right)')) {
      contentEl.style.left = `calc(${popoverCSS.left}px - env(safe-area-inset-right)`;
    }
  }

  contentEl.style.transformOrigin = originY + ' ' + originX;

  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseElm.querySelector('.popover-backdrop'));
  backdropAnimation.fromTo('opacity', 0.01, 0.08);

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseElm.querySelector('.popover-wrapper'));
  wrapperAnimation.fromTo('opacity', 0.01, 1);

  return Promise.resolve(baseAnimation
    .addElement(baseElm)
    .easing('ease')
    .duration(100)
    .add(backdropAnimation)
    .add(wrapperAnimation));
}
const POPOVER_IOS_BODY_PADDING = 5;
