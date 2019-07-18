import { Animation } from '../../../interface';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';

/**
 * iOS Modal Leave Animation
 */
export function iosLeaveCardAnimation(
  AnimationC: Animation,
  baseEl: HTMLElement,
  presentingEl?: HTMLElement,
  currentY = SwipeToCloseDefaults.MIN_Y_CARD,
  currentBackdropOpacity = SwipeToCloseDefaults.MIN_BACKDROP_OPACITY,
  currentPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE,
  velocityY?: number
  ): Promise<Animation> {
  // The top translate Y for the presenting element
  const presentingFromY = SwipeToCloseDefaults.MIN_PRESENTING_Y;

  const duration = velocityY ? 500 - Math.min(400, velocityY * 200) : 500;

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);

  const presentingAnimation = new AnimationC();

  const bodyEl = document.body;
  const bodyAnimation = new AnimationC();
  bodyAnimation
    .addElement(bodyEl)
    .afterStyles({ 'background-color': '' });

  if (presentingEl) {
    presentingAnimation
      .addElement(presentingEl)
      .duration(duration)
      .fromTo('translateY', `${presentingFromY}px`, '0px')
      .fromTo('scale', currentPresentingScale, 1);
  }

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', `${currentY}px`, `100%`);

  backdropAnimation.fromTo('opacity', currentBackdropOpacity, 0.0);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(duration)
    .add(bodyAnimation)
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(presentingAnimation));
}
