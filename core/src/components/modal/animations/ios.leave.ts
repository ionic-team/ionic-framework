import { Animation } from '../../../interface';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';

/**
 * iOS Modal Leave Animation
 */
export function iosLeaveAnimation(
  AnimationC: Animation,
  baseEl: HTMLElement,
  currentY = SwipeToCloseDefaults.MIN_Y_FULLSCREEN,
  currentBackdropOpacity = SwipeToCloseDefaults.MIN_BACKDROP_OPACITY,
  velocityY?: number
  ): Promise<Animation> {
  const duration = typeof velocityY !== 'undefined' ? 250 - Math.min(100, velocityY * 75) : 250;

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);
  // const wrapperElRect = wrapperEl!.getBoundingClientRect();

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', `${currentY}px`, `100%`);
                  // `${(baseEl.ownerDocument as any).defaultView.innerHeight - wrapperElRect.top}px`);

  backdropAnimation.fromTo('opacity', `${currentBackdropOpacity}`, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(duration)
    .add(backdropAnimation)
    .add(wrapperAnimation));
}
