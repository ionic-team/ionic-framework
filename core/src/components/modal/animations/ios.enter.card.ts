import { Animation } from '../../../interface';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export function iosEnterCardAnimation(AnimationC: Animation, baseEl: HTMLElement, presentingEl?: HTMLElement): Promise<Animation> {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));


  wrapperAnimation.beforeStyles({ 'opacity': 1 })
                  .fromTo('translateY', '100%', '44px');

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  const presentingAnimation = new AnimationC();

  if (presentingEl) {
    presentingAnimation
      .beforeStyles({
        'transform-origin': 'center top',
        'scale': 1,
        'translateY': '0px'
      })
      .addElement(presentingEl)
      .duration(4000)
      .fromTo('scale', 1, 0.8)
      .fromTo('translateY', '0px', '0px');
  }

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(4000)
    .beforeAddClass('show-modal')
    .add(backdropAnimation)
    .add(wrapperAnimation)
    .add(presentingAnimation));
}