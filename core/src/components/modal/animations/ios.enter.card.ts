import { Animation } from '../../../interface';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export function iosEnterCardAnimation(
  AnimationC: Animation,
  baseEl: HTMLElement,
  presentingEl?: HTMLElement,
  toY = 44,
  toBackdropOpacity = 0.4,
  toPresentingScale = 0.89
  ): Promise<Animation> {
  // The top translate Y for the presenting element
  const presentingToY = -12;

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
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(500)
    .beforeAddClass('show-modal')
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(presentingAnimation));
}
