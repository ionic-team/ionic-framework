import { Animation } from '../../../interface';

/**
 * Md Modal Enter Animation
 */
export function mdEnterAnimation(Animation: Animation, baseEl: HTMLElement): Promise<Animation> {
  const baseAnimation = new Animation();

  const backdropAnimation = new Animation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new Animation();
  wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

  wrapperAnimation
    .fromTo('opacity', 0.01, 1)
    .fromTo('translateY', '40px', '0px');

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  return Promise.resolve(baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(280)
    .beforeAddClass('show-modal')
    .add(backdropAnimation)
    .add(wrapperAnimation));
}
