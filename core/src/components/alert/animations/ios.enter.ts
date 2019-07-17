import { Animation } from '../../../interface';

/**
 * iOS Alert Enter Animation
 */
export const iosEnterAnimation = (AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> => {
  const baseAnimation = new AnimationC();

  const backdropAnimation = new AnimationC();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = new AnimationC();
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));

  backdropAnimation.fromTo('opacity', 0.01, 0.3);

  wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);

  const ani = baseAnimation
    .addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .add(backdropAnimation)
    .add(wrapperAnimation);

  return Promise.resolve(ani);
};
