import { Animation } from '../../../interface';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export function iosEnterCardAnimation(
  AnimationC: Animation,
  baseEl: HTMLElement,
  presentingEl?: HTMLElement,
  toY = SwipeToCloseDefaults.MIN_Y,
  toBackdropOpacity = SwipeToCloseDefaults.MIN_BACKDROP_OPACITY,
  toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE
  ): Promise<Animation> {
  // The top translate Y for the presenting element
  const presentingToY = SwipeToCloseDefaults.MIN_PRESENTING_Y;

  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', '100%', `${toY}px`);

  backdropAnimation.fromTo('opacity', 0.01, toBackdropOpacity);

  const bodyEl = document.body;
  bodyEl.style.backgroundColor = 'black';

  const presentingAnimation = new AnimationC();

  if (presentingEl) {
    presentingAnimation
      .beforeStyles({
        'transform': 'translateY(0)'
      })
      .beforeAddClass('presenting-view-card')
      .addElement(presentingEl)
      .duration(500)
      .fromTo('translateY', '0px', `${presentingToY}px`)
      .fromTo('scale', 1, toPresentingScale);
  }

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    // .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(500)
    .beforeAddClass('show-modal')
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(presentingAnimation));
}
